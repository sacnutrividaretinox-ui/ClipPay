import express from "express";
import { pool } from "./db.js";

const router = express.Router();

// Listar pagamentos
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pagamentos ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar pagamentos" });
  }
});

// Registrar pagamento
router.post("/", async (req, res) => {
  try {
    const { job_id, clipador_id, valor, taxa, liquido } = req.body;
    const result = await pool.query(
      `INSERT INTO pagamentos (job_id, clipador_id, valor, taxa, liquido)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [job_id, clipador_id, valor, taxa, liquido]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao registrar pagamento" });
  }
});

export default router;
