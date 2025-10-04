import express from "express";
import { pool } from "./db.js";

const router = express.Router();

// Criar campanha
router.post("/", async (req, res) => {
  try {
    const { titulo, descricao, preco, midia } = req.body;

    if (!titulo || !descricao) {
      return res.status(400).json({ error: "Título e descrição são obrigatórios" });
    }

    const result = await pool.query(
      `INSERT INTO jobs (titulo, descricao, preco, midia) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [titulo, descricao, preco || 0, midia || null]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao criar job:", err);
    res.status(500).json({ error: "Erro ao criar job" });
  }
});

export default router;
