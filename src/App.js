import React from "react";
import Pedido from "./components/Pedido/Pedido";
import Home from "./components/Home/Home";
import Header from "./components/Header/Header";
import axios from "axios";
import "materialize-css/dist/css/materialize.min.css";

const API_ROOT = "https://intense-brook-31336.herokuapp.com/";
const REQUEST_HEADERS = {
   headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-cache",
      "If-Modified-Since": "Mon, 26 Jul 1997 05:00:00 GMT",
      Accept: "application/json",
   },
};

class App extends React.Component {
   _isMounted = false;

   constructor(props) {
      super(props);

      this.state = {
         showEdit: false,
         clientes: [],
         produtos: [],
         pedidos: [],
         pedido: { nome: "", id: null, cliente: { nome: "" } },
         aviso: null,
         showProgress: false,
      };
   }

   editarPedidoHandler = (item) => {
      this.setState({ aviso: null });
      this.setState({ pedido: item });
      this.setState({ showEdit: true });
   };

   listarPedidosHandler = () => {
      this.setState({ showEdit: false });
      this.carregarPedidosCadastrados();
   };

   adicionarPedidoHandler = () => {
      let pedido = {
         id: null,
         cliente: this.state.clientes[0],
         itens: [],
         valorTotal: 0.0,
      };
      this.setState({ pedido: pedido });
      this.setState({ showEdit: true });
   };

   selecionarClienteHandler = (idCliente) => {
      let cliente = this.state.clientes.filter(
         (obj) => parseInt(obj.id, 10) === parseInt(idCliente, 10)
      )[0];
      let _pedido = this.state.pedido;
      _pedido.cliente = cliente;
      this.setState({ pedido: _pedido });
   };

   selecionarProdutoHandler = (indexItemPedido, idProduto) => {
      this.setState({ aviso: null });
      let produto = this.state.produtos.filter(
         (obj) => parseInt(obj.id, 10) === parseInt(idProduto, 10)
      )[0];

      let itemPedido = this.state.pedido.itens[indexItemPedido];
      itemPedido.produto = produto;
      itemPedido.precoUnitario = produto.precoUnitario;

      itemPedido.valorTotal = parseFloat(
         (itemPedido.precoUnitario * itemPedido.quantidade).toFixed(2)
      );

      let pedido = this.state.pedido;
      pedido.itens[indexItemPedido] = itemPedido;

      this.setState({ pedido: pedido });

      if (this.isProdutoDuplicado(pedido)) {
         this.setState({ aviso: "Pedido com produto duplicado." });
      }
   };

   isProdutoDuplicado(pedido) {
      let totalDuplicados = 0;
      let temp = [];
      pedido.itens.forEach((item, index) => {
         let produto = temp.filter(
            (obj) =>
               parseInt(obj.produto.id, 10) === parseInt(item.produto.id, 10)
         )[0];

         if (produto === undefined) {
            temp.push(item);
         } else {
            totalDuplicados++;
         }
      });
      temp = [];
      return totalDuplicados > 0;
   }

   formatarValor = (number) => {
      let postComma;
      let preComma;
      let stringReverse;
      let _ref;
      stringReverse = (str) => {
         return str
            .split("")
            .reverse()
            .join("");
      };

      _ref = parseFloat(number)
         .toFixed(2)
         .split(".");
      preComma = _ref[0];
      postComma = _ref[1];

      preComma = stringReverse(
         stringReverse(preComma)
            .match(/.{1,3}/g)
            .join(".")
      );

      return "" + preComma + "," + postComma;
   };

   quantidadeHandler = (indexItemPedido, quantidade) => {
      this.setState({ aviso: null });
      let pedido = this.state.pedido;
      let itemPedido = pedido.itens[indexItemPedido];
      let multiplo = itemPedido.produto.multiplo;

      quantidade = isNaN(quantidade) || quantidade === "" ? 1 : quantidade;
      quantidade = parseInt(quantidade === 0 ? 1 : quantidade);

      if (multiplo > 0) {
         const resto = quantidade % multiplo;
         if (resto > 0.0) {
            this.setState({
               aviso: `Esse produto só pode ser vendido em quantidades múltiplas de 
                  ${multiplo}`,
            });

            return;
         }
      }
      itemPedido.quantidade = quantidade;

      const total = parseFloat(
         (itemPedido.precoUnitario * quantidade).toFixed(2)
      );

      itemPedido.valorTotal = total;

      // Acertar a rentabilidade para o produto do pedido
      itemPedido.rentabilidade = this.calcularRentabilidade(
         itemPedido.produto.precoUnitario,
         itemPedido.precoUnitario
      );

      pedido.itens[indexItemPedido] = itemPedido;

      // Acertar o valor total de todos os produtos no pedido
      pedido = this.calcaularValorTotalPedido(pedido);

      this.setState({ pedido: pedido });
   };

