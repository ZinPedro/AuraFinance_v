import { useLocation } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../components/sidebar";
import TopBar from "../components/topBar";
import SavingsTotalCard from "../components/SavingsTotalCard";
import SavingsChart from "../components/SavingsChart";
import SavingsList from "../components/SavingsList";
import SavingsCards from "../components/SavingsCards";

function Savings() {
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

        .af-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .af-title-actions {
          display: flex;
          gap: 12px;
        }

        @media (max-width: 768px) {
          .af-main-content {
            margin-left: 0;
            padding-bottom: 72px;
          }

          .af-page-body {
            padding: 16px;
          }

          .af-title-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .af-title-actions {
            width: 100%;
            flex-direction: column;
          }

          .af-title-actions button {
            width: 100%;
            padding: 12px !important;
            font-size: 14px !important;
            justify-content: center;
          }
        }
      `}</style>

      <Sidebar />

      <div className="af-main-content">
        <TopBar />

        <div className="af-page-body">

          {/* Header */}
          <div style={{ marginBottom: "8px" }}>
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

            <div className="af-title-row">
              <h2 style={{ margin: 0, color: "#111827", fontSize: "28px" }}>
                {pageTitle}
              </h2>
              <div className="af-title-actions">
                
              </div>
            </div>

            <p style={{ marginTop: "6px", fontSize: "14px", color: "#6b7280" }}>
              Explore opções de investimento e gerencie sua carteira
            </p>
          </div>

          {/* KPIs da PETR4 via brapi */}
          <SavingsCards />

          
        </div>
      </div>
    </div>
  );
}

export default Savings;