// DetalhesProdutoModal.js

import React from "react";
import "./DetalhesProdutoModal.css";

const DetalhesProdutoModal = ({ produto, onClose }) => {
  return (
    <div className="detalhes-produto-modal">
      {/* Adicionando o "x" para fechar o modal */}
      <span className="fechar-modal" onClick={onClose}>
        &times;
      </span>

      {/* Conteúdo do modal com os detalhes do produto */}
      <div className="header-modal">
        <img className="logo-modal" src="imagens/logocircular.png" alt="Logo" />
        <h2>{produto.nome}</h2>
      </div>

      <img src={produto.imagem} alt={produto.nome} />

      <h3 className="descricao-titulo">Descrição</h3>
      <p className="descricao">{produto.descricao}</p>
    </div>
  );
};

export default DetalhesProdutoModal;
