import React from "react";
import {Cell, Row} from "./UserTable/Body";
import {Column} from "./UserTable/Head";


function isAllSelected(options, selectedOptions){
    return options.length > 0
        && options.length === selectedOptions.length;
}

function immutableToggleSelectAll(options, isSelected) {
    return isSelected ? []: options.concat([]);
}

function immutableToggleSelection(option, isSelected, selected){
    if(isSelected){
        return selected.slice(0,selected.indexOf(option))
            .concat(selected.slice(selected.indexOf(option) + 1));
    }
    return selected.concat(selected.includes(option) ? [] : [option]);
}

function Selector(props){
    return (<label>
        <input className="form-check-input" type="checkbox" {...props}/>
    </label>);
}

function SelectColumn({selected, onSelect, options}) {
    const isSelected = isAllSelected(options, selected);

    const onChange= () => onSelect(immutableToggleSelectAll(options, isSelected));
    return (<Column>
        <Selector checked={isSelected} onChange={onChange} />
    </Column>);
}
function SelectRow({ selected, onSelect, option, children}) {
    const isSelected = selected.includes(option);
    const onClick = () => onSelect(immutableToggleSelection(option, isSelected, selected));

    return (<Row onClick={onClick}>
        <Cell>
            <Selector checked={isSelected} readOnly={true} />
        </Cell>
        {children}
    </Row>);
}
export default Selector;
export {
    SelectColumn,
    SelectRow
}