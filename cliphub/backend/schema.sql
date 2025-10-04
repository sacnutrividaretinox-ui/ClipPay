-- ===============================
-- 📦 TABELA: EMPRESAS
-- ===============================
CREATE TABLE IF NOT EXISTS empresas (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  usuario TEXT,
  email TEXT,
  senha TEXT,
  descricao TEXT,
  foto_url TEXT,
  saldo DECIMAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ===============================
-- 👤 TABELA: CLIPADORES
-- ===============================
CREATE TABLE IF NOT EXISTS clipadores (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT,
  chave_pix TEXT,
  foto_url TEXT,
  saldo DECIMAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ===============================
-- 🎬 TABELA: CAMPANHAS
-- ===============================
CREATE TABLE IF NOT EXISTS campanhas (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  video_url TEXT,
  empresa_id INT REFERENCES empresas(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ===============================
-- 💰 TABELA: PAGAMENTOS
-- ===============================
CREATE TABLE IF NOT EXISTS pagamentos (
  id SERIAL PRIMARY KEY,
  empresa_id INT REFERENCES empresas(id) ON DELETE CASCADE,
  clipador_id INT REFERENCES clipadores(id) ON DELETE CASCADE,
  valor DECIMAL,
  taxa DECIMAL,
  liquido DECIMAL,
  data TIMESTAMP DEFAULT NOW()
);
