import express from "express";
import { pool } from "./db.js";

const router = express.Router();

// Listar todos os clipadores
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clipadores ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar clipadores" });
  }
});

// Criar clipador
router.post("/", async (req, res) => {
  try {
    const { nome, chave_pix, saldo } = req.body;
    const result = await pool.query(
      "INSERT INTO clipadores (nome, chave_pix, saldo) VALUES ($1, $2, $3) RETURNING *",
      [nome, chave_pix, saldo || 0]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar clipador" });
  }
});

export default router;
