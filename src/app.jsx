import React, { useMemo, useState } from "react";

// =============================
// SaaS: Marketplace de Clipadores (Front Simulado)
// - Single-file React app
// - Sem backend: tudo em estado local
// - Fluxos simulados: Empresa posta jobs, Clipador aceita e envia, Empresa aprova, pagamentos registram
// =============================

function classNames(...xs) { return xs.filter(Boolean).join(" "); }

const currency = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const ROLES = {
  EMPRESA: "Empresa",
  CLIPADOR: "Clipador",
  ADMIN: "Admin"
};

const PAGES_EMPRESA = [
  { key: "dashboard", label: "Dashboard" },
  { key: "nova", label: "Nova Campanha" },
  { key: "campanhas", label: "Campanhas" },
  { key: "financeiro", label: "Financeiro" },
];

const PAGES_CLIPADOR = [
  { key: "dashboard_c", label: "Dashboard" },
  { key: "market", label: "Marketplace" },
  { key: "meus_jobs", label: "Meus Jobs" },
  { key: "ganhos", label: "Ganhos" },
];

const PAGES_ADMIN = [
  { key: "visao", label: "Visão Geral" },
  { key: "usuarios", label: "Usuários" },
  { key: "relatorios", label: "Relatórios" },
];

// Mock inicial de jobs publicados por empresas
const initialJobs = [
  {
    id: "J-1001",
    titulo: "Cortes de Live – Lançamento SaaS",
    descricao: "Gerar 3 cortes de 30-45s com CTA final.",
    plataformas: ["Reels", "TikTok", "Shorts"],
    preco: 35,
    status: "disponivel", // disponivel | em_andamento | enviado | aprovado | rejeitado
    empresa: "Acme Tech",
    videoBaseURL: "https://exemplo.com/video-base.mp4",
    aceitoPor: null,
    envioURL: null,
    data: new Date().toISOString(),
  },
  {
    id: "J-1002",
    titulo: "Corte Podcast – Episódio #18",
    descricao: "Selecionar melhores 2 momentos com legenda dinâmica.",
    plataformas: ["Shorts"],
    preco: 40,
    status: "disponivel",
    empresa: "Studio XP",
    videoBaseURL: "https://exemplo.com/podcast18.mp4",
    aceitoPor: null,
    envioURL: null,
    data: new Date().toISOString(),
  },
];

const initialEmpresas = [
  { id: "E-1", nome: "Acme Tech", saldo: 300 },
];

const initialClipadores = [
  { id: "C-1", nome: "João Clips", chavePix: "joao@pix", saldo: 0, rating: 4.8, aprovacoes: 0 },
  { id: "C-2", nome: "Maria Edição", chavePix: "maria@pix", saldo: 0, rating: 4.9, aprovacoes: 0 },
];

