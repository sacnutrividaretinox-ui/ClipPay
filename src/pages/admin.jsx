import { useState } from "react";

export default function Admin() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [midia, setMidia] = useState("");

  const criarCampanha = async () => {
    try {
      const response = await fetch("http://localhost:4000/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, descricao, preco, midia }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar campanha");
      }

      const data = await response.json();
      alert("✅ Campanha criada com sucesso!");
      console.log("Nova campanha:", data);

      // limpar formulário
      setTitulo("");
      setDescricao("");
      setPreco("");
      setMidia("");
    } catch (err) {
      console.error(err);
      alert("❌ Erro ao criar campanha!");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Criar Campanha</h2>

      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className="border p-2 w-full mb-3 rounded"
      />

      <textarea
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        className="border p-2 w-full mb-3 rounded"
      />

      <input
        type="number"
        placeholder="Preço"
        value={preco}
        onChange={(e) => setPreco(e.target.value)}
        className="border p-2 w-full mb-3 rounded"
      />

      <input
        type="text"
        placeholder="URL do vídeo ou imagem"
        value={midia}
        onChange={(e) => setMidia(e.target.value)}
        className="border p-2 w-full mb-3 rounded"
      />

      <button
        onClick={criarCampanha}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        Criar Campanha
      </button>
    </div>
  );
}
