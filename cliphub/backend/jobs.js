import express from "express";
import { pool } from "./db.js";

const router = express.Router();

// Listar todos os jobs
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM jobs ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar jobs" });
  }
});

// Criar job
router.post("/", async (req, res) => {
  try {
    const { titulo, descricao, preco, midia } = req.body;

    const result = await pool.query(
      `INSERT INTO jobs (titulo, descricao, preco, empresa_id, clipador_id, midia)
       VALUES ($1, $2, $3, 1, NULL, $4) RETURNING *`,
      [titulo, descricao, preco, midia]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar job" });
  }
});

export default router;
