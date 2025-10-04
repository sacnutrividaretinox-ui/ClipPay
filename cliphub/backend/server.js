import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());

// 🧩 Conexão com PostgreSQL (Railway)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// 🔐 Middleware para proteger rotas admin
function verificarAdmin(req, res, next) {
  const token = req.headers.authorization;
  if (token === `Bearer ${process.env.ADMIN_TOKEN}`) {
    next();
  } else {
    res.status(403).json({ error: "Acesso negado" });
  }
}

// ✅ Teste inicial
app.get("/", (req, res) => {
  res.send("🚀 Backend ClipHub ativo!");
});


// ----------------------
// 📁 EMPRESAS
// ----------------------
app.get("/empresas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM empresas ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------------
// 📁 CLIPADORES
// ----------------------
app.get("/clipadores", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clipadores ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------------
// 🎬 CAMPANHAS
// ----------------------
app.get("/campanhas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM campanhas ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📥 Criar nova campanha (rota protegida)
app.post("/campanhas", verificarAdmin, async (req, res) => {
  const { titulo, descricao, video_url, empresa_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO campanhas (titulo, descricao, video_url, empresa_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [titulo, descricao, video_url, empresa_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ❌ Deletar campanha (rota protegida)
app.delete("/campanhas/:id", verificarAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM campanhas WHERE id = $1", [id]);
    res.json({ success: true, message: "Campanha deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ----------------------
// 🧾 PAGAMENTOS
// ----------------------
app.get("/pagamentos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pagamentos ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🚀 Porta (Railway ou local)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`);
});
