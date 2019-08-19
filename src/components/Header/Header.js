import React from "react";
import { ProgressBar, Navbar, Button, Icon } from "react-materialize";

const styleProgress = {
   margin: "0",
};

const Header = (props) => (
   <>
      <Navbar brand={<a />} alignLinks="right">
         <Button
            node="a"
            small
            className="blue-grey lighten-5 black-text"
            onClick={(e) => {
               props.listarPedidosHandler();
            }}>
            Pedidos
            <Icon left>list</Icon>
         </Button>

         <Button
            node="a"
            small
            className="blue-grey lighten-5 black-text"
            onClick={(e) => {
               props.adicionarPedidoHandler();
            }}>
            Adicionar
            <Icon left>add</Icon>
         </Button>
      </Navbar>
      {props.showProgress && (
         <ProgressBar l={12} m={12} style={styleProgress} />
      )}
   </>
);

export default Header;
