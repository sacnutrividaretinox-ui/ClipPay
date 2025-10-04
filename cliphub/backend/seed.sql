import pool from "./db.js";

async function seed() {
  try {
    console.log("🌱 Iniciando seed...");

    // Limpar tabelas antes
    await pool.query("DELETE FROM pagamentos");
    await pool.query("DELETE FROM jobs");
    await pool.query("DELETE FROM clipadores");
    await pool.query("DELETE FROM empresas");

    // Inserir empresa de teste
    const empresaResult = await pool.query(
      `INSERT INTO empresas (usuario, nome, descricao, saldo)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      ["empresa_teste", "Agência XPTO", "Agência de marketing digital", 1000]
    );
    const empresa = empresaResult.rows[0];

    // Inserir clipador de teste
    const clipadorResult = await pool.query(
      `INSERT INTO clipadores (usuario, nome)
       VALUES ($1, $2) RETURNING *`,
      ["clipador_teste", "João Editor"]
    );
    const clipador = clipadorResult.rows[0];

    // Inserir campanha (job)
    const jobResult = await pool.query(
      `INSERT INTO jobs (titulo, descricao, preco, empresa_id, clipador_id, midia)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        "Campanha Black Friday",
        "Criação de vídeos curtos para redes sociais",
        250,
        empresa.id,
        clipador.id,
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ" // vídeo exemplo
      ]
    );
    const job = jobResult.rows[0];

    // Inserir pagamento
    await pool.query(
      `INSERT INTO pagamentos (job_id, clipador_id, valor, taxa, liquido)
       VALUES ($1, $2, $3, $4, $5)`,
      [job.id, clipador.id, 250, 25, 225]
    );

    console.log("✅ Seed concluído com sucesso!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erro ao rodar seed:", err);
    process.exit(1);
  }
}

seed();
