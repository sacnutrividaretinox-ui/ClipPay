import express from "express";
import { pool } from "../db.js";
const router = express.Router();

function checkAdmin(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.replace("Bearer ", "");
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// Listar campanhas
router.get("/campaigns", checkAdmin, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM jobs ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar campanha
router.post("/campaigns", checkAdmin, async (req, res) => {
  try {
    const { titulo, descricao, empresa_id, preco, status } = req.body;
    const result = await pool.query(
      `INSERT INTO jobs (titulo, descricao, empresa_id, preco, status)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [titulo, descricao, empresa_id || null, preco || null, status || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar campanha
router.put("/campaigns/:id", checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, empresa_id, preco, status } = req.body;
    const result = await pool.query(
      `UPDATE jobs SET titulo=$1, descricao=$2, empresa_id=$3, preco=$4, status=$5
       WHERE id=$6 RETURNING *`,
      [titulo, descricao, empresa_id || null, preco || null, status || null, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar campanha
router.delete("/campaigns/:id", checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM jobs WHERE id=$1", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
