-- Apagar tabelas antigas na ordem certa (respeitando dependências)
DROP TABLE IF EXISTS pagamentos CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS clipadores CASCADE;
DROP TABLE IF EXISTS empresas CASCADE;

-- Criar tabela de empresas
CREATE TABLE IF NOT EXISTS empresas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    saldo NUMERIC DEFAULT 0
);

-- Criar tabela de clipadores
CREATE TABLE IF NOT EXISTS clipadores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

-- Criar tabela de jobs
CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    empresa_id INT REFERENCES empresas(id) ON DELETE CASCADE
);

-- Criar tabela de pagamentos
CREATE TABLE IF NOT EXISTS pagamentos (
    id SERIAL PRIMARY KEY,
    clipador_id INT REFERENCES clipadores(id) ON DELETE CASCADE,
    empresa_id INT REFERENCES empresas(id) ON DELETE CASCADE,
    valor NUMERIC NOT NULL,
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
