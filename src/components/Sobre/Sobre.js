import React from "react";
import { Row, Col, Card } from "react-materialize";

const Sobre = () => (
  <Row>
    <Col m={12} s={12}>
      <h5>Sobre</h5>
      <Card>
        <div>
          <p>
            <b>Lorem</b>
          </p>
          <p>
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut laborevoluptate velit esse cillum
            dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
            non proident, sunt in culpa qui officia deserunt mollit anim id est
            laborum."
          </p>
          <br />
          <p>
            <b>Ipsum</b>
          </p>
          <p>
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut laborevoluptate velit esse cillum
            dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
            non proident, sunt in culpa qui officia deserunt mollit anim id est
            laborum."
          </p>
        </div>
      </Card>
    </Col>
  </Row>
);

export default Sobre;
