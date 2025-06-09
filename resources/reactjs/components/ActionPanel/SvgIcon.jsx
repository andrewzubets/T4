import React from "react";

const iconsViewBoxes = {
    defaultValue: '0 0 18 18',
    'user-x': '0 0 24 24',
}
function SvgIcon({icon}) {
    return icon ? (<svg className="az-svg-icon" viewBox={iconsViewBoxes[icon] ?? iconsViewBoxes.defaultValue}>
        <use href={'/img/icons/' + icon + '.svg'}/>
    </svg>) : null;
}
export default SvgIcon;