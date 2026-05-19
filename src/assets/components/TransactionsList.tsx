import { useState, useEffect } from "react";
import { TransactionFilters } from "./TransactionsFilter";

interface ApiTransaction {
  id_transacao: number;
  descricao: string;
  valor: string;
  entrada_saida: boolean | number;
  status: string;
  data: string;
  recorrente?: boolean;
  id_categoria?: number;
  CategoriaTransacao: { id_categoria: number; nome: string };
}

interface Categoria {
  id_categoria: number;
  nome: string;
}

interface TransactionsListProps {
  filters: TransactionFilters;
  refresh?: number;
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  return `${day} ${months[month - 1]}, ${year}`;
}

function formatCurrency(amount: number, type: "entrada" | "saida"): string {
  const formatted = amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  return type === "entrada" ? `+R$ ${formatted}` : `-R$ ${formatted}`;
}

const CATEGORY_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  receita:     { bg: "#e0f2fe", color: "#0369a1", border: "#7dd3fc" },
  alimentacao: { bg: "#fef9c3", color: "#854d0e", border: "#fde047" },
  moradia:     { bg: "#ede9fe", color: "#5b21b6", border: "#c4b5fd" },
  transporte:  { bg: "#dcfce7", color: "#166534", border: "#86efac" },
  saude:       { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5" },
  lazer:       { bg: "#fce7f3", color: "#9d174d", border: "#f9a8d4" },
  educacao:    { bg: "#dbeafe", color: "#1e40af", border: "#93c5fd" },
  contas:      { bg: "#f3f4f6", color: "#374151", border: "#d1d5db" },
};
const DEFAULT_CATEGORY_STYLE = { bg: "#f3f4f6", color: "#374151", border: "#d1d5db" };

function CategoryBadge({ category }: { category: string }) {
  const key = category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const style = CATEGORY_STYLES[key] ?? DEFAULT_CATEGORY_STYLE;
  return (
    <span style={{ display: "inline-block", background: style.bg, color: style.color, border: `1px solid ${style.border}`, borderRadius: "20px", padding: "3px 12px", fontSize: "12px", fontWeight: 500 }}>
      {category}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const config: Record<string, { bg: string; color: string; dot: string; label: string }> = {
    concluida: { bg: "#dcfce7", color: "#166534", dot: "#16a34a", label: "Concluída" },
    pendente:  { bg: "#fef9c3", color: "#854d0e", dot: "#ca8a04", label: "Pendente"  },
    cancelada: { bg: "#fee2e2", color: "#991b1b", dot: "#dc2626", label: "Cancelada" },
  };
  const s = config[normalized] ?? { bg: "#f3f4f6", color: "#374151", dot: "#9ca3af", label: status };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: s.bg, color: s.color, borderRadius: "20px", padding: "3px 12px", fontSize: "12px", fontWeight: 500 }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  );
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ background: "#e5e7eb", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
      <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: "4px", transition: "width 0.4s ease" }} />
    </div>
  );
}

