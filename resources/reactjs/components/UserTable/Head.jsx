import React from "react";
import UserSelect, {isAllUsersSelected, selectAllUsers} from "../UserSelect";

function getNextSort (id, prevSort) {
    if(id !== prevSort.id){
        return {id, direction:'desc'};
    }
    const directionSpin = {
        none: 'desc',
        desc: 'asc',
        asc: 'none',
    };
    return {id, direction: (directionSpin[prevSort.direction] ?? 'desc')};
}
function Column({children}){
    return (<th scope="col">{children}</th>);
}
function ColumnSortable({label, id, currentSort, onSort}){
    const onClick = () => onSort(getNextSort(id, currentSort));
    const cssClass = 'az-sortable az-sort-'
        + (currentSort.id === id ? currentSort.direction : 'none');
    return (<Column>
        <div className={cssClass} onClick={onClick}>
            <span>{label}</span>
            <i></i>
        </div>
    </Column>);
}
function Head({children}) {
    return (<thead>
    <tr>{children}</tr>
    </thead>);
}

export default Head;

export  {
    Column,
    ColumnSortable
};