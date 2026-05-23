import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, BarChart2, DollarSign, ArrowUp, ArrowDown, RefreshCw } from "lucide-react";

type HistoricalPrice = {
  date: number;
  close: number;
};

type StockData = {
  symbol: string;
  shortName: string;
  longName: string;
  currency: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketVolume: number;
  regularMarketPreviousClose: number;
  regularMarketOpen: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  averageDailyVolume3Month: number;
  marketCap: number;
  priceEarnings: number;
  earningsPerShare: number;
  historicalDataPrice: HistoricalPrice[];
};

const TICKERS = [
  // Petróleo & Energia
  "PETR4", "PETR3", "PRIO3",
  // Mineração & Siderurgia
  "VALE3", "CSNA3", "GGBR4",
  // Bancos
  "ITUB4", "BBAS3", "BBDC4", "SANB11",
  // Varejo & Consumo
  "MGLU3", "RENT3", "LREN3",
  // Telecom & Tech
  "VIVT3", "TOTS3",
  // Utilities
  "ELET3", "SBSP3",
];

const SECTOR_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  PETR4: { bg: "#e0e7ff", color: "#4338ca", label: "Petróleo" },
  PETR3: { bg: "#e0e7ff", color: "#4338ca", label: "Petróleo" },
  PRIO3: { bg: "#e0e7ff", color: "#4338ca", label: "Petróleo" },
  VALE3: { bg: "#fef3c7", color: "#d97706", label: "Mineração" },
  CSNA3: { bg: "#fef3c7", color: "#d97706", label: "Siderurgia" },
  GGBR4: { bg: "#fef3c7", color: "#d97706", label: "Siderurgia" },
  ITUB4: { bg: "#dbeafe", color: "#2563eb", label: "Banco" },
  BBAS3: { bg: "#dbeafe", color: "#2563eb", label: "Banco" },
  BBDC4: { bg: "#dbeafe", color: "#2563eb", label: "Banco" },
  SANB11: { bg: "#dbeafe", color: "#2563eb", label: "Banco" },
  MGLU3: { bg: "#fce7f3", color: "#db2777", label: "Varejo" },
  RENT3: { bg: "#fce7f3", color: "#db2777", label: "Varejo" },
  LREN3: { bg: "#fce7f3", color: "#db2777", label: "Varejo" },
  VIVT3: { bg: "#ede9fe", color: "#7c3aed", label: "Telecom" },
  TOTS3: { bg: "#ede9fe", color: "#7c3aed", label: "Tecnologia" },
  ELET3: { bg: "#dcfce7", color: "#16a34a", label: "Energia" },
  SBSP3: { bg: "#dcfce7", color: "#16a34a", label: "Utilidade" },
};

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatVolume(value: number) {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return value.toString();
}

function formatMarketCap(value: number) {
  if (value >= 1_000_000_000_000) return `R$ ${(value / 1_000_000_000_000).toFixed(2)}T`;
  if (value >= 1_000_000_000) return `R$ ${(value / 1_000_000_000).toFixed(1)}B`;
  return `R$ ${(value / 1_000_000).toFixed(0)}M`;
}

