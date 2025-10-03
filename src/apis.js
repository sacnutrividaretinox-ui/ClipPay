// src/apis.js

const API_URL = import.meta.env.VITE_API_URL;

// Função genérica GET
export async function apiGet(endpoint) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`);
    if (!res.ok) throw new Error("Erro na API: " + res.status);
    return await res.json();
  } catch (err) {
    console.error("❌ Erro GET", endpoint, err);
    throw err;
  }
}

// Função genérica POST
export async function apiPost(endpoint, data) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erro na API: " + res.status);
    return await res.json();
  } catch (err) {
    console.error("❌ Erro POST", endpoint, err);
    throw err;
  }
}

// Rotas específicas
export const getEmpresas = () => apiGet("/empresas");
export const getClipadores = () => apiGet("/clipadores");
export const getJobs = () => apiGet("/jobs");
export const getPagamentos = () => apiGet("/pagamentos");

export const criarPagamento = (data) => apiPost("/pagamentos", data);
