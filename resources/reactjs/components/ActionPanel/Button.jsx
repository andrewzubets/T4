import React from "react";

function onActionButtonClick(disabled, onClick, actionId) {
    if(!disabled && onClick){
        onClick(actionId);
    }
}
function Button({type, onClick, disabled, children, actionId}){
    const className = 'btn az-btn-icon btn-outline-' +type;
    const onActionBtnClick = () => onActionButtonClick(disabled, onClick, actionId);
    return (<button type="button" className={className} onClick={onActionBtnClick} disabled={disabled}>
        {children}
    </button>)
}

export default Button;