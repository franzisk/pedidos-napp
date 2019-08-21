import React from "react";
import { Row, Col, Card, Button, Icon, Table } from "react-materialize";

import Modal from "../Modal";

class Home extends React.Component {
   _isMounted = false;

   constructor(props) {
      super(props);
      this.state = {
         showDeleteModal: false,
         pedido: null,
         conteudoModal: "",
      };
   }

   componentDidMount() {
      this._isMounted = true;
   }

   componentWillUnmount() {
      this._isMounted = false;
   }

   itensPedidos = () => {
      const elements = [];
      const { pedidos, editarPedidoHandler } = this.props;

      if (pedidos !== undefined) {
         for (const [index, item] of pedidos.entries()) {
            elements.push(
               <tr key={index + 1}>
                  <td>{item.id}</td>
                  <td>{item.cliente.nome}</td>
                  <td>{item.itens.length}</td>
                  <td style={{ textAlign: "right" }}>R$ {item.valorTotal}</td>
                  <td style={{ textAlign: "right" }}>
                     <Button
                        waves="light"
                        data-target="modal1"
                        onClick={() => {
                           this.setState({ pedido: item });
                           this.setState({
                              conteudoModal:
                                 "Tem certeza que deseja excluir o pedido " +
                                 item.id +
                                 " do cliente " +
                                 item.cliente.nome +
                                 "?",
                           });
                        }}
                        tooltip="Excluir pedido"
                        className="waves-effect waves-light btn modal-trigger red  "
                        small>
                        <Icon>delete</Icon>
                     </Button>

                     <Button
                        style={{ marginLeft: "5px" }}
                        waves="light"
                        onClick={() => {
                           editarPedidoHandler(item);
                        }}
                        tooltip="Editar pedido"
                        className="green"
                        small>
                        <Icon>edit</Icon>
                     </Button>
                  </td>
               </tr>
            );
         }
      }
      return elements;
   };

   listaPedidos = () => {
      return (
         <Row>
            <Col m={12} s={12}>
               <Card textClassName="dark-text" title="Pedidos">
                  <Table responsive>
                     <thead>
                        <tr>
                           <th>Número</th>
                           <th>Cliente</th>
                           <th>Total Itens</th>
                           <th style={{ textAlign: "right" }}>Valor Total</th>
                           <th style={{ textAlign: "right" }} />
                        </tr>
                     </thead>
                     <tbody>{this.itensPedidos()}</tbody>
                  </Table>
               </Card>
            </Col>
         </Row>
      );
   };
   render() {
      const { showProgress, pedido, excluirPedidoHandler } = this.props;

      return (
         <div itemID="box-containner">
            <Modal
               titulo={
                  this.state.pedido === null
                     ? ""
                     : "Pedido No." + this.state.pedido.id
               }
               conteudo={this.state.conteudoModal}
               botaoConfirmarHandler={() => excluirPedidoHandler(pedido)}
            />
            {!showProgress ? this.listaPedidos() : null}
         </div>
      );
   }
}

export default Home;
