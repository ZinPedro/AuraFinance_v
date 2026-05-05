import { useEffect, useState } from "react";

type ToastType = "sucesso" | "erro" | "aviso" | "info";

interface ToastItem {
  id: number;
  mensagem: string;
  tipo: ToastType;
}

interface Props {
  toasts: ToastItem[];
  onRemover: (id: number) => void;
}

const config: Record<ToastType, { cor: string; fundo: string; borda: string; icone: string }> = {
  sucesso: { cor: "#15803d", fundo: "#f0fdf4", borda: "#86efac", icone: "✓" },
  erro:    { cor: "#b91c1c", fundo: "#fef2f2", borda: "#fca5a5", icone: "✕" },
  aviso:   { cor: "#92400e", fundo: "#fffbeb", borda: "#fcd34d", icone: "⚠" },
  info:    { cor: "#1e40af", fundo: "#eff6ff", borda: "#93c5fd", icone: "i" },
};

function ToastItem({ toast, onRemover }: { toast: ToastItem; onRemover: (id: number) => void }) {
  const [visivel, setVisivel] = useState(false);
  const c = config[toast.tipo];

  useEffect(() => {
    setTimeout(() => setVisivel(true), 10);
  }, []);

  function fechar() {
    setVisivel(false);
    setTimeout(() => onRemover(toast.id), 300);
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 16px",
        borderRadius: "12px",
        border: `1px solid ${c.borda}`,
        background: c.fundo,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        minWidth: "280px",
        maxWidth: "380px",
        opacity: visivel ? 1 : 0,
        transform: visivel ? "translateX(0)" : "translateX(40px)",
        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        cursor: "pointer",
      }}
      onClick={fechar}
    >
      {/* Ícone */}
      <div
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          background: c.cor,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "13px",
          fontWeight: "700",
          flexShrink: 0,
        }}
      >
        {c.icone}
      </div>

      {/* Mensagem */}
      <span style={{ fontSize: "14px", color: c.cor, fontWeight: "500", flex: 1 }}>
        {toast.mensagem}
      </span>

      {/* Fechar */}
      <span style={{ fontSize: "16px", color: c.cor, opacity: 0.5, lineHeight: 1 }}>×</span>
    </div>
  );
}

export function Toast({ toasts, onRemover }: Props) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        zIndex: 9999,
      }}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemover={onRemover} />
      ))}
    </div>
  );
}