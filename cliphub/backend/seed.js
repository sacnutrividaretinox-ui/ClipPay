import { pool } from "./db.js";

async function seed() {
  try {
    // Limpar tabelas antes de inserir
    await pool.query("DELETE FROM pagamentos");
    await pool.query("DELETE FROM jobs");
    await pool.query("DELETE FROM clipadores");
    await pool.query("DELETE FROM empresas");

    // Inserir empresas
    const empresas = await pool.query(
      `INSERT INTO empresas (nome, saldo) 
       VALUES 
       ('Acme Tech', 500),
       ('Mídia Criativa', 1200),
       ('Produtora X', 800)
       RETURNING *`
    );

    // Inserir clipadores
    const clipadores = await pool.query(
      `INSERT INTO clipadores (nome, email) 
       VALUES 
       ('João Silva', 'joao@email.com'),
       ('Maria Santos', 'maria@email.com'),
       ('Carlos Souza', 'carlos@email.com')
       RETURNING *`
    );

    // Inserir jobs
    const jobs = await pool.query(
      `INSERT INTO jobs (titulo, descricao, empresa_id) 
       VALUES 
       ('Clipes de futebol', 'Criar 5 cortes de melhores momentos.', ${empresas.rows[0].id}),
       ('Cortes de podcast', 'Editar e cortar 10 trechos.', ${empresas.rows[1].id}),
       ('Trailer promocional', 'Montar trailer de 1min.', ${empresas.rows[2].id})
       RETURNING *`
    );

    // Inserir pagamentos
    await pool.query(
      `INSERT INTO pagamentos (clipador_id, empresa_id, valor) 
       VALUES 
       (${clipadores.rows[0].id}, ${empresas.rows[0].id}, 200),
       (${clipadores.rows[1].id}, ${empresas.rows[1].id}, 300),
       (${clipadores.rows[2].id}, ${empresas.rows[2].id}, 250)`
    );

    console.log("✅ Seed rodado com sucesso!");
    process.exit();
  } catch (err) {
    console.error("❌ Erro ao rodar seed:", err.message);
    process.exit(1);
  }
}

seed();
