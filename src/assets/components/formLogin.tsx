import { apiUrl } from "../../config/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "./Toast";
import { useToast } from "../hooks/useToast";

function FormLogin() {
  const [modo, setModo] = useState<"login" | "cadastro">("login");
  const navigate = useNavigate();
  const { toasts, mostrarToast, removerToast } = useToast();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(false);

  const [nome, setNome] = useState("");
  const [emailCadastro, setEmailCadastro] = useState("");
  const [idade, setIdade] = useState("");
  const [senhaCadastro, setSenhaCadastro] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [carregando, setCarregando] = useState(false);

  function alternarModo() {
    setModo(modo === "login" ? "cadastro" : "login");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    try {
      const response = await fetch(apiUrl("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const data = await response.json();
      if (!response.ok) { mostrarToast(data.message || "Erro ao fazer login", "erro"); return; }
      lembrar ? localStorage.setItem("token", data.token) : sessionStorage.setItem("token", data.token);
      mostrarToast("Login realizado com sucesso!", "sucesso");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch {
      mostrarToast("Erro de conexão. Tente novamente.", "erro");
    } finally {
      setCarregando(false);
    }
  }

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault();
    if (senhaCadastro !== confirmarSenha) { mostrarToast("As senhas não coincidem!", "aviso"); return; }
    setCarregando(true);
    try {
      const response = await fetch(apiUrl("/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email: emailCadastro, idade: Number(idade), senha: senhaCadastro }),
      });
      const data = await response.json();
      if (!response.ok) { mostrarToast(data.message || "Erro ao cadastrar", "erro"); return; }
      mostrarToast("Conta criada com sucesso! Faça o login.", "sucesso");
      setModo("login");
      setEmail(emailCadastro); setSenha("");
      setNome(""); setEmailCadastro(""); setIdade(""); setSenhaCadastro(""); setConfirmarSenha("");
    } catch {
      mostrarToast("Erro de conexão. Tente novamente.", "erro");
    } finally {
      setCarregando(false);
    }
  }

  const inputStyle = {
    padding: "12px", borderRadius: "10px", border: "1px solid #d1d5db",
    outline: "none", fontSize: "14px", width: "100%", boxSizing: "border-box" as const,
  };

  const labelStyle = { fontSize: "14px", fontWeight: "500" as const, color: "#111827" };

  return (
    <>
      <style>{`
        .af-form-card {
          background: #ffffff;
          width: 480px;
          padding: 40px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        @media (max-width: 520px) {
          .af-form-card {
            width: 100%;
            min-width: 0;
            padding: 24px 20px;
            border-radius: 16px;
          }
        }
      `}</style>

      <div className="af-form-card">
        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "2px solid #e5e7eb" }}>
          {(["login", "cadastro"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setModo(m)}
              style={{
                flex: 1, padding: "10px", border: "none", background: "none",
                fontWeight: "600", fontSize: "14px", cursor: "pointer",
                color: modo === m ? "#4338ca" : "#9ca3af",
                borderBottom: modo === m ? "2px solid #4338ca" : "2px solid transparent",
                marginBottom: "-2px", transition: "all 0.2s",
              }}
            >
              {m === "login" ? "Login" : "Cadastro"}
            </button>
          ))}
        </div>

        {/* FORM LOGIN */}
        {modo === "login" && (
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "22px", color: "#111827" }}>Bem-vindo de volta!</h1>
              <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#6b7280" }}>Entre na sua conta para continuar</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={labelStyle}>E-mail</label>
              <input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={labelStyle}>Senha</label>
              <input type="password" placeholder="••••••••" value={senha} onChange={(e) => setSenha(e.target.value)} required style={inputStyle} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px", flexWrap: "wrap", gap: "8px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6b7280" }}>
                <input type="checkbox" checked={lembrar} onChange={(e) => setLembrar(e.target.checked)} />
                Lembrar usuário
              </label>
              <a href="#" style={{ color: "#4f46e5", textDecoration: "none" }}>Esqueceu a senha?</a>
            </div>

            <button type="submit" disabled={carregando} style={{ marginTop: "10px", padding: "12px", borderRadius: "10px", border: "none", background: carregando ? "#6366f1" : "#4338ca", color: "#ffffff", fontWeight: "600", fontSize: "15px", cursor: carregando ? "not-allowed" : "pointer" }}>
              {carregando ? "Entrando..." : "Entrar"}
            </button>

            <p style={{ textAlign: "center", fontSize: "14px", color: "#6b7280", margin: 0 }}>
              Não tem uma conta?{" "}
              <span onClick={alternarModo} style={{ color: "#4338ca", fontWeight: "500", cursor: "pointer" }}>Cadastre-se gratuitamente</span>
            </p>
          </form>
        )}

        {/* FORM CADASTRO */}
        {modo === "cadastro" && (
          <form onSubmit={handleCadastro} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "22px", color: "#111827" }}>Crie sua conta</h1>
              <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#6b7280" }}>Preencha os dados para se cadastrar</p>
            </div>

            {[
              { label: "Nome", type: "text", placeholder: "Seu nome completo", value: nome, set: setNome },
              { label: "E-mail", type: "email", placeholder: "seu@email.com", value: emailCadastro, set: setEmailCadastro },
              { label: "Idade", type: "number", placeholder: "Sua idade", value: idade, set: setIdade },
              { label: "Senha", type: "password", placeholder: "Mínimo 8 caracteres", value: senhaCadastro, set: setSenhaCadastro },
              { label: "Confirmar senha", type: "password", placeholder: "Repita a senha", value: confirmarSenha, set: setConfirmarSenha },
            ].map(({ label, type, placeholder, value, set }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={labelStyle}>{label}</label>
                <input
                  type={type} placeholder={placeholder} value={value}
                  onChange={(e) => set(e.target.value)}
                  required
                  style={inputStyle}
                  {...(type === "number" ? { min: 1, max: 120 } : {})}
                  {...(label === "Senha" ? { minLength: 8 } : {})}
                />
              </div>
            ))}

            <button type="submit" disabled={carregando} style={{ marginTop: "10px", padding: "12px", borderRadius: "10px", border: "none", background: carregando ? "#6366f1" : "#4338ca", color: "#ffffff", fontWeight: "600", fontSize: "15px", cursor: carregando ? "not-allowed" : "pointer" }}>
              {carregando ? "Cadastrando..." : "Criar conta"}
            </button>
          </form>
        )}
      </div>

      <Toast toasts={toasts} onRemover={removerToast} />
    </>
  );
}

export default FormLogin;