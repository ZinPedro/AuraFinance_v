import { useLocation } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../components/sidebar";
import TopBar from "../components/topBar";
import TransactionFilter, { TransactionFilters } from "../components/TransactionsFilter";
import { TransactionsList} from "../components/TransactionsList";
import { NewTransactionModal } from "../components/NewTransactionModal";


function Transactions() {
  const location = useLocation();

  const routeNames: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/objectives": "Objetivos",
    "/transactions": "Transações",
    "/savings": "Investimentos",
  };

  const currentPage = routeNames[location.pathname] || "Dashboard";
  const [openModal, setOpenModal] = useState(false);
  const [refresh, setRefresh] = useState(0);

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

  const [filters, setFilters] = useState<TransactionFilters>({
    month: "",
    category: "",
    type: "",
    status: "",
  });

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

          .af-nova-btn {
            width: 100%;
            padding: 12px !important;
            font-size: 14px !important;
            text-align: center;
            border-radius: 10px !important;
          }
        }
      `}</style>

      <Sidebar />

      <div className="af-main-content">
        <TopBar />

        <div className="af-page-body">
          <div>
            <div style={{fontSize: "16px", color: "#6b7280", marginBottom: "8px"}}>
              Início{" "}
              {currentPage && (
                <>
                  &gt;{" "}
                  <span style={{fontWeight: "500", color: "#262626"}}>
                    {currentPage}
                  </span>
                </>
              )}
            </div>

            <div className="af-title-row">
              <h2 style={{margin: 0, color: "#111827", fontSize: "28px"}}>
                {pageTitle}
              </h2>

              <button
                className="af-nova-btn"
                onClick={() => setOpenModal(true)}
                style={{padding: "8px 16px", fontSize: "16px", background: "#312c85", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer"}}
              >
                + Nova Transação
              </button>
            </div>

            <p style={{marginTop: "6px", fontSize: "14px", color: "#6b7280"}}>
              Gerencie suas movimentações financeiras do período.
            </p>
          </div>

          <TransactionFilter filters={filters} onChange={setFilters} />

          <div style={{display: "flex", gap: "16px", marginTop: "24px"}}>
            <TransactionsList filters={filters} refresh={refresh} />
          </div>
        </div>
      </div>

      {openModal && (
        <NewTransactionModal
          onClose={() => setOpenModal(false)}
          onSuccess={() => {
            setRefresh(r => r + 1);
          }}
        />
      )}
    </div>
  );
}

export default Transactions;