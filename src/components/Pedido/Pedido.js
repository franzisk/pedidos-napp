import React from "react";
import { Card, Button, Icon, Table, CardPanel, Chip } from "react-materialize";

import M from "materialize-css";
import "./Pedido.css";

const Aviso = (props) => {
   let elementoAviso =
      props.aviso === null ? (
         <div />
      ) : (
         <div style={{ color: "red", textAlign: "center" }}>{props.aviso}</div>
      );
   return elementoAviso;
};

class Pedido extends React.Component {
   componentDidMount() {
      // Auto initialize all the things!
      M.AutoInit();
   }

   textoRentabilidade = (x) => {
      if (x === 0) {
         return <Chip className="red white-text">Ruim</Chip>;
      }
      if (x === 1) {
         return <Chip className="orange white-text">Boa</Chip>;
      }
      if (x === 2) {
         return <Chip className="green white-text">Ótima</Chip>;
      }
   };

   render() {
      const {
         selecionarClienteHandler,
         selecionarProdutoHandler,
         salvarPedidoHandler,
         adicionarItemAoPedidoHandler,
         quantidadeHandler,
         precoUnitarioHandler,
         deletarItemPedidoHandler,
         formatarValor,
         pedido,
         clientes,
         produtos,
         aviso,
         showProgress,
      } = this.props;

      return (
         <div>
            <Card>
               <CardPanel className="grey lighten-2" style={{ padding: 10 }}>
                  <Button
                     waves="light"
                     disabled={aviso !== null || showProgress}
                     className="grey darken-3 right white-text"
                     onClick={(e) => {
                        salvarPedidoHandler(e);
                     }}
                     tooltip="Salvar pedido"
                     small>
                     <Icon left>done</Icon>Salvar
                  </Button>

                  <Button
                     disabled={showProgress}
                     waves="orange"
                     style={{ marginRight: 10 }}
                     className="grey darken-3 right white-text"
                     onClick={(e) => {
                        adicionarItemAoPedidoHandler(e);
                     }}
                     tooltip="Adicionar Item"
                     small>
                     <Icon left>add</Icon>Item
                  </Button>
                  <span style={{ clear: "both", display: "block" }} />
               </CardPanel>

               <div className="input-field col s12">
                  <Aviso aviso={this.props.aviso} />
                  <div style={{ fontWeight: "bold", marginBottom: 5 }}>
                     Cliente
                  </div>
                  <select
                     disabled={showProgress}
                     className="browser-default"
                     value={pedido.cliente.id}
                     onChange={(e) => {
                        selecionarClienteHandler(e.target.value);
                     }}>
                     <option defaultValue="0" disabled>
                        Selecione um cliente
                     </option>
                     {clientes.map((item, index) => {
                        return (
                           <option
                              key={index}
                              value={item.id}
                              defaultValue={pedido.cliente.id}>
                              {item.nome}
                           </option>
                        );
                     })}
                  </select>
               </div>

               <Table responsive className="magrinha">
                  <thead>
                     <tr>
                        <th className="left-align">Produto</th>
                        <th className="right-align">Valor Produto</th>
                        <th style={{ width: 90 }} className="right-align">
                           Quantidade
                        </th>
                        <th style={{ width: 110 }} className="right-align">
                           Valor Venda
                        </th>
                        <th className="right-align">Valor Total</th>
                        <th className="center-align">Rentabilidade</th>
                        <th className="center-align" />
                     </tr>
                  </thead>
                  <tbody>
                     {pedido.itens.map((item, indexItemPedido) => {
                        return (
                           <tr key={indexItemPedido}>
                              <td className="left-align">
                                 <select
                                    className="browser-default"
                                    value={item.produto.id}
                                    onChange={(e) => {
                                       selecionarProdutoHandler(
                                          indexItemPedido,
                                          e.target.value
                                       );
                                    }}>
                                    <option defaultValue="0" disabled>
                                       Selecione um produto
                                    </option>
                                    {produtos.map((produto, index) => {
                                       return (
                                          <option
                                             key={index}
                                             value={produto.id}
                                             defaultValue={item.produto.id}>
                                             {produto.nome}
                                          </option>
                                       );
                                    })}
                                 </select>
                              </td>
                              <td className="right-align">
                                 {formatarValor(item.produto.precoUnitario)}
                              </td>
                              <td className="right-align">
                                 <input
                                    style={{ textAlign: "right" }}
                                    defaultValue={item.quantidade}
                                    onChange={(e) => {
                                       quantidadeHandler(
                                          indexItemPedido,
                                          e.target.value
                                       );
                                    }}
                                    type="number"
                                    min="1"
                                    lang="pt-BR"
                                 />
                              </td>
                              <td className="right-align">
                                 <input
                                    step=".01"
                                    lang="pt-BR"
                                    style={{ textAlign: "right" }}
                                    defaultValue={item.precoUnitario}
                                    onChange={(e) => {
                                       precoUnitarioHandler(
                                          indexItemPedido,
                                          e.target.value
                                       );
                                    }}
                                    type="number"
                                    min="1"
                                 />
                              </td>
                              <td className="right-align">
                                 {formatarValor(item.valorTotal)}
                              </td>
                              <td className="center-align">
                                 {this.textoRentabilidade(item.rentabilidade)}
                              </td>
                              <td className="center-align">
                                 <Button
                                    small
                                    waves="light"
                                    className="red"
                                    onClick={(e) => {
                                       deletarItemPedidoHandler(
                                          indexItemPedido
                                       );
                                    }}
                                    tooltip={`Excluir o produto ${
                                       item.produto.nome
                                    }`}>
                                    <Icon>delete</Icon>
                                 </Button>
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </Table>
            </Card>
         </div>
      );
   }
}

export default Pedido;
