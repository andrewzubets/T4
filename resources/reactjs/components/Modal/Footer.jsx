import React from "react";

function Footer({onClose}){
    return (<div className="modal-footer justify-content-center">
        <button type="button" className="btn btn-primary" onClick={onClose}>Continue</button>
    </div>);
}

export default Footer;