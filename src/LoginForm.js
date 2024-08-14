import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ref, get } from "firebase/database";
import { db, auth } from "./config";
import RegisterForm from "./RegisterForm";

function LoginForm({ onClose, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    cpf: "",
    senha: "",
  });

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleToggleMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const usuariosRef = ref(db, "usuarios");

    try {
      const snapshot = await get(usuariosRef);
      if (snapshot.exists()) {
        const usuarios = snapshot.val();
        const usuarioEncontrado = Object.values(usuarios).find(
          (usuario) =>
            usuario.cpf === formData.cpf && usuario.senha === formData.senha
        );

        if (usuarioEncontrado) {
          console.log("Login bem-sucedido!");
          setLoginError("");
          onClose();

          onLoginSuccess();

          localStorage.setItem("user", JSON.stringify(usuarioEncontrado));

          // Adicionando o alerta quando o login for bem-sucedido
          alert("Você está logado!");
        } else {
          setLoginError("Credenciais inválidas. Verifique seu CPF e senha.");
        }
      }
    } catch (error) {
      console.error("Erro ao tentar realizar o login:", error.message);
      setLoginError("Ocorreu um erro ao tentar realizar o login.");
    }
  };

  const handleNavigateToRegister = () => {
    setShowRegisterForm(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");

    auth.signOut();
  };

  return (
    <div className="overlay">
      <div className="modal">
        <div className="message-container">
          <div className="close-button" onClick={onClose}>
            X
          </div>
          <img
            src="imagens/simbolo.png"
            alt="Descrição da Imagem"
            style={{ width: "100px" }}
          />
          <h2>Entrar com CPF e Senha:</h2>
          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-container">
              <label htmlFor="cpf">CPF:</label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                placeholder="Digite seu CPF..."
                value={formData.cpf}
                onChange={handleChange}
                required
                className="cpf-input"
              />
            </div>

            <div className="input-container">
              <label htmlFor="senha">Senha:</label>
              <div className="senha-input-container">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  id="senha"
                  name="senha"
                  placeholder="Digite sua senha..."
                  value={formData.senha}
                  onChange={handleChange}
                  required
                  className="senha-input"
                />
                <span className="olho-icon" onClick={handleToggleMostrarSenha}>
                  {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button type="submit" className="entrar-button cadastro-button">
              Entrar
            </button>

            {loginError && <div className="login-error">{loginError}</div>}

            <div className="esqueci-senha">
              <span onClick={handleNavigateToRegister}>
                Não possui conta? Cadastre-se agora
              </span>
            </div>
          </form>
        </div>
      </div>
      {showRegisterForm && (
        <RegisterForm onClose={() => setShowRegisterForm(false)} />
      )}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default LoginForm;
