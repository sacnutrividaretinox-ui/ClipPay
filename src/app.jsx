import { useState, useEffect } from "react";

export default function App() {
  const [pagina, setPagina] = useState("dashboard");
  const [jobs, setJobs] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");

  // Carregar campanhas do backend
  const carregarJobs = async () => {
    try {
      const res = await fetch("http://localhost:4000/jobs");
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Erro ao carregar jobs:", err);
    }
  };

  useEffect(() => {
    if (pagina === "campanhas") carregarJobs();
  }, [pagina]);

  // Criar nova campanha
  const criarCampanha = async (e) => {
    e.preventDefault();
    try {
      const novaCampanha = {
        titulo,
        descricao,
        preco,
        empresa_id: 1, // por enquanto fixo
        clipador_id: null,
      };

      const res = await fetch("http://localhost:4000/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaCampanha),
      });

      if (!res.ok) throw new Error("Erro ao criar campanha");

      await carregarJobs();
      setTitulo("");
      setDescricao("");
      setPreco("");
      alert("Campanha criada com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao criar campanha!");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <h1 className="text-2xl font-bold p-4">ClipHub</h1>
        <nav className="flex flex-col">
          <button
            onClick={() => setPagina("dashboard")}
            className="p-3 text-left hover:bg-gray-200"
          >
            Dashboard
          </button>
          <button
            onClick={() => setPagina("campanhas")}
            className="p-3 text-left hover:bg-gray-200"
          >
            Campanhas
          </button>
          <button
            onClick={() => setPagina("financeiro")}
            className="p-3 text-left hover:bg-gray-200"
          >
            Financeiro
          </button>
        </nav>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 p-6 overflow-y-auto">
        {pagina === "dashboard" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded shadow">Saldo R$ 0</div>
              <div className="bg-white p-4 rounded shadow">Campanhas 0</div>
              <div className="bg-white p-4 rounded shadow">Clipes aprovados 0</div>
              <div className="bg-white p-4 rounded shadow">Gasto total R$ 0</div>
            </div>
          </div>
        )}

        {pagina === "campanhas" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Campanhas</h2>

            {/* Formulário */}
            <form onSubmit={criarCampanha} className="space-y-3 bg-white p-4 rounded shadow mb-6">
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
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
                Criar Campanha
              </button>
            </form>

            {/* Feed estilo Instagram */}
            <div className="flex flex-col gap-6">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <div key={job.id} className="bg-white rounded shadow p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          job.titulo
                        )}`}
                        alt="avatar"
                        className="w-10 h-10 rounded-full"
                      />
                      <span className="font-semibold">Empresa {job.empresa_id}</span>
                    </div>
                    <div className="mb-3">
                      <img
                        src="https://via.placeholder.com/600x300"
                        alt="preview"
                        className="rounded"
                      />
                    </div>
                    <p className="font-bold">{job.titulo}</p>
                    <p className="text-gray-600">{job.descricao}</p>
                    <p className="text-indigo-600 font-semibold">R$ {job.preco}</p>
                  </div>
                ))
              ) : (
                <p>Nenhuma campanha criada ainda.</p>
              )}
            </div>
          </div>
        )}

        {pagina === "financeiro" && (
          <div>
            <h2 className="text-2xl font-bold">Financeiro</h2>
            <p>Extrato e movimentações financeiras em breve...</p>
          </div>
        )}
      </main>
    </div>
  );
}
