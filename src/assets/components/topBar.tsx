import { Bell, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Usuario {
  id_usuario: number;
  nome: string;
  email: string;
  idade: number;
}

function TopBar() {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    async function fetchUsuario() {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;
      try {
        const response = await fetch("http://localhost:3000/auth/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) setUsuario(data.user);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    }
    fetchUsuario();
  }, []);

  const inicial = usuario?.nome?.charAt(0).toUpperCase() ?? "?";
  const idFormatado = usuario ? String(usuario.id_usuario).padStart(4, "0") : "----";

  return (
    <>
      <style>{`
        .af-topbar {
          width: 100%;
          height: 70px;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30px;
          border-bottom: 1px solid #e5e7eb;
          box-sizing: border-box;
          gap: 16px;
        }

        .af-topbar-search {
          display: flex;
          align-items: center;
          background: #f3f4f6;
          padding: 10px 15px;
          border-radius: 12px;
          gap: 10px;
          /* flex em vez de width fixo */
          flex: 1;
          max-width: 400px;
          min-width: 0;
          transition: border 0.2s ease;
        }

        .af-topbar-search input {
          border: none;
          outline: none;
          background: transparent;
          width: 100%;
          font-size: 14px;
          border-radius: 8px;
          padding: 2px 4px;
          min-width: 0;
        }

        .af-topbar-right {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-shrink: 0;
        }

        .af-topbar-username {
          display: block;
        }

        /* Mobile: esconde o nome, mantém só o avatar e o sino */
        @media (max-width: 768px) {
          .af-topbar {
            padding: 0 16px;
          }

          .af-topbar-search {
            max-width: unset;
          }

          .af-topbar-username {
            display: none;
          }

          .af-topbar-right {
            gap: 14px;
          }
        }
      `}</style>

      <div className="af-topbar">
        <div
          className="af-topbar-search"
          style={{ border: isFocused ? "3px solid #4338ca" : "3px solid transparent" }}
        >
          <Search size={22} color="#6b7280" style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Buscar transações, relatórios..."
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
        <div className="af-topbar-right">
          <div style={{ position: "relative", cursor: "pointer" }}>
            <Bell size={20} color="#374151" />
            <span
              style={{
                position: "absolute",
                top: "-5px",
                right: "-5px",
                width: "8px",
                height: "8px",
                background: "red",
                borderRadius: "50%",
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="af-topbar-username">
              <p style={{ margin: 0, fontWeight: 500 }}>
                {usuario ? usuario.nome : "Carregando..."}
              </p>
              <p style={{ margin: 0, fontSize: "12px", color: "gray" }}>
                ID: {idFormatado}
              </p>
            </div>

            <div
              onClick={() => navigate("/usersettings")}
              style={{
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                background: "#f59e0b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {inicial}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TopBar;