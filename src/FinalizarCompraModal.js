import React, { useState, useEffect } from "react";
import { ref, push, set } from "firebase/database";
import "./FinalizarCompraModal.css";
import { db } from "./config";

const FinalizarCompraModal = ({ itens, onClose, onEfetuarPagamento, logo, onPagamentoConcluido }) => {
  const [mostrarItensCarrinho, setMostrarItensCarrinho] = useState(false);
  const [mostrarFormasPagamento, setMostrarFormasPagamento] = useState(false);

  useEffect(() => {
    setMostrarItensCarrinho(false);
  }, []);

  const calcularValorTotal = () => {
    return itens
      .reduce((total, item) => total + item.preco * item.quantidade, 0)
      .toFixed(2);
  };

  const handleEfetuarPagamento = async () => {
    try {
      const userData = localStorage.getItem("user");

      if (!userData) {
        alert("Você precisa estar logado para efetuar um pedido.");
        onClose();
        return;
      }

      const user = JSON.parse(userData);
      const pedidosRef = ref(db, "pedidos");
      const novoPedidoRef = push(pedidosRef);

      const formaPagamentoSelecionada = document.querySelector(
        'input[name="formaPagamento"]:checked',
      );

      if (formaPagamentoSelecionada) {
        const dadosPedido = {
          id_pedido: novoPedidoRef.key,
          produtos: itens.map((item) => ({
            id: item.id,
            nome: item.nome,
            quantidade: item.quantidade,
          })),
          valor_total: calcularValorTotal(),
          forma_pagamento: formaPagamentoSelecionada.value,
          usuario_id: user.id,
        };

        await set(novoPedidoRef, dadosPedido);
        onEfetuarPagamento();
        onPagamentoConcluido();
        alert("Pedido concluído com sucesso!");
      } else {
        alert("Selecione uma forma de pagamento antes de continuar.");
        return;
      }
    } catch (error) {
      console.error("Erro ao efetuar o pagamento:", error.message);
    } finally {
      if (document.querySelector('input[name="formaPagamento"]:checked')) {
        onClose();
      }
    }
  };

  return (
    <div className="finalizar-compra-modal">
      <div className="modal-content">
        <div className="close-button" onClick={onClose}>
          X
        </div>
        <img src={logo} alt="Logo da loja" className="logo" />
        <h2>Finalizar Compra</h2>

        {/* Seção "Ver Todos os Meus Produtos" com botão de flecha ao lado */}
        <div className="meu-carrinho-section">
          <div className="titulo-meucarrinho">
            <p>
              {mostrarItensCarrinho ? "Ocultar" : "Ver"} Todos os Meus Produtos
            </p>
            <button
              className={`botao-mostrar-itens ${
                mostrarItensCarrinho ? "ativo" : ""
              }`}
              onClick={() => setMostrarItensCarrinho(!mostrarItensCarrinho)}
            >
              <span>{mostrarItensCarrinho ? "▲" : "▼"}</span>
            </button>
          </div>

          {mostrarItensCarrinho && (
            <div className="itens-container">
              <table className="itens-table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {itens.map((item) => (
                    <tr key={item.id} className="item">
                      <td>{item.nome}</td>
                      <td>{item.quantidade}</td>
                      <td>R${(item.preco * item.quantidade).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Seção "Formas de Pagamento" */}
        <div className="formas-pagamento-section">
          <div className="titulo-formas-pagamento">
            <p>{mostrarFormasPagamento ? "Ocultar" : "Formas de Pagamento"}</p>
            <button
              className={`botao-mostrar-formas-pagamento ${
                mostrarFormasPagamento ? "ativo" : ""
              }`}
              onClick={() => setMostrarFormasPagamento(!mostrarFormasPagamento)}
            >
              <span>{mostrarFormasPagamento ? "▲" : "▼"}</span>
            </button>
          </div>

          {mostrarFormasPagamento && (
            <div className="formas-pagamento-options">
              {/* Opção de Boleto */}
              <label>
                <input type="radio" name="formaPagamento" value="boleto" />
                <img
                  src="imagens/boleto.png" 
                  alt="Boleto"
                  className="icone-pagamento"
                />
              </label>
              {/* Opção de PIX */}
              <label>
                <input type="radio" name="formaPagamento" value="pix" />
                <img
                  src="imagens/pixoficial.png"
                  alt="PIX"
                  className="icone-pagamento"
                />
              </label>
            </div>
          )}
        </div>

        <p className="total">Total: R${calcularValorTotal()}</p>

        {/* Botão "Efetuar Pagamento" */}
        <button
          className="efetuar-pagamento-button"
          onClick={handleEfetuarPagamento}
        >
          Efetuar Pagamento
        </button>
      </div>
    </div>
  );
};

export default FinalizarCompraModal;