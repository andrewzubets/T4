import React, {useEffect, useState} from "react";

const MILLISECONDS_TO_WAIT = 1000;

function NameFilter({onChange}){
    const [localValue, setLocalValue]
        = useState('');
    useEffect(()=>{
        const timeoutId = setTimeout(() => {
            onChange(localValue);
        }, MILLISECONDS_TO_WAIT);

        return () => clearTimeout(timeoutId)
    },[localValue])
    const onLocalChange = (e) => setLocalValue(e.target.value);
    return (<input type="text" className="form-control" value={localValue}
                   onChange={onLocalChange}/>)
}

export default NameFilter;