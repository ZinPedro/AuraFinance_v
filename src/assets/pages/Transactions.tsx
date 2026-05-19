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
      <Sidebar />

      <div style={{marginLeft: "260px", display: "flex", flexDirection: "column", minHeight: "100vh"}}>
        <TopBar />

        <div style={{flex: 1, background: "#f9fafb", padding: "24px 32px"}}>
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

            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <h2 style={{margin: 0, color: "#111827", fontSize: "28px"}}>
                {pageTitle}
              </h2>

              <button onClick={() => setOpenModal(true)} style={{padding: "8px 16px", fontSize:"16px", background: "#312c85", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer"}}>
                + Nova Transação
              </button>
            </div>

            <p style={{marginTop: "6px", fontSize: "14px", color: "#6b7280"}}>
              Gerencie suas movimentações financeiras do período.
            </p>
          </div>

          <TransactionFilter filters={filters} onChange={setFilters} />

          <div style={{display: "flex", gap: "16px", marginTop: "24px"}}>
              <TransactionsList filters={filters} refresh={refresh}/>

          </div>
        </div>
      </div>
      {openModal && (
        <NewTransactionModal
          onClose={() => setOpenModal(false)}
          onSuccess={() => {
            setRefresh(r => r + 1)
      }}
  />
)}
    </div>
  );
}

export default Transactions;