import { useLocation } from "react-router-dom";

import Sidebar from "../components/sidebar";
import TopBar from "../components/topBar";
import DashboardKPIs from "../components/DashboardKPIs";
import { DashboardFlux } from "../components/DashBoardFlux";
import { DashBoardExpensesByCategory } from "../components/DasBoardExpensesByCategory";
import DashBoardRecentTransactions from "../components/DashBoardRecentTransactions";

function DashBoard() {
  const location = useLocation();

  const routeNames: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/objectives": "Objetivos",
    "/transactions": "Transações",
    "/savings": "Investimentos",
  };

  const currentPage = routeNames[location.pathname] || "Dashboard";

  const pageTitle =
    currentPage === "Dashboard"
      ? "Dashboard Geral"
      : currentPage === "Objetivos"
      ? "Meus Objetivos Financeiros"
      : currentPage === "Transações"
      ? "Entradas e Saídas"
      : currentPage === "Investimentos"
      ? "Investimentos"
      : currentPage;

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

        @media (max-width: 768px) {
          .af-main-content {
            margin-left: 0;
            padding-bottom: 72px;
          }

          .af-page-body {
            padding: 16px;
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
            <div style={{ fontSize: "16px", color: "#6b7280", marginBottom: "6px" }}>
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
            <h2 style={{ margin: 0, color: "#111827", fontSize: "28px" }}>
              {pageTitle}
            </h2>
            <p style={{ marginTop: "6px", fontSize: "14px", color: "#6b7280" }}>
              Bem-vindo! Aqui está o que está acontecendo com suas contas hoje.
            </p>
          </div>

          <DashboardKPIs />

          <div className="af-charts-row">
            <div className="af-chart-main">
              <DashboardFlux />
            </div>
            <div className="af-chart-side">
              <DashBoardExpensesByCategory />
            </div>
          </div>

          <div style={{ marginTop: "24px" }}>
            <DashBoardRecentTransactions />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;