   precoUnitarioHandler = (indexItemPedido, valor) => {
      let pedido = this.state.pedido;
      let itemPedido = pedido.itens[indexItemPedido];

      valor = isNaN(valor) || valor === "" ? 1.0 : valor;
      valor = valor === 0.0 ? 1.0 : valor;
      this.setState({ aviso: null });

      itemPedido.precoUnitario = valor;
      itemPedido.valorTotal = parseFloat(
         (valor * itemPedido.quantidade).toFixed(2)
      );

      // Acertar a rentabilidade para o produto do pedido
      itemPedido.rentabilidade = this.calcularRentabilidade(
         itemPedido.produto.precoUnitario,
         itemPedido.precoUnitario
      );

      this.calcaularValorTotalPedido(this.state.pedido);

      pedido.itens[indexItemPedido] = itemPedido;

      // Acertar o valor total de todos os produtos no pedido
      pedido = this.calcaularValorTotalPedido(pedido);

      this.setState({ pedido: pedido });
   };

   calcaularValorTotalPedido = (pedido) => {
      let total = 0.0;
      pedido.itens.forEach((item, index) => {
         total += parseFloat(item.valorTotal);
      });
      pedido.valorTotal = parseFloat(total.toFixed(2));
      return pedido;
   };

   calcularRentabilidade = (precoProduto, precoVenda) => {
      let x = 0;
      if (precoVenda > precoProduto) {
         x = 2;
      } else {
         let valorMenos10Porcento = precoProduto - precoProduto * 0.1;
         if (precoVenda >= valorMenos10Porcento && precoVenda <= precoProduto) {
            x = 1;
         } else {
            x = 0;
         }
      }
      return x;
   };

   deletarItemPedidoHandler = (indexItemPedido) => {
      let pedido = this.state.pedido;
      let itensPedido = pedido.itens;
      this.setState({ aviso: null });

      const itemDeletar = itensPedido[indexItemPedido];

      itensPedido.splice(indexItemPedido, 1);

      pedido.itens = itensPedido;

      this.setState({ pedido: pedido });

      if (itemDeletar.id === null) {
         return;
      }

      axios
         .delete(
            `${API_ROOT}pedido/deletar-item/${itemDeletar.id}`,
            REQUEST_HEADERS
         )
         .then(
            (response) => {
               if (response.status === 200) {
                  this.setState({ pedido: pedido });
               }
            },
            (error) => {
               console.error("PRIMEIRO ERRO", error);
            }
         )
         .catch((error) => {
            console.error("ERRO GERAL", error.response);
         });
   };

   adicionarItemAoPedidoHandler = () => {
      this.setState({ aviso: null });
      let item = {
         id: null,
         precoUnitario: this.state.produtos[0].precoUnitario,
         quantidade: 1,
         rentabilidade: "",
         valorTotal: this.state.produtos[0].precoUnitario * 1,
         produto: this.state.produtos[0],
      };

      let pedido = this.state.pedido;
      pedido.itens.push(item);
      this.setState({ pedido: pedido });
   };

   verificarRentabilidadeRuim = (pedido) => {
      const ruins = pedido.itens.filter(
         (item, index) => item.rentabilidade === 0
      );
      return ruins.length > 0;
   };

