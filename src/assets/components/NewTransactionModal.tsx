import { apiUrl } from "../../config/api";
import { useEffect, useState } from "react";

type Categoria = {
  id_categoria: number;
  nome: string;
};

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

export function NewTransactionModal({ onClose, onSuccess }: Props) {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const [form, setForm] = useState({
    descricao: "",
    valor: "",
    entrada_saida: "true",
    id_categoria: "",
    status: "pendente",
    recorrente: "false",
    data: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await fetch(apiUrl("/transacoes/listcategorias"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setCategorias(data.categorias);
      } catch {
        console.error("Erro ao buscar categorias");
      }
    }
    fetchCategorias();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    setErro("");

    if (!form.descricao || !form.valor || !form.id_categoria || !form.data) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(apiUrl("/transacoes/create"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        setErro(data.message || "Erro ao criar transação.");
      }
    } catch {
      setErro("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "480px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ margin: 0, fontSize: "20px" }}>Nova Transação</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#6b7280" }}>✕</button>
        </div>

        {/* Tipo */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          {[{ label: "Entrada", value: "true" }, { label: "Saída", value: "false" }].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setForm((p) => ({ ...p, entrada_saida: opt.value }))}
              style={{
                flex: 1, padding: "10px", borderRadius: "8px", border: "2px solid",
                borderColor: form.entrada_saida === opt.value ? (opt.value === "true" ? "#10b981" : "#ef4444") : "#e5e7eb",
                background: form.entrada_saida === opt.value ? (opt.value === "true" ? "#ecfdf5" : "#fef2f2") : "#fff",
                color: form.entrada_saida === opt.value ? (opt.value === "true" ? "#10b981" : "#ef4444") : "#6b7280",
                fontWeight: 600, cursor: "pointer",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Campos */}
        {[
          { label: "Descrição", name: "descricao", type: "text", placeholder: "Ex: Conta de luz" },
          { label: "Valor (R$)", name: "valor", type: "number", placeholder: "0,00" },
          { label: "Data", name: "data", type: "date", placeholder: "" },
        ].map((field) => (
          <div key={field.name} style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "6px", color: "#374151" }}>
              {field.label}
            </label>
            <input
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={form[field.name as keyof typeof form]}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", boxSizing: "border-box", outline: "none" }}
            />
          </div>
        ))}

        {/* Categoria */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "6px", color: "#374151" }}>Categoria</label>
          <select name="id_categoria" value={form.id_categoria} onChange={handleChange}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", boxSizing: "border-box", background: "#fff" }}>
            <option value="">Selecione uma categoria</option>
            {categorias.map((cat) => (
              <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nome}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "6px", color: "#374151" }}>Status</label>
          <select name="status" value={form.status} onChange={handleChange}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", boxSizing: "border-box", background: "#fff" }}>
            <option value="pendente">Pendente</option>
            <option value="concluido">Concluído</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        {/* Recorrente */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "6px", color: "#374151" }}>Recorrente?</label>
          <select name="recorrente" value={form.recorrente} onChange={handleChange}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", boxSizing: "border-box", background: "#fff" }}>
            <option value="false">Não</option>
            <option value="true">Sim</option>
          </select>
        </div>

        {erro && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "16px" }}>{erro}</p>}

        {/* Botões */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={onClose}
            style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontSize: "14px", color: "#6b7280" }}>
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={loading}
            style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "none", background: "#312c85", color: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: 600, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}