function Frame({cssClass,children}){
    return (<div className={"modal fade " + cssClass}>
        <div className="modal-dialog">
            <div className="modal-content">
                {children}
            </div>
        </div>
    </div>);
}

export default Frame;