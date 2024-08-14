import React, { useState, useEffect } from "react";
import { app, db } from "./config";
import { ref, push, set } from "firebase/database";
import { onValue } from "firebase/database";

import "./styles.css";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import Carrinho from "./Carrinho";
import DetalhesProdutoModal from "./DetalhesProdutoModal";

function App() {
  const [bebidas, setBebidas] = useState([]);
  const [quantidades, setQuantidades] = useState({});
  const [mostrarModal, setMostrarModal] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [carrinhoItens, setCarrinhoItens] = useState([]);
  const [quantidadeNoCarrinho, setQuantidadeNoCarrinho] = useState(0);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [numColunas, setNumColunas] = useState(2); // Define o número inicial de colunas

  useEffect(() => {
    const bebidasRef = ref(db, "bebidas");
    onValue(bebidasRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const bebidasList = Object.values(data);
        setBebidas(bebidasList);

        // Calcula o número de colunas com base na quantidade de bebidas
        const numColunasCalculadas = Math.ceil(bebidasList.length / 5);
        setNumColunas(numColunasCalculadas);

        const initialQuantidades = {};
        bebidasList.forEach((bebida) => {
          initialQuantidades[bebida.id] = 0;
        });
        setQuantidades(initialQuantidades);
      }
    });
  }, []);

  const handleProdutoClick = (produto, event) => {
    // Verifica se o clique foi na imagem do produto
    if (event.target.tagName.toLowerCase() === "img") {
      setProdutoSelecionado(produto);
    }
  };

  const [clienteInfo, setClienteInfo] = useState({
    nome: "",
    email: "",
  });

  const handleNomeChange = (event) => {
    setClienteInfo({ ...clienteInfo, nome: event.target.value });
  };

  const handleEmailChange = (event) => {
    setClienteInfo({ ...clienteInfo, email: event.target.value });
  };

  const cadastrarCliente = async (event) => {
    event.preventDefault();

    // Validar se o nome e o e-mail estão preenchidos
    if (!clienteInfo.nome || !clienteInfo.email) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    // Adicionar cliente ao banco de dados
    const clientesRef = ref(db, "clientes ofertas");
    const novoClienteRef = push(clientesRef);

    try {
      await set(novoClienteRef, {
        id: novoClienteRef.key,
        nome: clienteInfo.nome,
        email: clienteInfo.email,
      });

      // Limpar campos após o cadastro
      setClienteInfo({ nome: "", email: "" });

      alert("Cadastro realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      alert("Erro ao cadastrar cliente. Por favor, tente novamente.");
    }
  };

  const fecharCarrinho = () => {
    setCarrinhoAberto(false);
  };

  const fecharModal = () => {
    setMostrarModal(false);
    setShowOverlay(false);
  };

  const openRegisterForm = () => {
    setShowRegisterForm(true);
  };

  const openLoginForm = () => {
    setShowLoginForm(true);
  };

  const toggleCarrinho = () => {
    setShowLoginOptions(false);
    setShowRegisterForm(false);
    setShowLoginForm(false);

    setCarrinhoAberto(!carrinhoAberto);
  };

  const handleLoginSuccess = () => {
    setUsuarioLogado(true);
  };

  const handleLogout = () => {
    setUsuarioLogado(false);
  };

  useEffect(() => {
    setQuantidadeNoCarrinho(carrinhoItens.length);
  }, [carrinhoItens]);

  useEffect(() => {
    const bebidasRef = ref(db, "bebidas");
    onValue(bebidasRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const bebidasList = Object.values(data);
        setBebidas(bebidasList);

        const initialQuantidades = {};
        bebidasList.forEach((bebida) => {
          initialQuantidades[bebida.id] = 0;
        });
        setQuantidades(initialQuantidades);
      }
    });
  }, []);

  const aumentarQuantidade = (id) => {
    setQuantidades((prevQuantidades) => ({
      ...prevQuantidades,
      [id]: prevQuantidades[id] + 1,
    }));
  };

  const diminuirQuantidade = (id) => {
    if (quantidades[id] > 0) {
      setQuantidades((prevQuantidades) => ({
        ...prevQuantidades,
        [id]: prevQuantidades[id] - 1,
      }));
    }
  };

  const adicionarAoCarrinho = (bebida) => {
    const quantidadeSelecionada = quantidades[bebida.id];

    if (quantidadeSelecionada > 0) {
      const itemExistente = carrinhoItens.find((item) => item.id === bebida.id);

      if (itemExistente) {
        const novosItens = carrinhoItens.map((item) =>
          item.id === bebida.id
            ? { ...item, quantidade: item.quantidade + quantidadeSelecionada }
            : item
        );

        setCarrinhoItens(novosItens);
        console.log(`Aumentando a quantidade de ${bebida.nome} no carrinho.`);
      } else {
        const novoItem = {
          id: bebida.id,
          imagem: bebida.imagem,
          nome: bebida.nome,
          preco: bebida.preco,
          quantidade: quantidadeSelecionada,
        };

        setCarrinhoItens((prevItens) => [...prevItens, novoItem]);
        console.log(
          `Adicionando ${bebida.nome} ao carrinho com ${quantidadeSelecionada} unidades.`
        );

        alert("Produto adicionado ao carrinho!");
      }

      setQuantidades((prevQuantidades) => ({
        ...prevQuantidades,
        [bebida.id]: 0,
      }));
    } else {
      alert("Selecione uma quantidade válida.");
      console.log(
        `A quantidade selecionada para ${bebida.nome} é 0. Não será adicionado ao carrinho.`
      );
    }
  };

  return (
    <div className="App">
      {showOverlay && (
        <div className="overlay">
          <div className="modal">
            <div className="message-container">
              <img
                src="imagens/simbolo.png"
                alt="Descrição da Imagem"
                style={{ width: "100px" }}
              />
              <h2>Bem-vindo</h2>
              <p>Sua idade é superior a 18 anos?</p>
              <button onClick={fecharModal} className="btn-sim">
                Sim
              </button>
              <button
                onClick={() =>
                  (window.location =
                    "https://www.youtube.com/watch?v=RE6BG1XiHQY")
                }
                className="btn-nao"
              >
                Não
              </button>
              <p>Conteúdo para maiores de 18 anos.</p>
              <p>
                A venda de bebidas alcoólicas é proibida para menores de 18
                anos.
              </p>
            </div>
          </div>
        </div>
      )}

      {showRegisterForm && (
        <RegisterForm onClose={() => setShowRegisterForm(false)} />
      )}

      {showLoginForm && (
        <LoginForm
          onClose={() => setShowLoginForm(false)}
          onLoginSuccess={handleLoginSuccess} // Adicione essa prop
        />
      )}

      <header>
        <div className="logo">
          <img src="imagens/simbolo.png" alt="Descrição da Imagem" />
        </div>
        <div className="logo2">
          <img
            src="imagens/simboloescrito.png"
            alt="Logo2"
            className="logo2-img"
          />
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Buscar produto..." />
        </div>

        <div className="user-account">
          {usuarioLogado ? (
            <button onClick={() => setUsuarioLogado(false)}>Logout</button>
          ) : (
            <div onClick={() => setShowLoginOptions(!showLoginOptions)}>
              <img src="imagens/usuario.png" alt="Minha Conta" />
              {showLoginOptions && (
                <div className="login-options">
                  <p onClick={openLoginForm}>Login</p>
                  <p onClick={openRegisterForm}>Cadastre-se</p>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="cart" onClick={toggleCarrinho}>
          <img src="imagens/cart.png" alt="Carrinho" />
        </div>
      </header>
      <section className="categories categories-section">
        <div className="category">
          <img src="imagens/uisque.png" alt="Categoria 1" />
          <p>WHISKEYS</p>
        </div>
        <div className="category">
          <img src="imagens/espanha.png" alt="Categoria 2" />
          <p>LICORES</p>
        </div>
        <div className="category">
          <img src="imagens/GINS.png" alt="Categoria 3" />
          <p>GINS</p>
        </div>
        <div className="category">
          <img src="imagens/tiquila.png" alt="Categoria 4" />
          <p>TEQUILAS</p>
        </div>
        <div className="category">
          <img src="imagens/vodca.png" alt="Categoria 5" />
          <p>VODKAS</p>
        </div>
        <div className="category">
          <img src="imagens/ESPUMANTES.png" alt="Categoria 6" />
          <p>ESPUMANTES</p>
        </div>
      </section>

      <section className="banner">
        <img src="imagens/slogan.png" alt="Banner" />
      </section>

      <section className="products">
        {Array.from({ length: numColunas }, (_, index) => (
          <div key={index} className="product-row">
            {bebidas.slice(index * 5, (index + 1) * 5).map((bebida, idx) => (
              <div
                key={idx}
                className="bebida"
                onClick={(event) => handleProdutoClick(bebida, event)}
              >
                <img src={bebida.imagem} alt={bebida.nome} />
                <p>{bebida.nome}</p>
                <p>Preço: R${bebida.preco.toFixed(2)}</p>
                <div className="quantidade-controles">
                  <button onClick={() => diminuirQuantidade(bebida.id)}>
                    -
                  </button>
                  <span>{quantidades[bebida.id]}</span>
                  <button onClick={() => aumentarQuantidade(bebida.id)}>
                    +
                  </button>
                </div>
                <button
                  onClick={() => adicionarAoCarrinho(bebida)}
                  className="addToCart"
                >
                  Adicionar ao Carrinho
                </button>
              </div>
            ))}
          </div>
        ))}
      </section>
      {produtoSelecionado && (
        <DetalhesProdutoModal
          produto={produtoSelecionado}
          onClose={() => setProdutoSelecionado(null)}
        />
      )}
      <section className="newsletter-section">
        <div className="newsletter-logo-container">
          <img src="imagens/simbolo.png" alt="Descrição da Imagem" />

          <div className="newsletter-content">
            <div className="left-content">
              <h2>RECEBA OFERTAS DAS MELHORES BEBIDAS</h2>
              <p>
                Informe seu nome e e-mail para garantir ofertas e conteúdos
                exclusivos:
              </p>
            </div>
            <div className="right-content">
              <form className="newsletter-form" onSubmit={cadastrarCliente}>
                <div className="input-container">
                  <input
                    type="text"
                    placeholder="Nome"
                    value={clienteInfo.nome}
                    onChange={handleNomeChange}
                  />
                </div>
                <div className="input-container">
                  <input
                    type="email"
                    placeholder="E-mail"
                    value={clienteInfo.email}
                    onChange={handleEmailChange}
                  />
                </div>
                <button type="submit">Cadastrar</button>
              </form>
            </div>
          </div>
        </div>
      </section>
      {showRegisterForm && (
        <RegisterForm onClose={() => setShowRegisterForm(false)} />
      )}

      <footer>
        <div className="footer-column">
          <div className="footer-section">
            <h3>Atendimento</h3>
            <p>faleconosco@ladiversite.com.br</p>
            <p>De segunda a sexta-feira das 8h00 às 17h30</p>
            <p>sábado das 08h00 às 12h00</p>
          </div>
          <div className="footer-section">
            <h3>Rede Sociais</h3>
            <img
              src="imagens/insta.png"
              alt="Instagram"
              onClick={() =>
                (window.location = "https://instagram.com/ladiversite.gv")
              }
            />
            <img src="imagens/facebook.png" alt="Facebook" />
            <img
              src="imagens/zap.png"
              alt="WhatsApp"
              onClick={() =>
                (window.location = "https://wa.me/message/NMSNZZE3KR7JK1")
              }
            />
          </div>
        </div>
        <div className="footer-column">
          <div className="footer-section">
            <h3>Pagamento</h3>
            <img
              src="https://img.freepik.com/free-icon/visa_318-202971.jpg"
              alt="Visa"
            />
            <img
              src="https://i.pinimg.com/originals/28/99/08/289908a6bb2d5f2ab846f0606e72e0fe.png"
              alt="MasterCard"
            />
            <img
              src="https://cdn4.iconfinder.com/data/icons/circle-payment/121/american_express-512.png"
              alt="American Express"
            />
            <img
              src="https://99prod.s3.amazonaws.com/uploads/image/file/686355/f4df08f505a58b45a13913522c79add5.png"
              alt="Discover"
            />
          </div>
          <div className="footer-section">
            <h3>Selos de Segurança</h3>
            <img
              src="https://d2r9epyceweg5n.cloudfront.net/stores/872/833/rte/seal2.jpg"
              alt="Selo 1"
            />
            <img
              src="https://gifs.eco.br/wp-content/uploads/2023/06/imagens-de-selo-de-seguranca-png-32.png"
              alt="Selo 2"
            />
            <img
              src="https://hom.soluti.com.br/media/catalog/product/cache/1d35928d56b03c54706187ef5e00af21/s/s/ssl_internacional.png"
              alt="Selo 3"
            />
            <img
              src="https://gifs.eco.br/wp-content/uploads/2023/03/imagens-de-selo-de-garantia-png-9.png"
              alt="Selo 4"
            />
          </div>
        </div>
        <div className="footer-column">
          <div className="footer-section">
            <h3>Sobre a La Diversité</h3>
            <p>
              Somos a maior loja virtual de bebidas destiladas do Brasil com
              distribuição em todo território nacional. Com o propósito de
              transformar a vida das pessoas em momentos de celebração,
              iniciamos as atividades em 2008 como pioneiros do e-commerce de
              bebidas premium no Brasil.
            </p>
            <p>
              Uma loja onde você encontra a maior variedade de bebidas como
              whisky, vodka, gin, tequila, licor, rum, vinho, espumante,
              champagne, aperitivos, cachaças e muito mais!
            </p>
            <p>A sua celebração merece La Diversité.</p>
          </div>
        </div>
      </footer>
      <Carrinho
        isOpen={carrinhoAberto}
        onClose={() => setCarrinhoAberto(false)}
        itens={carrinhoItens}
      />

      <Carrinho
        isOpen={carrinhoAberto}
        onClose={() => setCarrinhoAberto(false)}
        itens={carrinhoItens}
        quantidadeNoCarrinho={quantidadeNoCarrinho}
      />

      <Carrinho
        isOpen={carrinhoAberto}
        onClose={() => setCarrinhoAberto(false)}
        itens={carrinhoItens}
        quantidadeNoCarrinho={carrinhoItens.length}
        setCarrinhoItens={setCarrinhoItens}
        quantidadeNoCarrinho={quantidadeNoCarrinho}
        onCompreMais={() => {
          fecharCarrinho();
        }}
      />
    </div>
  );
}

export default App;
