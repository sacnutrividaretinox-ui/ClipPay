import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// Listar jobs
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM jobs ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar job
router.post("/", async (req, res) => {
  try {
    const { titulo, descricao, empresa_id } = req.body;
    const result = await pool.query(
      "INSERT INTO jobs (titulo, descricao, empresa_id) VALUES ($1, $2, $3) RETURNING *",
      [titulo, descricao, empresa_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
