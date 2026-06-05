import { apiUrl } from "../../config/api";
import { useState, useEffect } from "react";
import { X, Target } from "lucide-react";
import { Toast } from "./Toast";
import { useToast } from "../hooks/useToast";

type Props = {
  onClose: () => void;
};

export default function NewObjectiveModal({ onClose }: Props) {
  const { toasts, mostrarToast, removerToast } = useToast();
  const [carregando, setCarregando] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    valor_meta: "",
    data_limite: "",
  });

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setCarregando(true);

    try {
      const res = await fetch(apiUrl("/objetivos/create"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: form.nome,
          valor_meta: Number(form.valor_meta),
          data_limite: form.data_limite || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        mostrarToast("Objetivo criado com sucesso!", "sucesso");
        setTimeout(() => onClose(), 1500);
      } else {
        mostrarToast(data.message || "Erro ao criar objetivo", "erro");
      }
    } catch {
      mostrarToast("Erro de conexão. Tente novamente.", "erro");
    } finally {
      setCarregando(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    marginTop: "6px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    outline: "none",
    fontSize: "14px",
    background: "#f9fafb",
    color: "#111827",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
  };

  return (
    <>
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, backdropFilter: "blur(2px)" }}>
        <div style={{ background: "#fff", borderRadius: "20px", padding: "32px", width: "440px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Target size={20} color="#4338ca" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: "#111827" }}>Novo Objetivo</h3>
                <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>Defina sua meta financeira</p>
              </div>
            </div>
            <div onClick={onClose} style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <X size={16} color="#6b7280" />
            </div>
          </div>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            <div>
              <label style={labelStyle}>Nome do objetivo</label>
              <input name="nome" onChange={handleChange} placeholder="Ex: Casa própria" style={inputStyle} required />
            </div>

            <div>
              <label style={labelStyle}>Meta total (R$)</label>
              <input name="valor_meta" type="number" onChange={handleChange} placeholder="0,00" style={inputStyle} required />
            </div>

            <div>
              <label style={labelStyle}>Prazo <span style={{ color: "#9ca3af", fontWeight: 400 }}>(opcional)</span></label>
              <input name="data_limite" type="date" onChange={handleChange} style={inputStyle} />
            </div>

            <div style={{ height: "1px", background: "#f3f4f6", margin: "4px 0" }} />

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="button" onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
                Cancelar
              </button>
              <button type="submit" disabled={carregando} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", background: carregando ? "#6366f1" : "#4338ca", color: "#fff", fontWeight: "600", fontSize: "14px", cursor: carregando ? "not-allowed" : "pointer" }}>
                {carregando ? "Salvando..." : "Salvar objetivo"}
              </button>
            </div>

          </form>
        </div>
      </div>

      <Toast toasts={toasts} onRemover={removerToast} />
    </>
  );
}