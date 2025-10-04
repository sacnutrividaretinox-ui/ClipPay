import { useEffect, useState } from "react";
import axios from "axios";

export default function Entregas() {
  const [jobs, setJobs] = useState([]);
  const [upload, setUpload] = useState({ job_id: "", entrega_url: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarJobs();
  }, []);

  const carregarJobs = async () => {
    try {
      const res = await axios.get("http://localhost:4000/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error("Erro ao carregar jobs:", err);
    }
  };

  const enviarEntrega = async (e) => {
    e.preventDefault();
    if (!upload.job_id || !upload.entrega_url) return alert("Preencha todos os campos!");
    setLoading(true);
    try {
      await axios.post("http://localhost:4000/entregas", upload);
      alert("✅ Entrega enviada com sucesso!");
      setUpload({ job_id: "", entrega_url: "" });
      carregarJobs();
    } catch (err) {
      console.error("Erro ao enviar entrega:", err);
      alert("❌ Erro ao enviar entrega.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          🎬 Entregas de Campanhas
        </h1>

        <form
          onSubmit={enviarEntrega}
          className="bg-white rounded-xl shadow-md p-5 mb-8"
        >
          <h2 className="text-xl font-semibold mb-3">Enviar vídeo editado</h2>
          <select
            className="w-full border p-2 mb-3 rounded"
            value={upload.job_id}
            onChange={(e) => setUpload({ ...upload, job_id: e.target.value })}
          >
            <option value="">Selecione a campanha</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.titulo}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="URL do vídeo final (YouTube, Google Drive, etc)"
            className="w-full border p-2 mb-3 rounded"
            value={upload.entrega_url}
            onChange={(e) =>
              setUpload({ ...upload, entrega_url: e.target.value })
            }
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white py-2 px-4 rounded-lg w-full font-semibold hover:bg-green-700"
          >
            {loading ? "Enviando..." : "Enviar Entrega"}
          </button>
        </form>

        <div className="space-y-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border"
            >
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800">{job.titulo}</h3>
                <p className="text-gray-600 mb-3">{job.descricao}</p>
                {job.entrega_url ? (
                  <div className="text-green-600 font-semibold">
                    ✅ Entregue: {job.entrega_url}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">Aguardando entrega</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
