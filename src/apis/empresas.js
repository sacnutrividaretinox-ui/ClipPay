import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// Listar empresas
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM empresas ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar empresa
router.post("/", async (req, res) => {
  try {
    const { nome, saldo } = req.body;
    const result = await pool.query(
      "INSERT INTO empresas (nome, saldo) VALUES ($1, $2) RETURNING *",
      [nome, saldo || 0]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
