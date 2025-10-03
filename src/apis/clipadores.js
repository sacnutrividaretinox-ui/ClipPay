import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// Listar clipadores
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clipadores ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar clipador
router.post("/", async (req, res) => {
  try {
    const { nome, email } = req.body;
    const result = await pool.query(
      "INSERT INTO clipadores (nome, email) VALUES ($1, $2) RETURNING *",
      [nome, email]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
