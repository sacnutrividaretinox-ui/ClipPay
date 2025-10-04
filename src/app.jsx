import { useEffect, useState } from "react";
import {
  getEmpresas,
  getClipadores,
  getJobs,
  getPagamentos,
} from "./apis";

export default function App() {
  const [empresas, setEmpresas] = useState([]);
  const [clipadores, setClipadores] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [pagina, setPagina] = useState("dashboard");

  // Carregar dados da API
  useEffect(() => {
    (async () => {
      try {
        setEmpresas(await getEmpresas());
        setClipadores(await getClipadores());
        setJobs(await getJobs());
        setPagamentos(await getPagamentos());
      } catch (err) {
        console.error("Erro ao carregar dados", err);
      }
    })();
  }, []);

  // --- Cálculos gerais
  const saldoTotal = empresas.reduce((acc, e) => acc + Number(e.saldo || 0), 0);
  const totalCampanhas = jobs.length;
  const totalClipes = jobs.filter((j) => j.status === "aprovado").length;
  const gastoTotal = pagamentos.reduce((acc, p) => acc + Number(p.valor || 0), 0);

  // Últimas movimentações
  const ultimasMov = jobs.slice(-3).reverse();

  return (
    <div className="h-screen flex font-sans bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h1 className="text-2xl font-bold mb-6">ClipHub</h1>
        <nav className="flex flex-col gap-2">
          <button
            className={`text-left px-3 py-2 rounded ${
              pagina === "dashboard" ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
            }`}
            onClick={() => setPagina("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`text-left px-3 py-2 rounded ${
              pagina === "campanhas" ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
            }`}
            onClick={() => setPagina("campanhas")}
          >
            Campanhas
          </button>
          <button
            className={`text-left px-3 py-2 rounded ${
              pagina === "financeiro" ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
            }`}
            onClick={() => setPagina("financeiro")}
          >
            Financeiro
          </button>
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        {pagina === "dashboard" && (
          <>
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-4 rounded shadow">
                <p className="text-gray-500">Saldo</p>
                <p className="text-xl font-bold">R$ {saldoTotal}</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <p className="text-gray-500">Campanhas</p>
                <p className="text-xl font-bold">{totalCampanhas}</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <p className="text-gray-500">Clipes aprovados</p>
                <p className="text-xl font-bold">{totalClipes}</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <p className="text-gray-500">Gasto total</p>
                <p className="text-xl font-bold">R$ {gastoTotal}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-4">Últimas movimentações</h3>
              <ul className="divide-y">
                {ultimasMov.length > 0 ? (
                  ultimasMov.map((j) => (
                    <li key={j.id} className="py-2">
                      <p className="font-medium">{j.titulo}</p>
                      <p className="text-sm text-gray-500">{j.descricao}</p>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    Nenhuma movimentação recente
                  </p>
                )}
              </ul>
            </div>
          </>
        )}

        {pagina === "campanhas" && (
  <>
    <h2 className="text-2xl font-bold mb-6">Campanhas</h2>

    <div className="flex flex-col gap-6">
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <div key={job.id} className="bg-white rounded shadow p-4">
            {/* Cabeçalho com perfil */}
            <div className="flex items-center gap-3 mb-3">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  empresas.find((e) => e.id === job.empresa_id)?.nome || "Empresa"
                )}&background=random`}
                alt="Empresa"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold text-sm">
                  {empresas.find((e) => e.id === job.empresa_id)?.nome ||
                    "Empresa"}
                </p>
                <p className="text-xs text-gray-500">
                  usuário_{job.empresa_id}
                </p>
              </div>
            </div>

            {/* Preview do conteúdo */}
            {job.video_base ? (
              <video
                controls
                className="w-full rounded mb-3"
                src={job.video_base}
              />
            ) : (
              <div className="w-full h-60 bg-gray-200 flex items-center justify-center rounded mb-3">
                <span className="text-gray-500">Prévia da campanha</span>
              </div>
            )}

            {/* Descrição */}
            <p className="text-gray-800 text-sm">{job.descricao}</p>

            {/* Footer (ações futuras) */}
            <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
              <span>Status: {job.status}</span>
              <span>💰 R$ {job.preco}</span>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Nenhuma campanha cadastrada</p>
      )}
    </div>
  </>
)}


        {pagina === "financeiro" && (
          <>
            <h2 className="text-2xl font-bold mb-6">Financeiro</h2>
            <div className="bg-white p-4 rounded shadow">
              {pagamentos.length > 0 ? (
                <table className="w-full border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left p-2 border">Job</th>
                      <th className="text-left p-2 border">Clipador</th>
                      <th className="text-left p-2 border">Valor</th>
                      <th className="text-left p-2 border">Taxa</th>
                      <th className="text-left p-2 border">Líquido</th>
                      <th className="text-left p-2 border">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagamentos.map((p) => (
                      <tr key={p.id}>
                        <td className="p-2 border">{p.job_id}</td>
                        <td className="p-2 border">{p.clipador_id}</td>
                        <td className="p-2 border">R$ {p.valor}</td>
                        <td className="p-2 border">R$ {p.taxa}</td>
                        <td className="p-2 border">R$ {p.liquido}</td>
                        <td className="p-2 border">
                          {new Date(p.data).toLocaleDateString("pt-BR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">Nenhum pagamento registrado</p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
