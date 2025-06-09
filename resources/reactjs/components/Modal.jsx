import React from "react";
import Frame from "./Modal/Frame";
import Header from "./Modal/Header";
import Footer from "./Modal/Footer";
import Shadow from "./Modal/Shadow";
import Body from "./Modal/Body";

function Modal({visible,
                    closeAction,
                   onClose,
                   title,
                   message
               }){
    const visibleCssClass = visible ? 'show d-block' : 'd-none';
    const closeModal = () => onClose(closeAction);
    return (<>
        <Frame cssClass={visibleCssClass}>
            <Header onClose={closeModal} title={title} />
            <Body message={message} />
            <Footer onClose={closeModal} />
        </Frame>
        <Shadow cssClass={visibleCssClass} />
    </>);
}
export default Modal;