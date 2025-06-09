import React from "react";

function Shadow({cssClass}){
    return (<div className={"modal-backdrop fade " + cssClass}></div>);
}

export default Shadow;