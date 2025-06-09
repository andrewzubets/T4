import React from "react";

function Preloader({visible}) {
    return (<div className={'az-preloader ' + (visible ? '' : 'd-none')}>
        Loading...
    </div>);
}

export default Preloader;