import React from "react";
import { Container } from "react-materialize";
import { Switch, Route } from "react-router-dom";

import Sobre from "./components/Sobre/Sobre";
import Home from "./components/Home/Home";
import Pedido from "./components/Pedido/Pedido";

const Main = () => (
  <main>
    <Container>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/sobre" component={Sobre} />
        <Route path="/pedido" component={Pedido} />
        <Route path="/pedido/:id" component={Pedido} />
      </Switch>
    </Container>
  </main>
);

export default Main;
