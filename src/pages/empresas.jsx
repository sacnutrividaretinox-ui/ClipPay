import { useEffect, useState } from "react";
import axios from "axios";

export default function Empresas() {
  const [campanhas, setCampanhas] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  const carregar = async () => {
    try {
      const res = await axios.get("http://localhost:4000/jobs");
      setCampanhas(res.data);
    } catch (err) {
      console.error("Erro ao carregar campanhas:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          🏢 Painel da Empresa
        </h1>

        {campanhas.length === 0 ? (
          <p className="text-gray-500 text-center">
            Nenhuma campanha publicada.
          </p>
        ) : (
          campanhas.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-lg shadow-md mb-6 overflow-hidden border"
            >
              <div className="p-4 border-b">
                <h2 className="text-xl font-bold text-gray-800">{c.titulo}</h2>
                <p className="text-gray-600">{c.descricao}</p>
                <p className="text-sm text-gray-500 mt-1">
                  💰 Valor: R$ {Number(c.preco).toFixed(2)}
                </p>
              </div>

              <div className="p-4">
                {c.entrega_url ? (
                  <>
                    <p className="text-green-600 font-semibold">
                      ✅ Vídeo entregue:
                    </p>
                    <a
                      href={c.entrega_url}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      {c.entrega_url}
                    </a>
                  </>
                ) : (
                  <p className="text-gray-500">⏳ Aguardando entrega</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
