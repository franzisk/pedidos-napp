import React, { Component } from "react";
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";

class Modal extends Component {
   componentDidMount() {
      const options = {
         onOpenStart: () => {},
         onOpenEnd: () => {},
         onCloseStart: () => {},
         onCloseEnd: () => {},
         inDuration: 250,
         outDuration: 250,
         opacity: 0.5,
         dismissible: false,
         startingTop: "4%",
         endingTop: "10%",
      };
      M.Modal.init(this.Modal, options);
   }

   render() {
      return (
         <>
            <div
               ref={(Modal) => {
                  this.Modal = Modal;
               }}
               id="modal1"
               className="modal">
               <div className="modal-content">
                  <h4>{this.props.titulo}</h4>
                  <p>{this.props.conteudo}</p>
               </div>

               <div className="modal-footer">
                  <button
                     data-target="modal1"
                     onClick={(e) => {}}
                     className="modal-close waves-effect waves-light btn btn-flat red white-text">
                     Cancelar
                  </button>

                  <button
                     style={{ marginLeft: 10 }}
                     onClick={(e) => {
                        this.props.botaoConfirmarHandler();
                     }}
                     className="modal-close waves-effect waves-light btn btn-flat green white-text">
                     Confirmar
                  </button>
               </div>
            </div>
         </>
      );
   }
}

export default Modal;
