import React from "react";
import { ProgressBar, Navbar, Button, Icon } from "react-materialize";
import logo from "../../logo.svg";

const styleProgress = {
   margin: "0",
};

class Header extends React.Component {
   constructor(props) {
      super(props);
   }

   render() {
      const {
         listarPedidosHandler,
         adicionarPedidoHandler,
         showProgress,
      } = this.props;
      let Img = <img src={logo} style={{ maxWidth: 80, maxHeight: 80 }} />;
      return (
         <>
            <Navbar brand={Img} alignLinks="right">
               <Button
                  node="a"
                  small
                  className="blue-grey lighten-5 black-text"
                  onClick={(e) => {
                     listarPedidosHandler();
                  }}>
                  Pedidos
                  <Icon left>list</Icon>
               </Button>

               <Button
                  node="a"
                  small
                  className="blue-grey lighten-5 black-text"
                  onClick={(e) => {
                     adicionarPedidoHandler();
                  }}>
                  Adicionar
                  <Icon left>add</Icon>
               </Button>
            </Navbar>
            {showProgress && (
               <ProgressBar l={12} m={12} style={styleProgress} />
            )}
         </>
      );
   }
}

export default Header;
