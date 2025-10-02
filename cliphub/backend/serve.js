import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

/* ================================
   ROTAS DE JOBS
================================ */
app.get("/jobs", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM jobs ORDER BY created_at DESC");
  res.json(rows);
});

app.post("/jobs", async (req, res) => {
  const { titulo, descricao, preco, empresa_id, video_base } = req.body;
  const { rows } = await pool.query(
    "INSERT INTO jobs (titulo, descricao, preco, empresa_id, video_base, status) VALUES ($1,$2,$3,$4,$5,'disponivel') RETURNING *",
    [titulo, descricao, preco, empresa_id, video_base]
  );
  res.json(rows[0]);
});

app.post("/jobs/:id/accept", async (req, res) => {
  const { id } = req.params;
  const { clipador_id } = req.body;
  const { rows } = await pool.query(
    "UPDATE jobs SET status='em_andamento', clipador_id=$1 WHERE id=$2 RETURNING *",
    [clipador_id, id]
  );
  res.json(rows[0]);
});

app.post("/jobs/:id/submit", async (req, res) => {
  const { id } = req.params;
  const { link_entrega } = req.body;
  const { rows } = await pool.query(
    "UPDATE jobs SET status='enviado', entrega_url=$1 WHERE id=$2 RETURNING *",
    [link_entrega, id]
  );
  res.json(rows[0]);
});

app.post("/jobs/:id/approve", async (req, res) => {
  const { id } = req.params;
  const jobRes = await pool.query("SELECT * FROM jobs WHERE id=$1", [id]);
  const job = jobRes.rows[0];

  if (!job) return res.status(404).json({ error: "Job não encontrado" });

  // Registrar pagamento
  const taxa = Math.max(2, job.preco * 0.12);
  const liquido = job.preco - taxa;

  await pool.query("BEGIN");
  try {
    await pool.query("UPDATE jobs SET status='aprovado' WHERE id=$1", [id]);
    await pool.query(
      "INSERT INTO pagamentos (job_id, clipador_id, valor, taxa, liquido) VALUES ($1,$2,$3,$4,$5)",
      [job.id, job.clipador_id, job.preco, taxa, liquido]
    );
    await pool.query("COMMIT");
    res.json({ success: true });
  } catch (err) {
    await pool.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  }
});

/* ================================
   ROTAS DE USUÁRIOS
================================ */
app.get("/empresas", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM empresas");
  res.json(rows);
});

app.get("/clipadores", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM clipadores");
  res.json(rows);
});

/* ================================
   START SERVER
================================ */
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`);
});
