import React, { useState } from "react";
import { FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import { ref, push, set, get, forEach } from "firebase/database";
import { db } from "./config";

function RegisterForm({ onClose }) {
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    cpf: "",
    email: "",
    senha: "",
    confirmacaoSenha: "",
  });

  const [avisoSenha, setAvisoSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarSenhaConfirmacao, setMostrarSenhaConfirmacao] = useState(false);

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

  const handleToggleMostrarSenhaConfirmacao = () => {
    setMostrarSenhaConfirmacao(!mostrarSenhaConfirmacao);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Verificar se a senha e a confirmação de senha são iguais
    if (formData.senha !== formData.confirmacaoSenha) {
      setAvisoSenha("Suas senhas não coincidem, digite novamente");

      // Limpar campos de senha
      setFormData((prevData) => ({
        ...prevData,
        senha: "",
        confirmacaoSenha: "",
      }));

      return;
    }

    // Limpar aviso de senha
    setAvisoSenha("");

    // Verificar se o CPF já existe no banco de dados
    const usuariosRef = ref(db, "usuarios");
    const usuariosSnapshot = await get(usuariosRef);

    const usuariosArray = Object.values(usuariosSnapshot.val());
    const cpfExistente = usuariosArray.some(
      (usuario) => usuario.cpf === formData.cpf,
    );

    if (cpfExistente) {
      setAvisoSenha(
        "Este CPF já está cadastrado. Por favor, insira um CPF diferente.",
      );

      // Limpar campos do formulário
      setFormData({
        nomeCompleto: "",
        cpf: "",
        email: "",
        senha: "",
        confirmacaoSenha: "",
      });

      return;
    }

    // Limpar aviso de senha novamente
    setAvisoSenha("");

    // Salvar dados no banco de dados
    const novoUsuarioRef = push(usuariosRef);

    try {
      await set(novoUsuarioRef, {
        id: novoUsuarioRef.key,
        nome: formData.nomeCompleto,
        cpf: formData.cpf,
        senha: formData.senha,
      });

      // Limpar o formulário após o cadastro
      setFormData({
        nomeCompleto: "",
        cpf: "",
        email: "",
        senha: "",
        confirmacaoSenha: "",
      });

      // Fechar o formulário após o cadastro bem-sucedido
      onClose();

      // Exibir alerta de sucesso
      alert("Cadastro realizado com sucesso");
    } catch (error) {
      console.error("Erro ao salvar usuário:", error.message);
    }
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
          <h2>Faça o cadastro abaixo:</h2>
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="input-container">
              <label htmlFor="nomeCompleto">Nome Completo:</label>
              <input
                type="text"
                id="nomeCompleto"
                name="nomeCompleto"
                placeholder="Digite seu Nome..."
                value={formData.nomeCompleto}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-container">
              <label htmlFor="cpf">CPF:</label>
              <input
                type="text"
                id="cpf"
                placeholder="Digite seu CPF..."
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                required
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
                />
                <span className="olho-icon" onClick={handleToggleMostrarSenha}>
                  {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="input-container">
              <label htmlFor="confirmacaoSenha">Confirme a Senha:</label>
              <div className="senha-input-container">
                <input
                  type={mostrarSenhaConfirmacao ? "text" : "password"}
                  id="confirmacaoSenha"
                  name="confirmacaoSenha"
                  placeholder="Confirme sua senha..."
                  value={formData.confirmacaoSenha}
                  onChange={handleChange}
                  required
                />
                <span
                  className="olho-icon"
                  onClick={handleToggleMostrarSenhaConfirmacao}
                >
                  {mostrarSenhaConfirmacao ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="aviso-senha">{avisoSenha}</div>
            <button type="submit" className="cadastro-button">
              Cadastrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
