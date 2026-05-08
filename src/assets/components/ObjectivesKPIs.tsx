import { Target, DollarSign, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

type Objective = {
  id_objetivo: number;
  valor_meta: number;
  valor_atual: number;
  progresso: number;
  faltante: number;
  concluido: boolean;
};

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{background: "#ffffff", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: "12px"}}>
      {children}
    </div>
  );
}

export default function ObjectivesKPIs() {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [carregando, setCarregando] = useState(true);

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    async function fetchKPIs() {
      try {
        const res = await fetch("http://localhost:3000/objetivos/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setObjectives(data.objetivos);
      } catch {
        console.error("Erro ao buscar KPIs");
      } finally {
        setCarregando(false);
      }
    }
    fetchKPIs();
  }, []);

  const totalMeta = objectives.reduce((acc, o) => acc + Number(o.valor_meta), 0);
  const totalAtual = objectives.reduce((acc, o) => acc + Number(o.valor_atual), 0);
  const progressoGeral = totalMeta > 0 ? Math.min(Math.round((totalAtual / totalMeta) * 100), 100) : 0;
  const ativos = objectives.filter((o) => !o.concluido).length;
  const proximoDaConclusao = objectives.filter((o) => !o.concluido && o.progresso >= 80).length;

  if (carregando) return <div style={{ height: "120px" }} />;

  return (
    <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", width: "100%",}}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{width: "44px", height: "44px", borderRadius: "12px", background: "#e0e7ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#4338ca",}}>
            <Target size={20} />
          </div>
          <div style={{ background: "#dcfce7", color: "#16a34a", padding: "4px 10px", borderRadius: "50px", fontSize: "12px", }}>
            {objectives.filter((o) => o.concluido).length} concluídos
          </div>
        </div>
        <span style={{ fontSize: "14px", color: "#6b7280" }}>
          Progresso Total
        </span>
        <div style={{ fontSize: "28px", fontWeight: 600 }}>{progressoGeral}%</div>
        <div style={{ width: "100%", height: "8px", background: "#e5e7eb", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ width: `${progressoGeral}%`, height: "100%", background: "#4338ca", borderRadius: "10px", transition: "width 0.4s ease" }} />
        </div>
      </Card>

      <Card>
        <div style={{width: "44px", height: "44px", borderRadius: "12px", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center",color: "#2563eb",}}>
          <DollarSign size={20} />
        </div>
        <span style={{ fontSize: "14px", color: "#6b7280" }}>
          Total Economizado
        </span>
        <div style={{ fontSize: "28px", fontWeight: 600 }}>
          R$ {totalAtual.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </div>
        <span style={{ fontSize: "13px", color: "#6b7280" }}>
          de R$ {totalMeta.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </span>
      </Card>

      <Card>
        <div style={{width: "44px", height: "44px", borderRadius: "12px", background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", color: "#7c3aed",}}>
          <TrendingUp size={20} />
        </div>

        <span style={{ fontSize: "14px", color: "#6b7280" }}>
          Objetivos Ativos
        </span>

        <div style={{ fontSize: "28px", fontWeight: 600 }}>{ativos}</div>

        <span style={{ fontSize: "13px", color: "#6b7280" }}>
          {proximoDaConclusao > 0 ? `${proximoDaConclusao} próximo${proximoDaConclusao > 1 ? "s" : ""} da conclusão`: "Nenhum próximo da conclusão"}
        </span>
      </Card>
    </div>
  );
}