import React from "react";

function Body({message:messages}){
    const messageList = Array.isArray(messages) ? messages : [messages];
    return (<div className="modal-body">
        {messageList.map((message, key) => (<p key={key}>{message}</p>))}
    </div>);

}
export default Body;