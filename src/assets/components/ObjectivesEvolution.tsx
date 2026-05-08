import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type Objective = {
  id_objetivo: number;
  valor_meta: number;
  valor_atual: number;
  progresso: number;
  faltante: number;
  concluido: boolean;
};

type ChartData = {
  name: string;
  valor: number;
};

export function ObjectivesEvolution() {
  const [objectives, setObjectives] = useState<ChartData[]>([]);
  const [carregando, setCarregando] = useState(true);

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  
  useEffect(() => {
    async function fetchData() {
        try {
          const res = await fetch("http://localhost:3000/objetivos/list", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (res.ok){
            const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

            const porMes: Record<string, number> = {};
            data.objetivos.forEach((obj: any) => {
              const data = new Date(obj.data_limite);
              const mes = meses[data.getMonth()];
              porMes[mes] = (porMes[mes] || 0) + Number(obj.valor_atual);
            });

            const objetivosFormatados = Object.entries(porMes).map(([name, valor]) => ({ name, valor }));
            setObjectives(objetivosFormatados);
          }
        } catch {
          console.error("Erro ao buscar KPIs");
        } finally {
          setCarregando(false);
        }
      }
      fetchData();
  }, []);

  return (
    <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", height: "100%",}}>
      <div style={{display: "flex", justifyContent: "space-between", marginBottom: "16px", alignItems: "center",}}>
        <div>
          <h3 style={{ margin: 0 }}>Evolução das Economias</h3>
          <p style={{ margin: 0, color: "#6b7280", fontSize: "14px",}}>
            Progresso acumulado nos últimos 6 meses
          </p>
        </div>

        <div style={{ fontSize: "12px", background: "#f3f4f6", padding: "6px 12px", borderRadius: "50px",}}>
          Últimos 6 Meses
        </div>
      </div>

      <div style={{ width: "100%", height: "300px" }}>
        <ResponsiveContainer>
          <LineChart data={objectives}>
            <CartesianGrid
              stroke="#e5e7eb"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="valor"
              stroke="#1e3a8a"
              strokeWidth={3}
              dot={{
                r: 6,
                stroke: "#1e3a8a",
                strokeWidth: 2,
                fill: "#fff",
              }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}