function EditTransactionModal({
  transaction,
  categorias,
  token,
  onClose,
  onSuccess,
}: {
  transaction: ApiTransaction;
  categorias: Categoria[];
  token: string | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    descricao: transaction.descricao,
    valor: String(Number(transaction.valor)),
    entrada_saida: (transaction.entrada_saida === true || transaction.entrada_saida === 1) ? "true" : "false",
    id_categoria: String(transaction.CategoriaTransacao?.id_categoria ?? ""),
    status: transaction.status,
    recorrente: transaction.recorrente ? "true" : "false",
    data: transaction.data,
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    setErro("");
    if (!form.descricao || !form.valor || !form.id_categoria || !form.data) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/transacoes/edit/${transaction.id_transacao}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          descricao: form.descricao,
          valor: Number(form.valor),
          entrada_saida: form.entrada_saida === "true",
          id_categoria: Number(form.id_categoria),
          status: form.status,
          recorrente: form.recorrente === "true",
          data: form.data,
        }),
      });
      if (res.ok) { onSuccess(); onClose(); }
      else {
        const data = await res.json();
        setErro(data.message || "Erro ao editar transação.");
      }
    } catch {
      setErro("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "480px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)", maxHeight: "90vh", overflowY: "auto" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ margin: 0, fontSize: "20px" }}>Editar Transação</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#6b7280" }}>✕</button>
        </div>

        {/* Tipo */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          {[{ label: "Entrada", value: "true" }, { label: "Saída", value: "false" }].map(opt => (
            <button key={opt.value} onClick={() => setForm(p => ({ ...p, entrada_saida: opt.value }))}
              style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "2px solid", borderColor: form.entrada_saida === opt.value ? (opt.value === "true" ? "#10b981" : "#ef4444") : "#e5e7eb", background: form.entrada_saida === opt.value ? (opt.value === "true" ? "#ecfdf5" : "#fef2f2") : "#fff", color: form.entrada_saida === opt.value ? (opt.value === "true" ? "#10b981" : "#ef4444") : "#6b7280", fontWeight: 600, cursor: "pointer" }}>
              {opt.label}
            </button>
          ))}
        </div>

        {[
          { label: "Descrição", name: "descricao", type: "text", placeholder: "Ex: Conta de luz" },
          { label: "Valor (R$)", name: "valor", type: "number", placeholder: "0,00" },
          { label: "Data", name: "data", type: "date", placeholder: "" },
        ].map(field => (
          <div key={field.name} style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "6px", color: "#374151" }}>{field.label}</label>
            <input name={field.name} type={field.type} placeholder={field.placeholder} value={form[field.name as keyof typeof form]} onChange={handleChange}
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", boxSizing: "border-box" }} />
          </div>
        ))}

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "6px", color: "#374151" }}>Categoria</label>
          <select name="id_categoria" value={form.id_categoria} onChange={handleChange}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", boxSizing: "border-box", background: "#fff" }}>
            <option value="">Selecione uma categoria</option>
            {categorias.map(cat => <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nome}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "6px", color: "#374151" }}>Status</label>
          <select name="status" value={form.status} onChange={handleChange}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", boxSizing: "border-box", background: "#fff" }}>
            <option value="pendente">Pendente</option>
            <option value="concluída">Concluída</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "6px", color: "#374151" }}>Recorrente?</label>
          <select name="recorrente" value={form.recorrente} onChange={handleChange}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", boxSizing: "border-box", background: "#fff" }}>
            <option value="false">Não</option>
            <option value="true">Sim</option>
          </select>
        </div>

        {erro && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "16px" }}>{erro}</p>}

        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontSize: "14px", color: "#6b7280" }}>Cancelar</button>
          <button onClick={handleSubmit} disabled={loading} style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "none", background: "#312c85", color: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: 600, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({
  transaction,
  token,
  onClose,
  onSuccess,
}: {
  transaction: ApiTransaction;
  token: string | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/transacoes/delete-transacao/${transaction.id_transacao}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) { onSuccess(); onClose(); }
    } catch {
      console.error("Erro ao deletar transação");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "400px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🗑️</div>
        <h2 style={{ margin: "0 0 8px", fontSize: "20px" }}>Excluir transação?</h2>
        <p style={{ margin: "0 0 24px", color: "#6b7280", fontSize: "14px" }}>
          "<strong>{transaction.descricao}</strong>" será excluída permanentemente.
        </p>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontSize: "14px", color: "#6b7280" }}>Cancelar</button>
          <button onClick={handleDelete} disabled={loading} style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "none", background: "#ef4444", color: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: 600, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function TransactionsList({ filters, refresh = 0 }: TransactionsListProps) {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [totalTransacoes, setTotalTransacoes] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [internalRefresh, setInternalRefresh] = useState(0);

  const [editingTransaction, setEditingTransaction] = useState<ApiTransaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<ApiTransaction | null>(null);

  const PAGE_SIZE = 5;

  const MONTH_YEAR_MAP: Record<string, { month: number; year: number }> = {
    "jan-2024": { month: 1,  year: 2024 }, "fev-2024": { month: 2,  year: 2024 },
    "mar-2024": { month: 3,  year: 2024 }, "abr-2024": { month: 4,  year: 2024 },
    "mai-2024": { month: 5,  year: 2024 }, "jun-2024": { month: 6,  year: 2024 },
    "jul-2024": { month: 7,  year: 2024 }, "ago-2024": { month: 8,  year: 2024 },
    "set-2024": { month: 9,  year: 2024 }, "out-2023": { month: 10, year: 2023 },
    "nov-2023": { month: 11, year: 2023 }, "dez-2023": { month: 12, year: 2023 },
  };

  useEffect(() => { setPage(1); }, [filters]);

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await fetch("http://localhost:3000/transacoes/listcategorias", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setCategorias(data.categorias);
      } catch { console.error("Erro ao buscar categorias"); }
    }
    fetchCategorias();
  }, []);

  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", String(page));
        params.append("limit", String(PAGE_SIZE));

        if (filters.month && MONTH_YEAR_MAP[filters.month]) {
          const { month, year } = MONTH_YEAR_MAP[filters.month];
          const lastDay = new Date(year, month, 0).getDate();
          const mm = String(month).padStart(2, "0");
          params.append("data_inicio", `${year}-${mm}-01`);
          params.append("data_fim", `${year}-${mm}-${lastDay}`);
        }

        if (filters.type === "entrada") params.append("entrada_saida", "1");
        if (filters.type === "saida")   params.append("entrada_saida", "0");
        if (filters.status) params.append("status", filters.status);

        const res = await fetch(`http://localhost:3000/transacoes/list?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setTransactions(data.transacoes);
          setTotalTransacoes(data.totalTransacoes);
          setTotalPaginas(data.totalPaginas);
        }
      } catch { console.error("Erro ao buscar transações"); }
      finally { setLoading(false); }
    }
    fetchTransactions();
  }, [filters, page, refresh, internalRefresh]);

  const totalEntradas = transactions.filter(t => t.entrada_saida === true || t.entrada_saida === 1).reduce((s, t) => s + Number(t.valor), 0);
  const totalSaidas   = transactions.filter(t => t.entrada_saida === false || t.entrada_saida === 0).reduce((s, t) => s + Number(t.valor), 0);
  const saldoLiquido  = totalEntradas - totalSaidas;

  const categoryTotals = transactions
    .filter(t => t.entrada_saida === false || t.entrada_saida === 0)
    .reduce<Record<string, number>>((acc, t) => {
      const nome = t.CategoriaTransacao?.nome ?? "outros";
      acc[nome] = (acc[nome] ?? 0) + Number(t.valor);
      return acc;
    }, {});

  const categoryEntries = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const categoryColors = ["#312c85", "#534AB7", "#9f99e0"];

  return (
    <>
      <div style={{ width: "100%", display: "flex", gap: "20px", alignItems: "flex-start", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

        {/* Tabela */}
        <div style={{ flex: 2, background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden", minHeight: "412px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr 1.2fr 1.2fr 1fr 80px", padding: "12px 24px", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>
            {["DATA", "DESCRIÇÃO", "CATEGORIA", "STATUS", "VALOR", ""].map((h, i) => (
              <span key={i} style={{ fontSize: "11px", fontWeight: 600, color: "#9ca3af", letterSpacing: "0.06em", textAlign: i === 4 ? "right" : "left" }}>
                {h}
              </span>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: "40px 24px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>Carregando transações...</div>
          ) : transactions.length === 0 ? (
            <div style={{ padding: "40px 24px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>Nenhuma transação encontrada.</div>
          ) : (
            transactions.map((t, i) => {
              const type = (t.entrada_saida === true || t.entrada_saida === 1) ? "entrada" : "saida";
              return (
                <div key={t.id_transacao}
                  style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr 1.2fr 1.2fr 1fr 80px", padding: "16px 24px", borderBottom: i < transactions.length - 1 ? "1px solid #f3f4f6" : "none", alignItems: "center", transition: "background 0.12s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <span style={{ fontSize: "13px", color: "#6b7280" }}>{formatDate(t.data)}</span>
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "#111827" }}>{t.descricao}</span>
                  <span><CategoryBadge category={t.CategoriaTransacao?.nome ?? "-"} /></span>
                  <span><StatusBadge status={t.status} /></span>
                  <span style={{ fontSize: "14px", fontWeight: 600, textAlign: "right", color: type === "entrada" ? "#16a34a" : "#dc2626" }}>
                    {formatCurrency(Number(t.valor), type)}
                  </span>

                  {/* Ações */}
                  <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                    {/* Botão Editar */}
                    <button onClick={() => setEditingTransaction(t)}
                      title="Editar"
                      style={{ background: "#ede9fe", border: "none", borderRadius: "6px", width: "30px", height: "30px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5b21b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>

                    {/* Botão Excluir */}
                    <button onClick={() => setDeletingTransaction(t)}
                      title="Excluir"
                      style={{ background: "#fee2e2", border: "none", borderRadius: "6px", width: "30px", height: "30px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {/* Footer paginação */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", borderTop: "1px solid #e5e7eb", background: "#f9fafb" }}>
            <span style={{ fontSize: "13px", color: "#6b7280" }}>
              Página <strong style={{ color: "#111827" }}>{page}</strong> de <strong style={{ color: "#111827" }}>{totalPaginas}</strong> — {totalTransacoes} transações
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              {["Anterior", "Próximo"].map((label, i) => {
                const disabled = i === 0 ? page <= 1 : page >= totalPaginas;
                return (
                  <button key={label} disabled={disabled} onClick={() => setPage(p => p + (i === 0 ? -1 : 1))}
                    style={{ padding: "7px 16px", fontSize: "13px", fontWeight: 500, background: "#fff", color: disabled ? "#d1d5db" : "#374151", border: `1px solid ${disabled ? "#e5e7eb" : "#d1d5db"}`, borderRadius: "8px", cursor: disabled ? "not-allowed" : "pointer" }}>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", minWidth: "220px" }}>
          <div style={{ background: "#312c85", borderRadius: "12px", padding: "24px", color: "#fff" }}>
            <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", opacity: 0.75, margin: "0 0 8px" }}>SALDO LÍQUIDO</p>
            <p style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
              {saldoLiquido >= 0 ? "" : "-"}R$ {Math.abs(saldoLiquido).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { label: "Total Entradas", value: totalEntradas, color: "#86efac" },
                { label: "Total Saídas",   value: totalSaidas,   color: "#fca5a5", negative: true },
              ].map(({ label, value, color, negative }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", opacity: 0.8 }}>{label}</span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color }}>
                    {negative ? "-" : ""}R$ {value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px" }}>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#111827", margin: "0 0 16px" }}>Gasto por Categoria</p>
            {categoryEntries.length === 0 ? (
              <p style={{ fontSize: "13px", color: "#9ca3af" }}>Sem dados de saídas.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {categoryEntries.map(([cat, total], i) => {
                  const pct = totalSaidas > 0 ? Math.round((total / totalSaidas) * 100) : 0;
                  return (
                    <div key={cat}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                        <span style={{ fontSize: "13px", color: "#374151" }}>{cat}</span>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>{pct}%</span>
                      </div>
                      <ProgressBar value={pct} color={categoryColors[i] ?? "#312c85"} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modais */}
      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          categorias={categorias}
          token={token}
          onClose={() => setEditingTransaction(null)}
          onSuccess={() => setInternalRefresh(r => r + 1)}
        />
      )}

      {deletingTransaction && (
        <DeleteConfirmModal
          transaction={deletingTransaction}
          token={token}
          onClose={() => setDeletingTransaction(null)}
          onSuccess={() => setInternalRefresh(r => r + 1)}
        />
      )}
    </>
  );
}