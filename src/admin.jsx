import { useState, useEffect } from "react";

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem("ADMIN_TOKEN") || "");
  const [campaigns, setCampaigns] = useState([]);
  const [form, setForm] = useState({ titulo: "", descricao: "", empresa_id: "", preco: "", status: "" });
  const [editItem, setEditItem] = useState(null);

  async function loadCampaigns(useToken = token) {
    if (!useToken) return;
    const res = await fetch("http://localhost:4000/admin/campaigns", {
      headers: { Authorization: `Bearer ${useToken}` },
    });
    if (res.ok) setCampaigns(await res.json());
  }

  useEffect(() => {
    if (token) loadCampaigns();
  }, [token]);

  function saveTokenAndLoad(t) {
    sessionStorage.setItem("ADMIN_TOKEN", t);
    setToken(t);
    loadCampaigns(t);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const url = editItem ? `http://localhost:4000/admin/campaigns/${editItem.id}` : "http://localhost:4000/admin/campaigns";
    const method = editItem ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    setForm({ titulo: "", descricao: "", empresa_id: "", preco: "", status: "" });
    setEditItem(null);
    loadCampaigns();
  }

  async function handleDelete(id) {
    await fetch(`http://localhost:4000/admin/campaigns/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadCampaigns();
  }

  if (!token) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Painel Admin</h2>
        <input value={token} onChange={e => setToken(e.target.value)} className="border p-2 mr-2" />
        <button onClick={() => saveTokenAndLoad(token)} className="bg-indigo-600 text-white px-4 py-2 rounded">Entrar</button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Gerenciar Campanhas</h2>

      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input placeholder="Título" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} className="border p-2 w-full rounded" />
        <textarea placeholder="Descrição" value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} className="border p-2 w-full rounded" />
        <input placeholder="Empresa ID" value={form.empresa_id} onChange={e => setForm({ ...form, empresa_id: e.target.value })} className="border p-2 w-full rounded" />
        <input placeholder="Preço" value={form.preco} onChange={e => setForm({ ...form, preco: e.target.value })} className="border p-2 w-full rounded" />
        <input placeholder="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="border p-2 w-full rounded" />
        <button className="bg-green-600 text-white px-4 py-2 rounded">{editItem ? "Salvar" : "Criar"}</button>
      </form>

      <ul className="space-y-2">
        {campaigns.map(c => (
          <li key={c.id} className="p-3 border rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">{c.titulo}</p>
              <p className="text-sm text-gray-500">{c.descricao}</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-indigo-600 text-white px-2 py-1 rounded" onClick={() => { setEditItem(c); setForm(c); }}>Editar</button>
              <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(c.id)}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