export default function App() {
  // ======= Auth Simulada =======
  const [role, setRole] = useState(ROLES.EMPRESA);
  const [empresaAtiva, setEmpresaAtiva] = useState(initialEmpresas[0]);
  const [clipadorAtivo, setClipadorAtivo] = useState(initialClipadores[0]);

  // ======= Estado Global Simulado =======
  const [jobs, setJobs] = useState(initialJobs);
  const [empresas, setEmpresas] = useState(initialEmpresas);
  const [clipadores, setClipadores] = useState(initialClipadores);
  const [regPagamentos, setRegPagamentos] = useState([]); // {id, jobId, para, valor, taxa, liquido, data}

  // ======= Navegação =======
  const menu = role === ROLES.EMPRESA ? PAGES_EMPRESA : role === ROLES.CLIPADOR ? PAGES_CLIPADOR : PAGES_ADMIN;
  const [page, setPage] = useState(menu[0].key);

  // ======= Derivados =======
  const jobsDisponiveis = useMemo(() => jobs.filter(j => j.status === "disponivel"), [jobs]);
  const meusJobsClipador = useMemo(
    () => jobs.filter(j => j.aceitoPor === clipadorAtivo.id),
    [jobs, clipadorAtivo]
  );

  const campanhasEmpresa = useMemo(
    () => jobs.filter(j => j.empresa === empresaAtiva.nome),
    [jobs, empresaAtiva]
  );

  // ======= Ações Globais =======
  const aceitarJob = (jobId) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "em_andamento", aceitoPor: clipadorAtivo.id } : j));
  };

  const enviarJob = (jobId, linkEntrega) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "enviado", envioURL: linkEntrega } : j));
  };

  const aprovarJob = (jobId) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "aprovado" } : j));

    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    const preco = job.preco;
    const taxa = Math.max(2, +(preco * 0.12).toFixed(2)); // taxa 12% (mín. R$2)
    const liquido = +(preco - taxa).toFixed(2);

    // Registra pagamento
    setRegPagamentos(prev => [
      ...prev,
      {
        id: `P-${prev.length + 1}`,
        jobId,
        para: job.aceitoPor,
        valor: preco,
        taxa,
        liquido,
        data: new Date().toISOString(),
      }
    ]);

    // Debita Empresa e credita Clipador
    setEmpresas(prev => prev.map(e => e.id === empresaAtiva.id ? { ...e, saldo: +(e.saldo - preco).toFixed(2) } : e));
    setClipadores(prev => prev.map(c => c.id === job.aceitoPor ? { ...c, saldo: +(c.saldo + liquido).toFixed(2), aprovacoes: c.aprovacoes + 1 } : c));
  };

  const rejeitarJob = (jobId) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "rejeitado" } : j));
  };

  const criarCampanha = (dados) => {
    const novo = {
      id: `J-${1000 + jobs.length + 1}`,
      titulo: dados.titulo,
      descricao: dados.descricao,
      plataformas: dados.plataformas,
      preco: Number(dados.preco || 0),
      status: "disponivel",
      empresa: empresaAtiva.nome,
      videoBaseURL: dados.videoBaseURL || "",
      aceitoPor: null,
      envioURL: null,
      data: new Date().toISOString(),
    };
    setJobs(prev => [novo, ...prev]);
    setPage("campanhas");
  };

  const adicionarSaldoEmpresa = (valor) => {
    setEmpresas(prev => prev.map(e => e.id === empresaAtiva.id ? { ...e, saldo: +(e.saldo + Number(valor)).toFixed(2) } : e));
  };

  const solicitarSaque = (valor) => {
    setClipadores(prev => prev.map(c => c.id === clipadorAtivo.id ? { ...c, saldo: Math.max(0, +(c.saldo - Number(valor)).toFixed(2)) } : c));
  };

  // ======= UI Helpers =======
  const SideNav = ({ items }) => (
    <nav className="space-y-1">
      {items.map(it => (
        <button
          key={it.key}
          onClick={() => setPage(it.key)}
          className={classNames(
            "w-full text-left px-3 py-2 rounded-xl",
            page === it.key ? "bg-zinc-900 text-white" : "hover:bg-zinc-100"
          )}
        >{it.label}</button>
      ))}
    </nav>
  );

  const Stat = ({ label, value, hint }) => (
    <div className="rounded-2xl border p-4 shadow-sm">
      <div className="text-sm text-zinc-500">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
      {hint && <div className="text-xs text-zinc-400 mt-1">{hint}</div>}
    </div>
  );

  const Pill = ({ children }) => (
    <span className="px-2 py-0.5 text-xs rounded-full bg-zinc-100">{children}</span>
  );

  // ======= Páginas – EMPRESA =======
  const EmpresaDashboard = () => {
    const totalCampanhas = campanhasEmpresa.length;
    const aprovados = campanhasEmpresa.filter(j => j.status === "aprovado").length;
    const gastos = regPagamentos
      .filter(p => campanhasEmpresa.some(j => j.id === p.jobId))
      .reduce((acc, p) => acc + p.valor, 0);

    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-4 gap-4">
          <Stat label="Saldo" value={currency(empresaAtiva.saldo)} hint="Adicionar saldo no Financeiro" />
          <Stat label="Campanhas" value={totalCampanhas} />
          <Stat label="Clipes aprovados" value={aprovados} />
          <Stat label="Gasto total" value={currency(gastos)} />
        </div>

        <div className="rounded-2xl border p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-medium">Últimas movimentações</div>
            <button onClick={() => setPage("campanhas")} className="text-sm underline">ver campanhas</button>
          </div>
          <ul className="divide-y">
            {campanhasEmpresa.slice(0, 5).map(j => (
              <li key={j.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{j.titulo}</div>
                  <div className="text-xs text-zinc-500 flex gap-2 mt-1">
                    <Pill>{j.status}</Pill>
                    <Pill>{j.plataformas.join(", ")}</Pill>
                    <Pill>{currency(j.preco)}</Pill>
                  </div>
                </div>
                <div className="text-sm text-zinc-500">{new Date(j.data).toLocaleString("pt-BR")}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const NovaCampanha = () => {
    const [form, setForm] = useState({
      titulo: "",
      descricao: "",
      plataformas: [],
      preco: 30,
      videoBaseURL: "",
    });

    const togglePlat = (p) => setForm(prev => ({
      ...prev,
      plataformas: prev.plataformas.includes(p)
        ? prev.plataformas.filter(x => x !== p)
        : [...prev.plataformas, p]
    }));

    const submit = (e) => {
      e.preventDefault();
      if (!form.titulo || !form.descricao || form.plataformas.length === 0) return alert("Preencha título, descrição e pelo menos 1 plataforma.");
      criarCampanha(form);
    };

    return (
      <form onSubmit={submit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-zinc-600">Título</label>
            <input className="mt-1 w-full rounded-xl border p-2" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-zinc-600">Preço por clipe aprovado (R$)</label>
            <input type="number" min={5} className="mt-1 w-full rounded-xl border p-2" value={form.preco} onChange={e => setForm({ ...form, preco: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="text-sm text-zinc-600">Descrição / Briefing</label>
          <textarea className="mt-1 w-full rounded-xl border p-2" rows={4} value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
        </div>
        <div>
          <label className="text-sm text-zinc-600">Link do vídeo base</label>
          <input className="mt-1 w-full rounded-xl border p-2" placeholder="https://..." value={form.videoBaseURL} onChange={e => setForm({ ...form, videoBaseURL: e.target.value })} />
        </div>
        <div>
          <label className="text-sm text-zinc-600">Plataformas</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {['Reels','TikTok','Shorts'].map(p => (
              <button key={p} type="button" onClick={() => togglePlat(p)} className={classNames("px-3 py-1 rounded-full border", form.plataformas.includes(p) ? "bg-zinc-900 text-white" : "bg-white")}>{p}</button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={() => setForm({ titulo: "", descricao: "", plataformas: [], preco: 30, videoBaseURL: "" })} className="px-4 py-2 rounded-xl border">Limpar</button>
          <button className="px-4 py-2 rounded-xl bg-zinc-900 text-white">Criar Campanha</button>
        </div>
      </form>
    );
  };

  const Campanhas = () => (
    <div className="rounded-2xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-zinc-50">
          <tr>
            <th className="text-left p-3">Título</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Preço</th>
            <th className="text-left p-3">Clipador</th>
            <th className="text-left p-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {campanhasEmpresa.map(j => (
            <tr key={j.id} className="border-t">
              <td className="p-3">
                <div className="font-medium">{j.titulo}</div>
                <div className="text-xs text-zinc-500">{j.descricao.slice(0, 80)}{j.descricao.length>80?"…":""}</div>
              </td>
              <td className="p-3"><Pill>{j.status}</Pill></td>
              <td className="p-3">{currency(j.preco)}</td>
              <td className="p-3">{j.aceitoPor ? (clipadores.find(c => c.id === j.aceitoPor)?.nome || j.aceitoPor) : <span className="text-zinc-400">—</span>}</td>
              <td className="p-3 flex gap-2">
                {j.status === "enviado" && (
                  <>
                    <a className="px-3 py-1 rounded-xl border" href={j.envioURL || "#"} target="_blank" rel="noreferrer">ver entrega</a>
                    <button onClick={() => aprovarJob(j.id)} className="px-3 py-1 rounded-xl bg-emerald-600 text-white">aprovar</button>
                    <button onClick={() => rejeitarJob(j.id)} className="px-3 py-1 rounded-xl bg-rose-600 text-white">rejeitar</button>
                  </>
                )}
                {j.status === "disponivel" && (
                  <span className="text-xs text-zinc-500">aguardando clipador…</span>
                )}
                {j.status === "aprovado" && (
                  <span className="text-xs text-emerald-600">aprovado e pago</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const Financeiro = () => {
    const meusPagamentos = regPagamentos.filter(p => campanhasEmpresa.some(j => j.id === p.jobId));
    const totalGasto = meusPagamentos.reduce((a, p) => a + p.valor, 0);

    const [valor, setValor] = useState(100);
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <Stat label="Saldo da Empresa" value={currency(empresaAtiva.saldo)} />
          <Stat label="Gasto Total" value={currency(totalGasto)} />
          <Stat label="Pagamentos" value={meusPagamentos.length} />
        </div>
        <div className="rounded-2xl border p-4">
          <div className="font-medium mb-3">Adicionar saldo</div>
          <div className="flex gap-2 items-center">
            <input type="number" min={10} className="rounded-xl border p-2 w-40" value={valor} onChange={e => setValor(e.target.value)} />
            <button onClick={() => adicionarSaldoEmpresa(valor)} className="px-4 py-2 rounded-xl bg-zinc-900 text-white">Adicionar</button>
          </div>
        </div>
        <div className="rounded-2xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50">
              <tr>
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Job</th>
                <th className="text-left p-3">Valor</th>
                <th className="text-left p-3">Taxa</th>
                <th className="text-left p-3">Líquido ao Clipador</th>
                <th className="text-left p-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {meusPagamentos.map(p => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">{p.id}</td>
                  <td className="p-3">{p.jobId}</td>
                  <td className="p-3">{currency(p.valor)}</td>
                  <td className="p-3">{currency(p.taxa)}</td>
                  <td className="p-3">{currency(p.liquido)}</td>
                  <td className="p-3">{new Date(p.data).toLocaleString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ======= Páginas – CLIPADOR =======
  const ClipadorDashboard = () => {
    const aprovados = meusJobsClipador.filter(j => j.status === "aprovado").length;
    const enviados = meusJobsClipador.filter(j => j.status === "enviado").length;

    const ganhos = regPagamentos
      .filter(p => p.para === clipadorAtivo.id)
      .reduce((acc, p) => acc + p.liquido, 0);

    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-4 gap-4">
          <Stat label="Saldo" value={currency(clipadorAtivo.saldo)} />
          <Stat label="Aprovados" value={aprovados} />
          <Stat label="Enviados" value={enviados} />
          <Stat label="Ganhos totais" value={currency(ganhos)} />
        </div>
        <div className="rounded-2xl border p-4">
          <div className="font-medium mb-2">Dica rápida</div>
          <p className="text-sm text-zinc-600">Legendas dinâmicas + hook nos 3 primeiros segundos aumentam em até 40% a retenção.</p>
        </div>
      </div>
    );
  };

  const Marketplace = () => (
    <div className="grid md:grid-cols-2 gap-4">
      {jobsDisponiveis.map(j => (
        <div key={j.id} className="rounded-2xl border p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="font-medium">{j.titulo}</div>
            <Pill>{currency(j.preco)}</Pill>
          </div>
          <div className="text-sm text-zinc-600">{j.descricao}</div>
          <div className="flex gap-2 flex-wrap">
            {j.plataformas.map(p => <Pill key={p}>{p}</Pill>)}
          </div>
          {j.videoBaseURL && (
            <a className="text-sm underline" href={j.videoBaseURL} target="_blank" rel="noreferrer">ver vídeo base</a>
          )}
          <button onClick={() => aceitarJob(j.id)} className="mt-auto px-4 py-2 rounded-xl bg-zinc-900 text-white">Aceitar Job</button>
        </div>
      ))}
      {jobsDisponiveis.length === 0 && (
        <div className="text-sm text-zinc-500">Nenhum job disponível agora. Volte em breve 🚀</div>
      )}
    </div>
  );

  const MeusJobs = () => {
    const [links, setLinks] = useState({});

    const setLink = (id, v) => setLinks(prev => ({ ...prev, [id]: v }));

    return (
      <div className="rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="text-left p-3">Título</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Enviar Link</th>
              <th className="text-left p-3">Ação</th>
            </tr>
          </thead>
          <tbody>
            {meusJobsClipador.map(j => (
              <tr key={j.id} className="border-t">
                <td className="p-3">
                  <div className="font-medium">{j.titulo}</div>
                  <div className="text-xs text-zinc-500">{j.descricao.slice(0, 90)}{j.descricao.length>90?"…":""}</div>
                </td>
                <td className="p-3"><Pill>{j.status}</Pill></td>
                <td className="p-3 w-72">
                  <input disabled={j.status!=='em_andamento'} className="w-full rounded-xl border p-2" placeholder="https://link-do-seu-video.mp4" value={links[j.id] || ""} onChange={e => setLink(j.id, e.target.value)} />
                </td>
                <td className="p-3">
                  {j.status === 'em_andamento' && (
                    <button onClick={() => {
                      if (!links[j.id]) return alert('Cole o link da entrega');
                      enviarJob(j.id, links[j.id]);
                    }} className="px-3 py-1 rounded-xl bg-zinc-900 text-white">Enviar</button>
                  )}
                  {j.status === 'enviado' && <span className="text-xs">aguardando aprovação…</span>}
                  {j.status === 'aprovado' && <span className="text-xs text-emerald-600">aprovado</span>}
                  {j.status === 'rejeitado' && <span className="text-xs text-rose-600">rejeitado</span>}
                </td>
              </tr>
            ))}
            {meusJobsClipador.length === 0 && (
              <tr>
                <td className="p-6 text-sm text-zinc-500" colSpan={4}>Você ainda não aceitou nenhum job.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const Ganhos = () => {
    const meus = regPagamentos.filter(p => p.para === clipadorAtivo.id);
    const total = meus.reduce((a, p) => a + p.liquido, 0);
    const [valor, setValor] = useState(50);

    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <Stat label="Saldo disponível" value={currency(clipadorAtivo.saldo)} />
          <Stat label="Recebidos (histórico)" value={currency(total)} />
          <Stat label="Aprovações" value={clipadores.find(c=>c.id===clipadorAtivo.id)?.aprovacoes || 0} />
        </div>

        <div className="rounded-2xl border p-4">
          <div className="font-medium mb-3">Solicitar saque (Pix)</div>
          <div className="flex gap-2 items-center">
            <input type="number" min={1} className="rounded-xl border p-2 w-40" value={valor} onChange={e => setValor(e.target.value)} />
            <button onClick={() => solicitarSaque(valor)} className="px-4 py-2 rounded-xl bg-zinc-900 text-white">Solicitar</button>
          </div>
          <div className="text-xs text-zinc-500 mt-2">Chave Pix: {clipadorAtivo.chavePix}</div>
        </div>

        <div className="rounded-2xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50">
              <tr>
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Job</th>
                <th className="text-left p-3">Bruto</th>
                <th className="text-left p-3">Taxa</th>
                <th className="text-left p-3">Líquido</th>
                <th className="text-left p-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {meus.map(p => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">{p.id}</td>
                  <td className="p-3">{p.jobId}</td>
                  <td className="p-3">{currency(p.valor)}</td>
                  <td className="p-3">{currency(p.taxa)}</td>
                  <td className="p-3">{currency(p.liquido)}</td>
                  <td className="p-3">{new Date(p.data).toLocaleString("pt-BR")}</td>
                </tr>
              ))}
              {meus.length === 0 && (
                <tr><td className="p-6 text-sm text-zinc-500" colSpan={6}>Sem pagamentos ainda.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ======= Páginas – ADMIN (simples) =======
  const AdminVisao = () => {
    const totalJobs = jobs.length;
    const aprovados = jobs.filter(j => j.status === 'aprovado').length;
    const receita = regPagamentos.reduce((a, p) => a + p.taxa, 0);
    return (
      <div className="grid md:grid-cols-3 gap-4">
        <Stat label="Jobs (total)" value={totalJobs} />
        <Stat label="Aprovados" value={aprovados} />
        <Stat label="Receita (taxas)" value={currency(receita)} />
      </div>
    );
  };

  const AdminUsuarios = () => (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="rounded-2xl border p-4">
        <div className="font-medium mb-2">Empresas</div>
        <ul className="space-y-2">
          {empresas.map(e => (
            <li key={e.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{e.nome}</div>
                <div className="text-xs text-zinc-500">Saldo: {currency(e.saldo)}</div>
              </div>
              <Pill>{e.id}</Pill>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border p-4">
        <div className="font-medium mb-2">Clipadores</div>
        <ul className="space-y-2">
          {clipadores.map(c => (
            <li key={c.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{c.nome}</div>
                <div className="text-xs text-zinc-500">Saldo: {currency(c.saldo)} • Aprov.: {c.aprovacoes} • Rating: {c.rating}</div>
              </div>
              <Pill>{c.id}</Pill>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const AdminRelatorios = () => (
    <div className="rounded-2xl border p-4 text-sm text-zinc-600">
      <div className="font-medium mb-2">Logs de Pagamentos (taxas)</div>
      <ul className="space-y-2">
        {regPagamentos.map(p => (
          <li key={p.id} className="flex items-center justify-between">
            <div>Pagamento {p.id} pelo Job {p.jobId}</div>
            <div>Taxa: {currency(p.taxa)}</div>
          </li>
        ))}
        {regPagamentos.length === 0 && <li className="text-zinc-400">Sem registros ainda.</li>}
      </ul>
    </div>
  );

  // ======= Layout =======
  const Header = () => (
    <header className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-2xl bg-zinc-900 text-white grid place-items-center font-bold">CL</div>
        <div className="font-semibold">ClipHub</div>
      </div>
      <div className="flex items-center gap-2">
        <select value={role} onChange={(e) => { setRole(e.target.value); setPage( (e.target.value===ROLES.EMPRESA?PAGES_EMPRESA:PAGES_CLIPADOR)[0].key ); }} className="rounded-xl border p-2 text-sm">
          <option>{ROLES.EMPRESA}</option>
          <option>{ROLES.CLIPADOR}</option>
          <option>{ROLES.ADMIN}</option>
        </select>
        {role === ROLES.EMPRESA && (
          <select value={empresaAtiva.id} onChange={(e)=> setEmpresaAtiva(empresas.find(x=>x.id===e.target.value) || empresas[0])} className="rounded-xl border p-2 text-sm">
            {empresas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
          </select>
        )}
        {role === ROLES.CLIPADOR && (
          <select value={clipadorAtivo.id} onChange={(e)=> setClipadorAtivo(clipadores.find(x=>x.id===e.target.value) || clipadores[0])} className="rounded-xl border p-2 text-sm">
            {clipadores.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        )}
      </div>
    </header>
  );

  const Sidebar = () => (
    <aside className="w-full md:w-64 shrink-0 border-r p-4 bg-white">
      <div className="text-xs uppercase tracking-widest text-zinc-400 mb-3">{role}</div>
      {role === ROLES.EMPRESA && <SideNav items={PAGES_EMPRESA} />}
      {role === ROLES.CLIPADOR && <SideNav items={PAGES_CLIPADOR} />}
      {role === ROLES.ADMIN && <SideNav items={PAGES_ADMIN} />}
      <div className="mt-6 rounded-2xl bg-zinc-50 p-3 text-xs text-zinc-600">
        <div className="font-medium mb-1">Dicas</div>
        <ul className="list-disc pl-5 space-y-1">
          <li>Use títulos objetivos</li>
          <li>Preço justo aumenta a velocidade</li>
          <li>Briefing claro = menos retrabalho</li>
        </ul>
      </div>
    </aside>
  );

  const Main = () => (
    <main className="flex-1 p-4 md:p-6">
      {role === ROLES.EMPRESA && (
        <>
          {page === "dashboard" && <EmpresaDashboard />}
          {page === "nova" && <NovaCampanha />}
          {page === "campanhas" && <Campanhas />}
          {page === "financeiro" && <Financeiro />}
        </>
      )}
      {role === ROLES.CLIPADOR && (
        <>
          {page === "dashboard_c" && <ClipadorDashboard />}
          {page === "market" && <Marketplace />}
          {page === "meus_jobs" && <MeusJobs />}
          {page === "ganhos" && <Ganhos />}
        </>
      )}
      {role === ROLES.ADMIN && (
        <>
          {page === "visao" && <AdminVisao />}
          {page === "usuarios" && <AdminUsuarios />}
          {page === "relatorios" && <AdminRelatorios />}
        </>
      )}
    </main>
  );

  return (
    <div className="min-h-screen bg-zinc-25 text-zinc-900">
      <Header />
      <div className="mx-auto max-w-7xl grid md:grid-cols-[260px_1fr]">
        <Sidebar />
        <Main />
      </div>
      <footer className="text-center text-xs text-zinc-400 py-6">Versão simulação • Sem backend • Pronto para conectar API (Stripe/MercadoPago/Pix/Z-API)</footer>
    </div>
  );
}
