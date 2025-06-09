function Table({children}) {
    return (<table className="table table-striped table-responsive table-hover az-user-table">
        {children}
    </table>);
}

export default Table;