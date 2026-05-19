import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

type KPIProps = {
  title: string;
  value: string;
  change: string;
  trend?: "up" | "down";
  subtitle?: string;
  data: { value: number }[];
};

function KPI({ title, value, change, trend = "up", subtitle, data }: KPIProps) {
  const isPositive = trend === "up";

  return (
    <div style={{ background: "#ffffff", borderRadius: "16px", padding: "20px", width: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "14px", color: "#6b7280" }}>{title}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", padding: "4px 10px", borderRadius: "50px", background: isPositive ? "#dcfce7" : "#fee2e2", color: isPositive ? "#16a34a" : "#dc2626" }}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {change}
        </div>
      </div>
      <div style={{ fontSize: "26px", fontWeight: 600, color: "#111827" }}>{value}</div>
      {subtitle && <div style={{ fontSize: "12px", color: "#9ca3af" }}>{subtitle}</div>}
      <div style={{ width: "100%", height: "50px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line type="monotone" dataKey="value" stroke={isPositive ? "#22c55e" : "#ef4444"} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function DashboardKPIs() {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const [saldoLiquido, setSaldoLiquido] = useState(0);
  const [totEntrada, setTotEntrada] = useState(0);
  const [totSaida, setTotSaida] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResumo() {
      try {
        const res = await fetch("http://localhost:3000/transacoes/resumo", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setSaldoLiquido(Number(data.saldoLiquido));
          setTotEntrada(Number(data.totEntrada));
          setTotSaida(Number(data.totSaida));
        }
      } catch {
        console.error("Erro ao buscar resumo financeiro");
      } finally {
        setLoading(false);
      }
    }
    fetchResumo();
  }, []);

  function generateTrend(final: number, growing: boolean): { value: number }[] {
    const step = final * 0.05;
    return [
      { value: growing ? final - step * 4 : final + step * 4 },
      { value: growing ? final - step * 3 : final + step * 3 },
      { value: growing ? final - step * 2 : final + step * 2 },
      { value: growing ? final - step     : final + step     },
      { value: final },
    ];
  }

  if (loading) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", width: "100%" }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ background: "#fff", borderRadius: "16px", padding: "20px", height: "160px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "13px", color: "#9ca3af" }}>Carregando...</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", width: "100%" }}>
      <KPI
        title="Saldo Total"
        value={formatBRL(saldoLiquido)}
        change={saldoLiquido >= 0 ? "Positivo" : "Negativo"}
        trend={saldoLiquido >= 0 ? "up" : "down"}
        data={generateTrend(saldoLiquido, saldoLiquido >= 0)}
      />
      <KPI
        title="Renda Total"
        value={formatBRL(totEntrada)}
        change="Entradas"
        trend="up"
        data={generateTrend(totEntrada, true)}
      />
      <KPI
        title="Despesas Totais"
        value={formatBRL(totSaida)}
        change="Saídas"
        trend="down"
        data={generateTrend(totSaida, false)}
      />
    </div>
  );
}