function StockCard({ stock }: { stock: StockData }) {
  const isUp = stock.regularMarketChange >= 0;
  const sector = SECTOR_COLORS[stock.symbol] ?? { bg: "#f3f4f6", color: "#374151", label: "Ação" };

  const firstClose = stock.historicalDataPrice?.[0]?.close;
  const yearReturn = firstClose
    ? ((stock.regularMarketPrice - firstClose) / firstClose) * 100
    : null;
  const yearIsUp = yearReturn != null && yearReturn >= 0;

  let volatility: number | null = null;
  if (stock.historicalDataPrice?.length >= 2) {
    const returns = stock.historicalDataPrice.slice(1).map((p, i) => {
      const prev = stock.historicalDataPrice[i].close;
      return prev > 0 ? ((p.close - prev) / prev) * 100 : 0;
    });
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
    volatility = Math.sqrt(variance);
  }

  return (
    <div style={{
      background: "#fff",
      borderRadius: "16px",
      padding: "20px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      transition: "box-shadow 0.2s",
    }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)")}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            background: sector.bg, color: sector.color,
            borderRadius: "8px", padding: "4px 10px",
            fontWeight: 700, fontSize: "13px",
          }}>
            {stock.symbol}
          </div>
          <span style={{ fontSize: "11px", color: "#9ca3af", background: "#f9fafb", padding: "3px 8px", borderRadius: "6px" }}>
            {sector.label}
          </span>
        </div>
        <span style={{
          background: isUp ? "#dcfce7" : "#fee2e2",
          color: isUp ? "#16a34a" : "#dc2626",
          padding: "4px 10px", borderRadius: "50px",
          fontSize: "12px", fontWeight: 600,
        }}>
          {isUp ? "▲" : "▼"} {isUp ? "+" : ""}{stock.regularMarketChangePercent.toFixed(2)}%
        </span>
      </div>

      <div>
        <p style={{ margin: 0, fontSize: "11px", color: "#9ca3af", marginBottom: "2px" }}>
          {stock.longName || stock.shortName}
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <span style={{ fontSize: "24px", fontWeight: 700, color: "#111827" }}>
            {formatBRL(stock.regularMarketPrice)}
          </span>
          <span style={{ fontSize: "13px", fontWeight: 600, color: isUp ? "#16a34a" : "#dc2626" }}>
            {isUp ? "+" : ""}{formatBRL(stock.regularMarketChange)}
          </span>
        </div>
      </div>

      <div style={{ height: "1px", background: "#f3f4f6" }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {[
          { label: "Abertura", value: formatBRL(stock.regularMarketOpen), icon: <DollarSign size={12} /> },
          { label: "Fech. anterior", value: formatBRL(stock.regularMarketPreviousClose), icon: <DollarSign size={12} /> },
          { label: "Mín do dia", value: formatBRL(stock.regularMarketDayLow), icon: <ArrowDown size={12} />, color: "#dc2626" },
          { label: "Máx do dia", value: formatBRL(stock.regularMarketDayHigh), icon: <ArrowUp size={12} />, color: "#16a34a" },
          { label: "Volume", value: formatVolume(stock.regularMarketVolume), icon: <BarChart2 size={12} /> },
          { label: "Média vol. 3m", value: stock.averageDailyVolume3Month ? formatVolume(stock.averageDailyVolume3Month) : "—", icon: <BarChart2 size={12} /> },
          { label: "Mín 52s", value: formatBRL(stock.fiftyTwoWeekLow), icon: <TrendingDown size={12} />, color: "#dc2626" },
          { label: "Máx 52s", value: formatBRL(stock.fiftyTwoWeekHigh), icon: <TrendingUp size={12} />, color: "#16a34a" },
        ].map((m, i) => (
          <div key={i} style={{ background: "#f9fafb", borderRadius: "8px", padding: "8px 10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#9ca3af", marginBottom: "2px" }}>
              {m.icon}
              <span style={{ fontSize: "10px" }}>{m.label}</span>
            </div>
            <span style={{ fontSize: "12px", fontWeight: 600, color: m.color ?? "#111827" }}>{m.value}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {yearReturn != null && (
          <span style={{
            background: yearIsUp ? "#ede9fe" : "#fee2e2",
            color: yearIsUp ? "#7c3aed" : "#dc2626",
            padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 600,
          }}>
            12m: {yearIsUp ? "+" : ""}{yearReturn.toFixed(1)}%
          </span>
        )}
        {volatility != null && (
          <span style={{ background: "#f3f4f6", color: "#6b7280", padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 600 }}>
            Vol: {volatility.toFixed(1)}%
          </span>
        )}
        {stock.marketCap && (
          <span style={{ background: "#f3f4f6", color: "#6b7280", padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 600 }}>
            Cap: {formatMarketCap(stock.marketCap)}
          </span>
        )}
        {stock.priceEarnings && (
          <span style={{ background: "#f3f4f6", color: "#6b7280", padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 600 }}>
            P/L: {stock.priceEarnings.toFixed(1)}
          </span>
        )}
      </div>
    </div>
  );
}

function makeMock(symbol: string, price: number, changePct: number): StockData {
  const change = +(price * changePct / 100).toFixed(2);
  const history: HistoricalPrice[] = Array.from({ length: 12 }, (_, i) => ({
    date: Date.now() - (11 - i) * 30 * 24 * 3600 * 1000,
    close: +(price * (1 - changePct / 100 + (i / 11) * (changePct / 100))).toFixed(2),
  }));
  return {
    symbol, shortName: symbol, longName: symbol, currency: "BRL",
    regularMarketPrice: price,
    regularMarketChange: change,
    regularMarketChangePercent: changePct,
    regularMarketDayHigh: +(price * 1.015).toFixed(2),
    regularMarketDayLow: +(price * 0.985).toFixed(2),
    regularMarketVolume: Math.floor(Math.random() * 50_000_000) + 5_000_000,
    regularMarketPreviousClose: +(price - change).toFixed(2),
    regularMarketOpen: +(price - change * 0.3).toFixed(2),
    fiftyTwoWeekHigh: +(price * 1.3).toFixed(2),
    fiftyTwoWeekLow: +(price * 0.72).toFixed(2),
    averageDailyVolume3Month: Math.floor(Math.random() * 40_000_000) + 3_000_000,
    marketCap: price * 1_000_000_000,
    priceEarnings: +(Math.random() * 15 + 5).toFixed(1),
    earningsPerShare: +(price / 10).toFixed(2),
    historicalDataPrice: history,
  };
}

const MOCK_STOCKS: StockData[] = [
  makeMock("PETR4", 44.50, -1.05),
  makeMock("PETR3", 41.20, -0.80),
  makeMock("PRIO3", 58.30, 0.45),
  makeMock("VALE3", 62.10, -2.10),
  makeMock("CSNA3", 14.80, 1.20),
  makeMock("GGBR4", 19.40, 0.75),
  makeMock("ITUB4", 36.90, 0.55),
  makeMock("BBAS3", 28.60, -0.30),
  makeMock("BBDC4", 15.70, -1.50),
  makeMock("SANB11", 29.10, 0.90),
  makeMock("MGLU3", 9.80, -3.20),
  makeMock("RENT3", 52.40, 1.10),
  makeMock("LREN3", 18.90, 0.60),
  makeMock("VIVT3", 54.20, 0.40),
  makeMock("TOTS3", 36.70, 2.30),
  makeMock("ELET3", 44.80, -0.70),
  makeMock("SBSP3", 88.50, 1.80),
];

export default function SavingsCards() {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  async function fetchStocks() {
    setLoading(true);
    setErro(false);
    try {
      // Brapi gratuita busca um ticker por vez para evitar bloqueio
      const results: StockData[] = [];
      for (const ticker of TICKERS) {
        try {
          const res = await fetch(
            `https://brapi.dev/api/quote/${ticker}?range=1y&interval=1mo&fundamental=true`
          );
          if (!res.ok) continue;
          const json = await res.json();
          if (json.results?.[0]) results.push(json.results[0]);
        } catch {
          // ticker individual falhou, pula
        }
        //pausa para não sobrecarregar a API
        await new Promise(r => setTimeout(r, 150));
      }

      if (results.length > 0) {
        setStocks(results);
        setLastUpdate(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
      } else {
        throw new Error("Nenhum resultado");
      }
    } catch (err) {
      console.warn("Brapi indisponível, usando dados de demonstração.", err);
      setStocks(MOCK_STOCKS);
      setLastUpdate("demonstração");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchStocks(); }, []);

  if (loading) {
    return (
      <>
        <style>{`
          .af-stock-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:16px}
          @media(max-width:1100px){.af-stock-grid{grid-template-columns:repeat(3,1fr)}}
          @media(max-width:768px){.af-stock-grid{grid-template-columns:repeat(2,1fr)}}
          @media(max-width:480px){.af-stock-grid{grid-template-columns:1fr}}
        `}</style>
        <div style={{ marginTop: "24px" }}>
          <div className="af-stock-grid">
            {TICKERS.map(t => (
              <div key={t} style={{ background: "#fff", borderRadius: "16px", padding: "20px", height: "320px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "13px", color: "#9ca3af" }}>{t}…</span>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (erro) {
    return (
      <div style={{ marginTop: "24px", padding: "20px", background: "#fff", borderRadius: "16px", color: "#dc2626", fontSize: "14px" }}>
        Erro ao carregar dados de mercado.
      </div>
    );
  }

  // Agrupar por setor
  const sectors: Record<string, StockData[]> = {};
  stocks.forEach(s => {
    const label = SECTOR_COLORS[s.symbol]?.label ?? "Outros";
    if (!sectors[label]) sectors[label] = [];
    sectors[label].push(s);
  });

  return (
    <>
      <style>{`
        .af-stock-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-top: 12px;
        }
        @media (max-width: 1100px) { .af-stock-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px)  { .af-stock-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px)  { .af-stock-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div style={{ marginTop: "24px", display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#111827" }}>
            Mercado B3 — Acompanhamento
          </h3>
          <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af" }}>
            {stocks.length} ativos ·{" "}
            {lastUpdate === "demonstração"
              ? <span style={{ color: "#f59e0b", fontWeight: 600 }}>⚠ Dados de demonstração — API indisponível</span>
              : <>Atualizado às {lastUpdate} · Fonte: brapi.dev</>
            }
          </p>
        </div>
        <button
          onClick={fetchStocks}
          style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: "#f3f4f6", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "13px", color: "#374151", fontWeight: 500 }}
        >
          <RefreshCw size={14} /> Atualizar
        </button>
      </div>

      {Object.entries(sectors).map(([sectorName, sectorStocks]) => (
        <div key={sectorName} style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <span style={{
              background: Object.values(SECTOR_COLORS).find(s => s.label === sectorName)?.bg ?? "#f3f4f6",
              color: Object.values(SECTOR_COLORS).find(s => s.label === sectorName)?.color ?? "#374151",
              padding: "3px 12px", borderRadius: "50px", fontSize: "12px", fontWeight: 600,
            }}>
              {sectorName}
            </span>
            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
          </div>
          <div className="af-stock-grid">
            {sectorStocks.map(stock => (
              <StockCard key={stock.symbol} stock={stock} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}