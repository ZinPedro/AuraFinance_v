import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "../components/Toast";
import { useToast } from "../hooks/useToast";
import { User, Lock, LogOut, Trash2, Save, X } from "lucide-react";

interface Usuario {
  id_usuario: number;
  nome: string;
  email: string;
  idade: number;
}

function UserSettings() {
  const navigate = useNavigate();
  const { toasts, mostrarToast, removerToast } = useToast();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [aba, setAba] = useState<"info" | "senha" | "danger">("info");

  // Editar informação
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [salvandoInfo, setSalvandoInfo] = useState(false);

  // Trocar senha
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [salvandoSenha, setSalvandoSenha] = useState(false);

  // Apagar conta
  const [senhaDelete, setSenhaDelete] = useState("");
  const [confirmarDelete, setConfirmarDelete] = useState(false);
  const [deletando, setDeletando] = useState(false);

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    async function buscarUsuario() {
      if (!token) { navigate("/"); return; }
      try {
        const res = await fetch("http://localhost:3000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUsuario(data.user);
          setNome(data.user.nome);
          setIdade(String(data.user.idade));
        } else {
          navigate("/");
        }
      } catch {
        navigate("/");
      } finally {
        setCarregando(false);
      }
    }
    buscarUsuario();
  }, []);

  async function salvarInfo(e: React.FormEvent) {
    e.preventDefault();
    setSalvandoInfo(true);
    try {
      const res = await fetch("http://localhost:3000/auth/edit-user", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nome, idade: Number(idade) }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsuario((prev) => prev ? { ...prev, nome, idade: Number(idade) } : prev);
        mostrarToast("Informações atualizadas com sucesso!", "sucesso");
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        mostrarToast(data.message || "Erro ao atualizar", "erro");
      }
    } catch {
      mostrarToast("Erro de conexão.", "erro");
    } finally {
      setSalvandoInfo(false);
    }
  }

  async function salvarSenha(e: React.FormEvent) {
    e.preventDefault();
    if (novaSenha !== confirmarSenha) {
      mostrarToast("As senhas não coincidem!", "aviso");
      return;
    }
    if (novaSenha.length < 8) {
      mostrarToast("A senha deve ter no mínimo 8 caracteres!", "aviso");
      return;
    }
    setSalvandoSenha(true);
    try {
      const res = await fetch("http://localhost:3000/auth/edit-user", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ senha: novaSenha }),
      });
      const data = await res.json();
      if (res.ok) {
        mostrarToast("Senha alterada com sucesso!", "sucesso");
        setNovaSenha("");
        setConfirmarSenha("");
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        mostrarToast(data.message || "Erro ao alterar senha", "erro");
      }
    } catch {
      mostrarToast("Erro de conexão.", "erro");
    } finally {
      setSalvandoSenha(false);
    }
  }

  async function deletarConta() {
    if (!senhaDelete) { mostrarToast("Digite sua senha para confirmar!", "aviso"); return; }
    setDeletando(true);
    try {
      const res = await fetch("http://localhost:3000/auth/delete-user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ senha: senhaDelete }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        mostrarToast("Conta apagada. Até logo!", "info");
        setTimeout(() => navigate("/"), 1500);
      } else {
        mostrarToast(data.message || "Erro ao apagar conta", "erro");
      }
    } catch {
      mostrarToast("Erro de conexão.", "erro");
    } finally {
      setDeletando(false);
    }
  }

  function deslogar() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/");
  }

  const inicial = usuario?.nome?.charAt(0).toUpperCase() ?? "?";

  const inputStyle: React.CSSProperties = {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    outline: "none",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box",
    background: "#f9fafb",
    color: "#111827",
    transition: "border 0.2s",
  };

  const btnPrimary: React.CSSProperties = {
    padding: "11px 22px",
    borderRadius: "10px",
    border: "none",
    background: "#4338ca",
    color: "#fff",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const abaStyle = (ativa: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 18px",
    borderRadius: "10px",
    border: "none",
    background: ativa ? "#ede9fe" : "transparent",
    color: ativa ? "#4338ca" : "#6b7280",
    fontWeight: ativa ? "600" : "400",
    fontSize: "14px",
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
    transition: "all 0.15s",
  });

  if (carregando) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p style={{ color: "#d1d1d1", fontWeight: "600", fontSize: "32px" }}>Carregando...</p>
      </div>
    );
  }

  return (
    <>
      <div style={{ minHeight: "100vh", background: "#f3f4f6", padding: "40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          {/* Header */}
          <div style={{ marginBottom: "32px" }}>
            <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "700", color: "#111827" }}>Minha Conta</h1>
            <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "14px" }}>Gerencie suas informações e preferências</p>
          </div>

          <div style={{ display: "flex", gap: "24px", alignItems: "stretch" }}>

            {/* Sidebar */}
            <div style={{ width: "220px", flexShrink: 0, background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: "4px" }}>

              {/* Avatar */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid #f3f4f6" }}>
                <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#4338ca", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "24px" }}>
                  {inicial}
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ margin: 0, fontWeight: "600", fontSize: "15px", color: "#111827" }}>{usuario?.nome}</p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>{usuario?.email}</p>
                </div>
              </div>

              <button style={abaStyle(aba === "info")} onClick={() => setAba("info")}>
                <User size={16} /> Informações
              </button>
              <button style={abaStyle(aba === "senha")} onClick={() => setAba("senha")}>
                <Lock size={16} /> Alterar Senha
              </button>
              <button style={abaStyle(aba === "danger")} onClick={() => setAba("danger")}>
                <Trash2 size={16} /> Exclusão
              </button>

              <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #f3f4f6" }}>
                <button onClick={deslogar} style={{ ...abaStyle(false), color: "#dc2626" }}>
                  <LogOut size={16} /> Sair da conta
                </button>
              </div>
            </div>

            <div style={{ flex: 1, background: "#fff", borderRadius: "16px", padding: "32px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", alignSelf: "stretch" }}>
              {aba === "info" && (
                <form onSubmit={salvarInfo} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#111827" }}>Informações Pessoais</h2>
                    <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#6b7280" }}>Atualize seu nome e idade</p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Nome</label>
                    <input style={inputStyle} type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Idade</label>
                    <input style={inputStyle} type="number" value={idade} onChange={(e) => setIdade(e.target.value)} min={1} max={120} required />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>E-mail</label>
                    <input style={{ ...inputStyle, background: "#f3f4f6", color: "#9ca3af", cursor: "not-allowed" }} type="email" value={usuario?.email ?? ""} disabled />
                    <span style={{ fontSize: "12px", color: "#9ca3af" }}>O e-mail não pode ser alterado.</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button type="submit" disabled={salvandoInfo} style={btnPrimary}>
                      <Save size={15} />
                      {salvandoInfo ? "Salvando..." : "Salvar alterações"}
                    </button>
                  </div>
                </form>
              )}

              {aba === "senha" && (
                <form onSubmit={salvarSenha} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#111827" }}>Alterar Senha</h2>
                    <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#6b7280" }}>Escolha uma senha forte com no mínimo 8 caracteres</p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Nova senha</label>
                    <input style={inputStyle} type="password" placeholder="Mínimo 8 caracteres" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} required minLength={8} />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Confirmar nova senha</label>
                    <input style={inputStyle} type="password" placeholder="Repita a nova senha" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} required />
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button type="submit" disabled={salvandoSenha} style={btnPrimary}>
                      <Lock size={15} />
                      {salvandoSenha ? "Salvando..." : "Alterar senha"}
                    </button>
                  </div>
                </form>
              )}

              {aba === "danger" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#111827" }}>Exclusão</h2>
                    <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#6b7280" }}>Essa Acção é irreversível e fará com que todos os dados associados à sua conta sejam removidos de nossas bases de dados.<br></br> Tem certeza que deseja continuar?</p>
                  </div>

                  <div style={{ border: "1px solid #fca5a5", borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: "600", color: "#b91c1c", fontSize: "15px" }}>Apagar minha conta</p>
                      <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#6b7280" }}>Esta ação é permanente e não pode ser desfeita. Todos os seus dados serão removidos.</p>
                    </div>

                    {!confirmarDelete ? (
                      <button onClick={() => setConfirmarDelete(true)} style={{ padding: "10px 18px", borderRadius: "10px", border: "1px solid #fca5a5", background: "#fff5f5", color: "#b91c1c", fontWeight: "600", fontSize: "14px", cursor: "pointer", width: "fit-content" }}>
                        Quero apagar minha conta
                      </button>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#374151" }}>Digite sua senha para confirmar:</p>
                        <input style={{ ...inputStyle, border: "1px solid #fca5a5" }} type="password" placeholder="Sua senha atual" value={senhaDelete} onChange={(e) => setSenhaDelete(e.target.value)} />
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button onClick={deletarConta} disabled={deletando} style={{ padding: "10px 18px", borderRadius: "10px", border: "none", background: "#dc2626", color: "#fff", fontWeight: "600", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                            <Trash2 size={15} />
                            {deletando ? "Apagando..." : "Confirmar exclusão"}
                          </button>
                          <button onClick={() => { setConfirmarDelete(false); setSenhaDelete(""); }} style={{ padding: "10px 18px", borderRadius: "10px", border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: "600", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                            <X size={15} /> Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      <Toast toasts={toasts} onRemover={removerToast} />
    </>
  );
}

export default UserSettings;