   salvarPedidoHandler = (event) => {
      this.setState({ aviso: null });
      const { pedido } = this.state;
      if (pedido.itens.length < 1) {
         this.setState({
            aviso: "É necessário adicionar pelo menos um produto ao pedido",
         });
         return;
      }

      if (this.isProdutoDuplicado(pedido)) {
         this.setState({
            aviso:
               "Pedido com produto duplicado. Remover o produto duplicado ou trocar o produto.",
         });
         return;
      }

      if (this.verificarRentabilidadeRuim(pedido)) {
         this.setState({
            aviso: "Item no pedido com rentabilidade ruim não é permitido.",
         });
         return;
      }

      this.setState({ showProgress: true });
      axios
         .post(`${API_ROOT}pedido/salvar`, this.state.pedido, REQUEST_HEADERS)
         .then((response) => {
            this.setState({ pedido: response.data });
            this.setState({ showEdit: false });
            this.carregarPedidosCadastrados();
         })
         .catch((error) => {
            this.setState({ showProgress: false });
            console.error(error);
         });
   };

   carregarPedidosCadastrados = () => {
      this.setState({ showProgress: true });
      axios
         .get(`${API_ROOT}pedido/listar`, REQUEST_HEADERS)
         .then((response) => {
            this.setState({ showProgress: false });
            if (response.status === 200) {
               const pedidos = response.data;
               this.setState({ pedidos: pedidos });
            }
         })
         .catch((error) => {
            this.setState({ showProgress: false });
            console.error("ERRO GERAL", error.response);
         });
   };

   carregarClientesCadastrados = () => {
      axios
         .get(`${API_ROOT}cliente/listar`, REQUEST_HEADERS)
         .then(
            (response) => {
               if (response.status === 200) {
                  this.setState({ clientes: response.data }, () => {});
               }
            },
            (error) => {
               console.error("PRIMEIRO ERRO", error);
            }
         )
         .catch((error) => {
            console.error("ERRO GERAL", error.response);
         });
   };

   carregarProdutosCadastrados = () => {
      axios
         .get(`${API_ROOT}produto/listar`, REQUEST_HEADERS)
         .then(
            (response) => {
               if (response.status === 200) {
                  this.setState({ produtos: response.data }, () => {});
               }
            },
            (error) => {
               console.error("PRIMEIRO ERRO", error);
            }
         )
         .catch((error) => {
            console.error("ERRO GERAL", error.response);
         });
   };

   componentDidMount() {
      this._isMounted = true;

      this.carregarPedidosCadastrados();
      this.carregarClientesCadastrados();
      this.carregarProdutosCadastrados();
   }

   componentWillUnmount() {
      this._isMounted = false;
      this.setState({ showModalConfirmaDelete: false });
   }

   acaoDeletar = (deletar) => {
      if (deletar) {
         //this.setState({ showModalConfirmaDelete: false });
      } else {
         //this.setState({ showModalConfirmaDelete: false });
      }
      this.setState({ showModalConfirmaDelete: false });
   };

   excluirPedidoHandler = (item) => {
      this.setState({ pedido: item, showModalConfirmaDelete: true });
   };

   render() {
      let displayContent;

      if (this.state.showEdit) {
         displayContent = (
            <div>
               <Header
                  listarPedidosHandler={this.listarPedidosHandler}
                  showProgress={this.state.showProgress}
                  adicionarPedidoHandler={this.adicionarPedidoHandler}
               />
               <Pedido
                  selecionarClienteHandler={this.selecionarClienteHandler}
                  selecionarProdutoHandler={this.selecionarProdutoHandler}
                  quantidadeHandler={this.quantidadeHandler}
                  precoUnitarioHandler={this.precoUnitarioHandler}
                  deletarItemPedidoHandler={this.deletarItemPedidoHandler}
                  salvarPedidoHandler={this.salvarPedidoHandler}
                  adicionarItemAoPedidoHandler={
                     this.adicionarItemAoPedidoHandler
                  }
                  formatarValor={this.formatarValor}
                  pedido={this.state.pedido}
                  clientes={this.state.clientes}
                  produtos={this.state.produtos}
                  aviso={this.state.aviso}
                  showProgress={this.showProgress}
               />
            </div>
         );
      } else {
         displayContent = (
            <div>
               <Header
                  showProgress={this.state.showProgress}
                  listarPedidosHandler={this.listarPedidosHandler}
                  adicionarPedidoHandler={this.adicionarPedidoHandler}
               />
               <Home
                  pedidos={this.state.pedidos}
                  showProgress={this.showProgress}
                  editarPedidoHandler={this.editarPedidoHandler}
                  excluirPedidoHandler={this.excluirPedidoHandler}
               />
            </div>
         );
      }
      return <div className="container">{displayContent}</div>;
   }
}

export default App;
