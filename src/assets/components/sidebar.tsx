import { useNavigate, useLocation } from "react-router-dom";
import logo from "../img/aurafinance_logo.png";
import { FileText, Target, ArrowLeftRight, TrendingUp } from "lucide-react";
 
const ACTIVE_COLOR = "#312c85";
const ACCENT = "#4338ca";
 
function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
 
  const menu = [
    { label: "Dashboard", path: "/dashboard", icon: FileText },
    { label: "Objetivos", path: "/objectives", icon: Target },
    { label: "Transações", path: "/transactions", icon: ArrowLeftRight },
    { label: "Investimentos", path: "/savings", icon: TrendingUp },
  ];
 
  return (
    <>
      {/*Injeção de estilos responsivos*/}
      <style>{`
        /* Desktop: sidebar visível, bottom nav escondida */
        .af-sidebar {
          width: 260px;
          height: 100vh;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 20px;
          border-right: 1px solid #e5e7eb;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1000;
        }
 
        .af-bottom-nav {
          display: none;
        }
 
        /* Mobile: sidebar escondida, bottom nav visível */
        @media (max-width: 768px) {
          .af-sidebar {
            display: none;
          }
 
          .af-bottom-nav {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background: #ffffff;
            border-top: 1px solid #e5e7eb;
            padding: 8px 4px;
            padding-bottom: calc(8px + env(safe-area-inset-bottom));
            justify-content: space-around;
            align-items: center;
          }
 
          .af-bottom-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            flex: 1;
            padding: 6px 4px;
            background: transparent;
            border: none;
            cursor: pointer;
            border-radius: 12px;
            transition: background 0.15s ease;
            -webkit-tap-highlight-color: transparent;
          }
 
          .af-bottom-nav-item span {
            font-size: 10px;
            font-weight: 500;
            line-height: 1;
          }
 
          .af-bottom-nav-item.active span {
            color: ${ACTIVE_COLOR};
            font-weight: 700;
          }
 
          .af-bottom-nav-item.active svg {
            color: ${ACTIVE_COLOR};
          }
 
          .af-bottom-nav-item:not(.active) span {
            color: #9ca3af;
          }
 
          .af-bottom-nav-item:not(.active) svg {
            color: #9ca3af;
          }
 
          .af-bottom-nav-item.active .af-nav-dot {
            display: block;
          }
 
          .af-nav-dot {
            display: none;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: ${ACTIVE_COLOR};
            margin-top: 2px;
          }
        }
 
        /* Sidebar menu buttons */
        .af-sidebar-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-size: 15px;
          text-align: left;
          width: 100%;
          transition: all 0.2s ease;
        }
 
        .af-sidebar-btn.active {
          background: ${ACTIVE_COLOR};
          color: white;
        }
 
        .af-sidebar-btn:not(.active) {
          background: transparent;
          color: #374151;
        }
 
        .af-sidebar-btn:not(.active):hover {
          background: #f3f4f6;
        }
      `}</style>
 
      {/*SIDEBAR (desktop)*/}
      <div className="af-sidebar">
        <div>
          {/* Logo */}
          <div
            style={{
              height: "90px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "30px",
              borderBottom: "1px solid #dadadb",
            }}
          >
            <div
              style={{
                background: ACCENT,
                width: "42px",
                height: "42px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "10px",
                flexShrink: 0,
              }}
            >
              <img src={logo} alt="AF" style={{ maxWidth: "60px" }} />
            </div>
 
            <div>
              <h1 style={{ margin: 0, fontSize: "20px", color: "#1f2937" }}>
                AuraFinance
              </h1>
              <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
                Conta Premium
              </p>
            </div>
          </div>
 
          {/* Menu items */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {menu.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
 
              return (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className={`af-sidebar-btn${isActive ? " active" : ""}`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
 
        <div style={{ fontSize: "12px", color: "#9ca3af" }}>
          © 2026 AuraFinance
        </div>
      </div>
 
      {/*BOTTOM NAV (mobile)*/}
      <nav className="af-bottom-nav">
        {menu.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
 
          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`af-bottom-nav-item${isActive ? " active" : ""}`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span>{item.label}</span>
              <div className="af-nav-dot" />
            </button>
          );
        })}
      </nav>
    </>
  );
}
 
export default Sidebar;