import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// Listar pagamentos
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pagamentos ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar pagamento
router.post("/", async (req, res) => {
  try {
    const { clipador_id, empresa_id, valor } = req.body;
    const result = await pool.query(
      "INSERT INTO pagamentos (clipador_id, empresa_id, valor) VALUES ($1, $2, $3) RETURNING *",
      [clipador_id, empresa_id, valor]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
