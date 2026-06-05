import { apiUrl } from "../../config/api";
import { Bell, Search, ArrowLeftRight, Target, TrendingUp, X } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface Usuario {
  id_usuario: number;
  nome: string;
  email: string;
  idade: number;
}

interface SearchResult {
  id: string;
  type: "transacao" | "objetivo" | "investimento";
  title: string;
  subtitle: string;
  path: string;
  value?: string;
  valueColor?: string;
}

const STOCK_NAMES: Record<string, string> = {
  PETR4: "Petrobras PN", PETR3: "Petrobras ON", PRIO3: "PetroRio ON",
  VALE3: "Vale ON", CSNA3: "CSN ON", GGBR4: "Gerdau PN",
  ITUB4: "Itaú Unibanco PN", BBAS3: "Banco do Brasil ON",
  BBDC4: "Bradesco PN", SANB11: "Santander Units",
  MGLU3: "Magazine Luiza ON", RENT3: "Localiza ON", LREN3: "Lojas Renner ON",
  VIVT3: "Vivo ON", TOTS3: "Totvs ON",
  ELET3: "Eletrobras ON", SBSP3: "Sabesp ON",
};

const TYPE_CONFIG = {
  transacao:    { icon: ArrowLeftRight, bg: "#ede9fe", color: "#5b21b6", label: "Transação" },
  objetivo:     { icon: Target,         bg: "#dbeafe", color: "#1d4ed8", label: "Objetivo"  },
  investimento: { icon: TrendingUp,     bg: "#dcfce7", color: "#15803d", label: "Ativo B3"  },
};

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function TopBar() {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 280);

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  // Fetch user
  useEffect(() => {
    async function fetchUsuario() {
      if (!token) return;
      try {
        const res = await fetch(apiUrl("/auth/me"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setUsuario(data.user);
      } catch {}
    }
    fetchUsuario();
  }, []);

  // Search
  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); setOpen(false); return; }
    setLoading(true);
    const found: SearchResult[] = [];

    await Promise.allSettled([
      (async () => {
        const res = await fetch(
          apiUrl(`/transacoes/list?limit=50`),
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) return;
        const data = await res.json();
        const lower = q.toLowerCase();
        (data.transacoes ?? []).forEach((t: any) => {
          const match =
            t.descricao?.toLowerCase().includes(lower) ||
            t.CategoriaTransacao?.nome?.toLowerCase().includes(lower) ||
            String(t.valor).includes(lower);
          if (match) {
            const isEntrada = t.entrada_saida === true || t.entrada_saida === 1;
            found.push({
              id: `tx-${t.id_transacao}`,
              type: "transacao",
              title: t.descricao,
              subtitle: `${t.CategoriaTransacao?.nome ?? "—"} · ${t.data?.slice(0, 10)}`,
              path: "/transactions",
              value: `${isEntrada ? "+" : "-"}R$ ${Number(t.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
              valueColor: isEntrada ? "#16a34a" : "#dc2626",
            });
          }
        });
      })(),

      (async () => {
        const res = await fetch(
          apiUrl(`/objetivos/list`),
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) return;
        const data = await res.json();
        const lower = q.toLowerCase();
        (data.objetivos ?? []).forEach((o: any) => {
          const match =
            o.nome?.toLowerCase().includes(lower) ||
            o.descricao?.toLowerCase().includes(lower);
          if (match) {
            found.push({
              id: `obj-${o.id_objetivo}`,
              type: "objetivo",
              title: o.nome ?? "Objetivo",
              subtitle: `${o.progresso ?? 0}% concluído`,
              path: "/objectives",
              value: `R$ ${Number(o.valor_atual ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
              valueColor: "#1d4ed8",
            });
          }
        });
      })(),

      (async () => {
        const lower = q.toLowerCase();
        Object.entries(STOCK_NAMES).forEach(([ticker, name]) => {
          if (
            ticker.toLowerCase().includes(lower) ||
            name.toLowerCase().includes(lower)
          ) {
            found.push({
              id: `inv-${ticker}`,
              type: "investimento",
              title: ticker,
              subtitle: name,
              path: "/savings",
            });
          }
        });
      })(),
    ]);

    setResults(found.slice(0, 10));
    setOpen(found.length > 0);
    setSelected(-1);
    setLoading(false);
  }, [token]);

  useEffect(() => { search(debouncedQuery); }, [debouncedQuery]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    if (e.key === "Enter" && selected >= 0) { goTo(results[selected]); }
    if (e.key === "Escape") { setOpen(false); inputRef.current?.blur(); }
  }

  function goTo(result: SearchResult) {
    navigate(result.path);
    setQuery("");
    setOpen(false);
    setResults([]);
  }

  function clearSearch() {
    setQuery("");
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  }

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
          position: relative;
          z-index: 200;
        }

        .af-topbar-search-wrap {
          position: relative;
          flex: 1;
          max-width: 400px;
          min-width: 0;
        }

        .af-topbar-search {
          display: flex;
          align-items: center;
          background: #f3f4f6;
          padding: 10px 15px;
          border-radius: 12px;
          gap: 10px;
          width: 100%;
          box-sizing: border-box;
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

        .af-search-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.14);
          border: 1px solid #e5e7eb;
          overflow: hidden;
          z-index: 999;
        }

        .af-search-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 16px;
          cursor: pointer;
          transition: background 0.12s;
          border-bottom: 1px solid #f3f4f6;
        }

        .af-search-item:last-child { border-bottom: none; }
        .af-search-item:hover, .af-search-item.selected { background: #f5f3ff; }

        .af-search-item-icon {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .af-search-item-text { flex: 1; min-width: 0; }
        .af-search-item-title {
          font-size: 13px;
          font-weight: 600;
          color: #111827;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .af-search-item-sub {
          font-size: 11px;
          color: #9ca3af;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .af-search-empty {
          padding: 20px 16px;
          text-align: center;
          font-size: 13px;
          color: #9ca3af;
        }

        .af-topbar-right {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-shrink: 0;
        }

        .af-topbar-username { display: block; }

        @media (max-width: 768px) {
          .af-topbar { padding: 0 16px; }
          .af-topbar-search-wrap { max-width: unset; }
          .af-topbar-username { display: none; }
          .af-topbar-right { gap: 14px; }
        }
      `}</style>

      <div className="af-topbar">
        <div className="af-topbar-search-wrap" ref={wrapperRef}>
          <div
            className="af-topbar-search"
            style={{ border: isFocused ? "3px solid #4338ca" : "3px solid transparent" }}
          >
            <Search size={18} color="#6b7280" style={{ flexShrink: 0 }} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar transações, objetivos, ativos..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => { setIsFocused(true); if (results.length > 0) setOpen(true); }}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
            />
            {query && (
              <button onClick={clearSearch} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", color: "#9ca3af" }}>
                <X size={15} />
              </button>
            )}
            {loading && (
              <div style={{ width: 14, height: 14, border: "2px solid #e5e7eb", borderTopColor: "#4338ca", borderRadius: "50%", animation: "af-spin 0.6s linear infinite", flexShrink: 0 }} />
            )}
          </div>
          {open && (
            <div className="af-search-dropdown">
              {results.length === 0 ? (
                <div className="af-search-empty">Nenhum resultado para "{query}"</div>
              ) : (
                <>
                  {results.map((r, i) => {
                    const cfg = TYPE_CONFIG[r.type];
                    const Icon = cfg.icon;
                    return (
                      <div
                        key={r.id}
                        className={`af-search-item${selected === i ? " selected" : ""}`}
                        onMouseDown={() => goTo(r)}
                        onMouseEnter={() => setSelected(i)}
                      >
                        <div className="af-search-item-icon" style={{ background: cfg.bg, color: cfg.color }}>
                          <Icon size={16} />
                        </div>
                        <div className="af-search-item-text">
                          <div className="af-search-item-title">{r.title}</div>
                          <div className="af-search-item-sub">{r.subtitle}</div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px", flexShrink: 0 }}>
                          {r.value && (
                            <span style={{ fontSize: "13px", fontWeight: 600, color: r.valueColor ?? "#374151" }}>{r.value}</span>
                          )}
                          <span style={{ fontSize: "10px", background: cfg.bg, color: cfg.color, padding: "2px 7px", borderRadius: "20px", fontWeight: 500 }}>
                            {cfg.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div style={{ padding: "8px 16px", background: "#f9fafb", borderTop: "1px solid #f3f4f6", fontSize: "11px", color: "#9ca3af", textAlign: "center" }}>
                    {results.length} resultado{results.length !== 1 ? "s" : ""} · ↑↓ para navegar · Enter para abrir
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        <div className="af-topbar-right">
          <div style={{ position: "relative", cursor: "pointer" }}>
            <Bell size={20} color="#374151" />
            <span style={{ position: "absolute", top: "-5px", right: "-5px", width: "8px", height: "8px", background: "red", borderRadius: "50%" }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="af-topbar-username">
              <p style={{ margin: 0, fontWeight: 500 }}>{usuario ? usuario.nome : "Carregando..."}</p>
              <p style={{ margin: 0, fontSize: "12px", color: "gray" }}>ID: {idFormatado}</p>
            </div>

            <div
              onClick={() => navigate("/usersettings")}
              style={{ width: "35px", height: "35px", borderRadius: "50%", background: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", cursor: "pointer", flexShrink: 0 }}
            >
              {inicial}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes af-spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}

export default TopBar;