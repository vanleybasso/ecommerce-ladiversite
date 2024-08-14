import React, { useState } from "react";
import "./Carrinho.css";
import FinalizarCompraModal from "./FinalizarCompraModal";

const Carrinho = ({
  isOpen,
  onClose,
  itens,
  onCompreMais,
  onFinalizarCompra,
  quantidadeNoCarrinho,
  setCarrinhoItens,
}) => {
  const [isFinalizarCompraModalOpen, setIsFinalizarCompraModalOpen] =
    useState(false);

  const handlePagamentoConcluido = () => {
    // Zera a lista de itens no carrinho
    setCarrinhoItens([]);
  };

  const excluirDoCarrinho = (id) => {
    const novosItens = itens.filter((item) => item.id !== id);
    setCarrinhoItens(novosItens);
    console.log(`Excluindo ${id} do carrinho.`);
  };

  const aumentarQuantidadeItem = (id) => {
    const novosItens = itens.map((item) =>
      item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item
    );
    setCarrinhoItens(novosItens);
  };

  const diminuirQuantidadeItem = (id) => {
    const novosItens = itens.map((item) =>
      item.id === id
        ? {
            ...item,
            quantidade: item.quantidade > 0 ? item.quantidade - 1 : 0,
          }
        : item
    );

    // Remover o item se a quantidade for zero
    const itensAtualizados = novosItens.filter((item) => item.quantidade > 0);

    setCarrinhoItens(itensAtualizados);
  };

  const calcularValorTotal = () => {
    return itens
      .reduce((total, item) => total + item.preco * item.quantidade, 0)
      .toFixed(2);
  };

  const handleFinalizarCompra = () => {
    setIsFinalizarCompraModalOpen(true);
    onClose(); // Fechar o carrinho ao clicar em "Finalizar"
  };

  return (
    <div className={`carrinho ${isOpen ? "open" : ""}`}>
      <div className="carrinho-header">
        <div className="carrinho-icon">🛒</div>
        <div className="carrinho-title">CARRINHO ({quantidadeNoCarrinho})</div>
        <div className="carrinho-fechar" onClick={onClose}>
          &#10005;
        </div>
      </div>
      <div className="carrinho-content">
        {itens.length === 0 ? (
          <p
            className={`sem-itens-msg ${
              itens.length === 0 ? "borda-frase" : ""
            }`}
          >
            Nenhum item adicionado ao carrinho
          </p>
        ) : (
          <div className="carrinho-items-container">
            {itens.map((item) => (
              <div
                key={`${item.id}-${item.carrinhoId}`}
                className="carrinho-item"
              >
                <img
                  src={item.imagem}
                  alt={item.nome}
                  className="carrinho-imagem"
                />
                <div className="info-container">
                  <div className="info-text">
                    <p>{item.nome}</p>
                    <p className="preco">
                      Preço unitário: R${item.preco.toFixed(2)}
                    </p>
                    <div className="botoes-quantidade">
                      <button onClick={() => diminuirQuantidadeItem(item.id)}>
                        -
                      </button>
                      <span className="quantidade">{item.quantidade}</span>
                      <button onClick={() => aumentarQuantidadeItem(item.id)}>
                        +
                      </button>
                    </div>
                    <p className="subtotal">
                      Subtotal: R${(item.preco * item.quantidade).toFixed(2)}
                    </p>
                  </div>
                  <div
                    className="excluir-container"
                    onClick={() => excluirDoCarrinho(item.id)}
                  >
                    <span className="remover-texto">Remover</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {itens.length > 0 && (
          <div>
            <div className="valor-total">
              <p className="destacado">Total: R${calcularValorTotal()}</p>
            </div>
            <div className="botoes-container">
              <button className="botao-compre-mais" onClick={onCompreMais}>
                Compre Mais
              </button>
              <button
                className="botao-finalizar"
                onClick={handleFinalizarCompra}
              >
                Finalizar
              </button>
            </div>
          </div>
        )}
      </div>

      {isFinalizarCompraModalOpen && (
        <FinalizarCompraModal
          itens={itens}
          logo="imagens/simbolo.png"
          onClose={() => setIsFinalizarCompraModalOpen(false)}
          onEfetuarPagamento={() => {
            console.log("Pagamento efetuado com sucesso!");
            setIsFinalizarCompraModalOpen(false);
          }}
          onPagamentoConcluido={handlePagamentoConcluido} // Adiciona a função para zerar o carrinho
        />
      )}
    </div>
  );
};

export default Carrinho;
