import { useState, useEffect } from "react";

function App() {
  const [pagina, setPagina] = useState("dashboard");
  const [jobs, setJobs] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [midia, setMidia] = useState("");

  // Buscar jobs do backend
  async function carregarJobs() {
    try {
      const res = await fetch("http://localhost:4000/jobs");
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Erro ao carregar jobs", err);
    }
  }

  useEffect(() => {
    carregarJobs();
  }, []);

  // Criar campanha
  async function criarCampanha(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, descricao, preco, midia }),
      });
      if (!res.ok) throw new Error("Erro ao criar campanha");
      alert("Campanha criada com sucesso!");
      setTitulo("");
      setDescricao("");
      setPreco("");
      setMidia("");
      carregarJobs();
    } catch (err) {
      alert("Erro ao criar campanha!");
    }
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-6">ClipHub</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setPagina("dashboard")}
                className="w-full text-left px-2 py-1 rounded hover:bg-gray-700"
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => setPagina("campanhas")}
                className="w-full text-left px-2 py-1 rounded hover:bg-gray-700"
              >
                Campanhas
              </button>
            </li>
            <li>
              <button
                onClick={() => setPagina("financeiro")}
                className="w-full text-left px-2 py-1 rounded hover:bg-gray-700"
              >
                Financeiro
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        {pagina === "dashboard" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded shadow">Saldo R$ 0</div>
              <div className="bg-white p-4 rounded shadow">
                Campanhas {jobs.length}
              </div>
              <div className="bg-white p-4 rounded shadow">
                Clipes aprovados 0
              </div>
              <div className="bg-white p-4 rounded shadow">Gasto total R$ 0</div>
            </div>
            <h2 className="text-xl font-semibold">Últimas movimentações</h2>
            <p className="text-gray-600">Nenhuma movimentação recente</p>
          </div>
        )}

        {pagina === "campanhas" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Campanhas</h1>

            {/* Formulário */}
            <form
              onSubmit={criarCampanha}
              className="space-y-3 bg-white p-4 rounded shadow mb-6"
            >
              <input
                type="text"
                placeholder="Título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="border p-2 w-full rounded"
              />
              <textarea
                placeholder="Descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="border p-2 w-full rounded"
              />
              <input
                type="number"
                placeholder="Preço"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                className="border p-2 w-full rounded"
              />
              <input
                type="text"
                placeholder="URL da imagem ou vídeo"
                value={midia}
                onChange={(e) => setMidia(e.target.value)}
                className="border p-2 w-full rounded"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded"
              >
                Criar Campanha
              </button>
            </form>

            {/* Feed */}
            <div className="space-y-6">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded shadow p-4">
                  <h3 className="font-bold text-lg mb-2">{job.titulo}</h3>
                  <p className="text-gray-600 mb-2">{job.descricao}</p>

                  <div className="mb-3">
                    {job.midia?.includes("youtube") ? (
                      <iframe
                        src={job.midia}
                        title="video"
                        className="w-full h-64 rounded"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <img
                        src={job.midia || "https://via.placeholder.com/600x300"}
                        alt="preview"
                        className="rounded w-full"
                      />
                    )}
                  </div>

                  <p className="text-sm font-semibold">Preço: R$ {job.preco}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {pagina === "financeiro" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Financeiro</h1>
            <p className="text-gray-600">Em breve...</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
