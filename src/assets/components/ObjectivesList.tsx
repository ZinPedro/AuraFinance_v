import { useState, useEffect } from "react";
import { ObjectiveCard, AddValueModal, type Objective  } from "../components/objectiveCard";

export default function ObjectivesList() {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAddValue, setModalAddValue] = useState<Objective | null>(null);

  const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";

  async function fetchObjectives() {
    try {
      const res = await fetch("http://localhost:3000/objetivos/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setObjectives(data.objetivos);
    } catch {
      console.error("Erro ao buscar objetivos");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { fetchObjectives(); }, []);

  function handleDelete(id: number) {
    setObjectives((prev) => prev.filter((o) => o.id_objetivo !== id));
  }

  if (carregando) return <p style={{ color: "#6b7280", padding: "20px" }}>Carregando objetivos...</p>;

  if (objectives.length === 0) return (
    <div style={{ background: "#fff", padding: "40px", borderRadius: "16px", border: "1px solid #e5e7eb", textAlign: "center" }}>
      <p style={{ color: "#6b7280", margin: 0 }}>Nenhum objetivo cadastrado ainda.</p>
    </div>
  );

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", background: "#fff", padding: "20px", borderRadius: "16px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <h1 style={{ margin: 0, fontSize: "20px", color: "#111827" }}>Todos os Objetivos</h1>
        {objectives.map((obj) => (
          <ObjectiveCard
            key={obj.id_objetivo}
            data={obj}
            token={token}
            onDelete={handleDelete}
            onUpdate={fetchObjectives}
            onAddValue={(obj) => setModalAddValue(obj)}
          />
        ))}
      </div>

      {modalAddValue && (
        <AddValueModal
          objetivo={modalAddValue}
          token={token}
          onClose={() => setModalAddValue(null)}
          onSuccess={fetchObjectives}
        />
      )}
    </>
  );
}