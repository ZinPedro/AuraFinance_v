import { Pencil, Trash2, Target, Plus, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "../hooks/useToast";
import { Toast } from "../components/Toast";

export type Objective = {
  id_objetivo: number;
  nome: string;
  valor_meta: number;
  valor_atual: number;
  data_limite: string | null;
  progresso: number;
  faltante: number;
  contribuicao_mensal: number;
  concluido: boolean;
};

const getProgressColor = (p: number) => {
  const percentage = Math.max(0, Math.min(100, p));
  const hue = (percentage / 100) * 120;
  return `hsl(${hue}, 70%, 45%)`;
};

export function AddValueModal({ objetivo, token, onClose, onSuccess }: {
  objetivo: Objective;
  token: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [valor, setValor] = useState("");
  const [carregando, setCarregando] = useState(false);
  const { toasts, mostrarToast, removerToast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    try {
      const res = await fetch(`http://localhost:3000/objetivos/add/${objetivo.id_objetivo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ valor: Number(valor) }),
      });
      const data = await res.json();
      if (res.ok) {
        mostrarToast("Valor adicionado com sucesso!", "sucesso");
        setTimeout(() => { onSuccess(); onClose(); }, 1200);
      } else {
        mostrarToast(data.message || "Erro ao adicionar valor", "erro");
      }
    } catch {
      mostrarToast("Erro de conexão.", "erro");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <>
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, backdropFilter: "blur(2px)" }}>
        <div style={{ background: "#fff", borderRadius: "20px", padding: "32px", width: "400px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: "#111827" }}>Adicionar Valor</h3>
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#6b7280" }}>{objetivo.nome}</p>
            </div>
            <div onClick={onClose} style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <X size={16} color="#6b7280" />
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Valor a adicionar (R$)</label>
              <input
                type="number" placeholder="0,00" value={valor}
                onChange={(e) => setValor(e.target.value)}
                required min={0.01} step={0.01}
                style={{ width: "100%", padding: "11px 14px", marginTop: "6px", borderRadius: "10px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "#f9fafb", boxSizing: "border-box" as const }}
              />
            </div>

            <div style={{ background: "#f9fafb", borderRadius: "10px", padding: "12px", fontSize: "13px", color: "#6b7280" }}>
              Progresso atual: <strong style={{ color: "#111827" }}>{objetivo.progresso}%</strong> — Faltam <strong style={{ color: "#dc2626" }}>R$ {Number(objetivo.faltante).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="button" onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
                Cancelar
              </button>
              <button type="submit" disabled={carregando} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", background: carregando ? "#6366f1" : "#4338ca", color: "#fff", fontWeight: "600", fontSize: "14px", cursor: carregando ? "not-allowed" : "pointer" }}>
                {carregando ? "Salvando..." : "Adicionar"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toast toasts={toasts} onRemover={removerToast} />
    </>
  );
}
export function ObjectiveCard({ data, token, onDelete, onUpdate, onAddValue }: {
  data: Objective;
  token: string;
  onDelete: (id: number) => void;
  onUpdate: () => void;
  onAddValue: (obj: Objective) => void;
}) {
  if (!data) return null;

  const progressColor = getProgressColor(data.progresso);
  const [hover, setHover] = useState(false);
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [deletando, setDeletando] = useState(false);
  const { toasts, mostrarToast, removerToast } = useToast();

  const [form, setForm] = useState({
    nome: data.nome,
    valor_meta: String(data.valor_meta),
    data_limite: data.data_limite ?? "",
  });

  const inputStyle: React.CSSProperties = {
    padding: "8px 10px", borderRadius: "8px", border: "1px solid #d1d5db",
    outline: "none", fontSize: "14px", background: "#f9fafb", boxSizing: "border-box",
  };

  async function handleSalvar() {
    setSalvando(true);
    try {
      const res = await fetch(`http://localhost:3000/objetivos/edit/${data.id_objetivo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nome: form.nome, valor_meta: Number(form.valor_meta), data_limite: form.data_limite || null }),
      });
      const resData = await res.json();
      if (res.ok) {
        mostrarToast("Objetivo atualizado!", "sucesso");
        setTimeout(() => { setEditando(false); onUpdate(); }, 1200);
      } else {
        mostrarToast(resData.message || "Erro ao atualizar", "erro");
      }
    } catch {
      mostrarToast("Erro de conexão.", "erro");
    } finally {
      setSalvando(false);
    }
  }

  async function handleDeletar() {
    setDeletando(true);
    try {
      const res = await fetch(`http://localhost:3000/objetivos/delete/${data.id_objetivo}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const resData = await res.json();
      if (res.ok) {
        mostrarToast("Objetivo deletado!", "sucesso");
        setTimeout(() => onDelete(data.id_objetivo), 1000);
      } else {
        mostrarToast(resData.message || "Erro ao deletar", "erro");
      }
    } catch {
      mostrarToast("Erro de conexão.", "erro");
    } finally {
      setDeletando(false);
    }
  }

  return (
    <>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ background: "#fcfcfc", borderRadius: "16px", padding: "20px", border: "1px solid #e5e7eb", boxShadow: hover ? "0 6px 8px rgba(0,0,0,0.21)" : "0 1px 3px rgba(0,0,0,0.13)", transition: "all 0.2s ease" }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div style={{ display: "flex", gap: "12px", flex: 1 }}>
            <div style={{ width: "44px", height: "44px", background: "#e0e7ff", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Target color="#4338ca" />
            </div>
            <div style={{ flex: 1 }}>
              {editando ? (
                <input style={{ ...inputStyle, width: "100%" }} value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
              ) : (
                <h3 style={{ margin: 0 }}>{data.nome}</h3>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "6px" }}>
                {editando ? (
                  <input type="date" style={inputStyle} value={form.data_limite} onChange={(e) => setForm({ ...form, data_limite: e.target.value })} />
                ) : (
                  <span style={{ fontSize: "13px", color: "#6b7280" }}>📅 {data.data_limite ?? "Sem prazo"}</span>
                )}
                {data.concluido && !editando && (
                  <span style={{ fontSize: "12px", padding: "4px 10px", borderRadius: "999px", background: "#dcfce7", color: "#16a34a", fontWeight: "600" }}>✓ Concluído</span>
                )}
              </div>
            </div>
          </div>

          {/* Botões */}
          <div style={{ display: "flex", gap: "8px", flexShrink: 0, marginLeft: "12px" }}>
            {editando ? (
              <>
                <button onClick={handleSalvar} disabled={salvando} style={{ padding: "6px 12px", borderRadius: "8px", border: "none", background: "#4338ca", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Check size={14} />{salvando ? "..." : "Salvar"}
                </button>
                <button onClick={() => setEditando(false)} style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                  <X size={14} />Cancelar
                </button>
              </>
            ) : (
              <>
                <button onClick={() => onAddValue(data)} style={{borderRadius: "8px", border: "none", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center",color: "#16a34a" }}>
                  <Plus size={22} />
                </button>
                <Pencil size={18} style={{ cursor: "pointer", color: "#6b7280" }} onClick={() => setEditando(true)} />
                <Trash2 size={18} color={deletando ? "#9ca3af" : "#dc2626"} style={{ cursor: "pointer" }} onClick={handleDeletar} />
              </>
            )}
          </div>
        </div>

        {/* Valores */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>Valor Atual</div>
            <div style={{ fontWeight: 600 }}>R$ {Number(data.valor_atual).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>Meta Total</div>
            {editando ? (
              <input type="number" style={{ ...inputStyle, width: "120px" }} value={form.valor_meta} onChange={(e) => setForm({ ...form, valor_meta: e.target.value })} />
            ) : (
              <div style={{ fontWeight: 600 }}>R$ {Number(data.valor_meta).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
            )}
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>Faltam</div>
            <div style={{ fontWeight: 600, color: "#dc2626" }}>R$ {Number(data.faltante).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>Contribuição Mensal</div>
            <div style={{ fontWeight: 600, color: "#16a34a" }}>
              {data.contribuicao_mensal > 0 ? `R$ ${Number(data.contribuicao_mensal).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "—"}
            </div>
          </div>
        </div>

        {/* Progresso */}
        <div>
          <div style={{ fontSize: "13px", marginBottom: "6px", color: "#374151" }}>Progresso</div>
          <div style={{ height: "10px", width: "100%", background: "#e5e7eb", borderRadius: "999px", overflow: "hidden" }}>
            <div style={{ width: `${data.progresso}%`, height: "100%", background: progressColor, borderRadius: "999px", transition: "all 0.4s ease" }} />
          </div>
          <div style={{ marginTop: "6px", textAlign: "right", fontSize: "12px", color: "#374151" }}>{data.progresso}%</div>
        </div>
      </div>

      <Toast toasts={toasts} onRemover={removerToast} />
    </>
  );
}
