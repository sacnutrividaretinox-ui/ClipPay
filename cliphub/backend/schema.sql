-- ==============================
-- RESET TOTAL
-- ==============================
DROP TABLE IF EXISTS pagamentos CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS clipadores CASCADE;
DROP TABLE IF EXISTS empresas CASCADE;

-- ==============================
-- TABELA: empresas
-- ==============================
CREATE TABLE empresas (
    id SERIAL PRIMARY KEY,
    usuario TEXT NOT NULL,
    nome TEXT NOT NULL,
    descricao TEXT,
    email TEXT,
    senha TEXT,
    saldo DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==============================
-- TABELA: clipadores
-- ==============================
CREATE TABLE clipadores (
    id SERIAL PRIMARY KEY,
    usuario TEXT NOT NULL,
    nome TEXT NOT NULL,
    email TEXT,
    senha TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==============================
-- TABELA: jobs (campanhas)
-- ==============================
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    empresa_id INTEGER REFERENCES empresas(id) ON DELETE CASCADE,
    clipador_id INTEGER REFERENCES clipadores(id) ON DELETE SET NULL,
    midia TEXT,
    status TEXT DEFAULT 'ativo',
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==============================
-- TABELA: pagamentos
-- ==============================
CREATE TABLE pagamentos (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    clipador_id INTEGER REFERENCES clipadores(id) ON DELETE SET NULL,
    empresa_id INTEGER REFERENCES empresas(id) ON DELETE CASCADE,
    valor DECIMAL(10,2) NOT NULL,
    taxa DECIMAL(10,2) DEFAULT 0,
    liquido DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==============================
-- INSERTS INICIAIS (opcional)
-- ==============================
INSERT INTO empresas (usuario, nome, descricao, email, senha, saldo)
VALUES 
('empresa01', 'Agência Criativa', 'Criação de campanhas publicitárias', 'contato@agenciacriativa.com', '123456', 1500),
('empresa02', 'Loja Online', 'Varejo e promoções digitais', 'vendas@lojaonline.com', '123456', 3000);

INSERT INTO clipadores (usuario, nome, email, senha)
VALUES 
('clipador01', 'João Editor', 'joao@clipador.com', '123456'),
('clipador02', 'Maria Clip', 'maria@clipadora.com', '123456');

INSERT INTO jobs (titulo, descricao, preco, empresa_id, midia)
VALUES
('Campanha Verão', 'Criação de vídeos para divulgar a coleção de verão', 200.00, 1, 'https://via.placeholder.com/400x300?text=Campanha+Verão'),
('Campanha Black Friday', 'Vídeos curtos para anúncios da Black Friday', 300.00, 2, 'https://via.placeholder.com/400x300?text=Black+Friday');

INSERT INTO pagamentos (job_id, clipador_id, empresa_id, valor, taxa, liquido)
VALUES
(1, 1, 1, 200.00, 20.00, 180.00),
(2, 2, 2, 300.00, 30.00, 270.00);
