import { useLocation } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../components/sidebar";
import TopBar from "../components/topBar";
import ObjectivesKPIs from "../components/ObjectivesKPIs";
import { ObjectivesEvolution } from "../components/ObjectivesEvolution";
import { ObjectivesDistribuitionByCategory } from "../components/ObjectivesDistribuitionByCategory";
import ObjectivesList from "../components/ObjectivesList";
import NewObjectiveModal from "../components/NewObjectiveModal";

function Objectives() {
  const location = useLocation();

  const routeNames: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/objectives": "Objetivos",
    "/transactions": "Transações",
    "/savings": "Investimentos",
  };

  const currentPage = routeNames[location.pathname] || "Dashboard";
  const [openModal, setOpenModal] = useState(false);

  const pageTitle =
    currentPage === "Dashboard" ? "Dashboard Geral" :
    currentPage === "Objetivos" ? "Meus Objetivos Financeiros" :
    currentPage === "Transações" ? "Entradas e Saídas" :
    currentPage === "Investimentos" ? "Investimentos" :
    currentPage;

  return (
    <div>
      <style>{`
        .af-main-content {
          margin-left: 260px;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .af-page-body {
          flex: 1;
          background: #f9fafb;
          padding: 24px 32px;
        }

        .af-charts-row {
          display: flex;
          gap: 16px;
          margin-top: 24px;
        }

        .af-chart-main { flex: 2; }
        .af-chart-side { flex: 1; }

        /* Botão: desktop inalterado */
        .af-new-btn {
          padding: 8px 16px;
          font-size: 16px;
          background: #312c85;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .af-main-content {
            margin-left: 0;
            padding-bottom: 72px;
          }

          .af-page-body {
            padding: 16px;
          }

          /* Título e botão em coluna no mobile */
          .af-title-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          /* Botão ocupa largura total e fica mais fácil de tocar */
          .af-new-btn {
            width: 100%;
            padding: 12px;
            font-size: 15px;
            border-radius: 10px;
            text-align: center;
          }

          .af-charts-row {
            flex-direction: column;
          }

          .af-chart-main,
          .af-chart-side {
            flex: unset;
            width: 100%;
          }
        }
      `}</style>

      <Sidebar />

      <div className="af-main-content">
        <TopBar />

        <div className="af-page-body">
          <div style={{ marginBottom: "24px" }}>
            <div style={{ fontSize: "16px", color: "#6b7280", marginBottom: "8px" }}>
              Início{" "}
              {currentPage && (
                <>
                  &gt;{" "}
                  <span style={{ fontWeight: "500", color: "#262626" }}>
                    {currentPage}
                  </span>
                </>
              )}
            </div>

            <div
              className="af-title-row"
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <h2 style={{ margin: 0, color: "#111827", fontSize: "28px" }}>
                {pageTitle}
              </h2>

              <button className="af-new-btn" onClick={() => setOpenModal(true)}>
                + Novo Objetivo
              </button>
            </div>

            <p style={{ marginTop: "6px", fontSize: "14px", color: "#6b7280" }}>
              Acompanhe e gerencie suas metas de curto, médio e longo prazo
            </p>
          </div>

          <ObjectivesKPIs />

          <div className="af-charts-row">
            <div className="af-chart-main">
              <ObjectivesEvolution />
            </div>
            <div className="af-chart-side">
              <ObjectivesDistribuitionByCategory />
            </div>
          </div>

          <div style={{ marginTop: "24px" }}>
            <ObjectivesList />
          </div>
        </div>
      </div>

      {openModal && <NewObjectiveModal onClose={() => setOpenModal(false)} />}
    </div>
  );
}

export default Objectives;