import { useEffect, useState } from "react";

export default function Campanhas() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:4000/jobs");
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error("Erro ao buscar campanhas:", err);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📢 Campanhas</h2>

      {jobs.length === 0 ? (
        <p className="text-gray-500">Nenhuma campanha disponível ainda.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border rounded-lg shadow p-4 bg-white"
            >
              {/* Cabeçalho com usuário/empresa */}
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    job.titulo
                  )}&background=random`}
                  alt="avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold">{job.titulo}</p>
                  <span className="text-gray-500 text-sm">Campanha #{job.id}</span>
                </div>
              </div>

              {/* Conteúdo de mídia */}
              {job.midia && (
                job.midia.includes("mp4") ? (
                  <video
                    src={job.midia}
                    controls
                    className="w-full rounded-lg mb-3"
                  />
                ) : (
                  <img
                    src={job.midia}
                    alt="conteúdo"
                    className="w-full rounded-lg mb-3"
                  />
                )
              )}

              {/* Descrição */}
              <p className="text-gray-800 mb-2">{job.descricao}</p>

              {/* Preço */}
              <p className="text-green-600 font-bold">
                💰 R$ {job.preco || 0}
              </p>

              {/* Botão de ação */}
              <button
                onClick={() => alert(`Você baixou a campanha ${job.id}`)}
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                📥 Baixar Campanha
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
