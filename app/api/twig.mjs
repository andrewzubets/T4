import {frontendConfig} from "../config.mjs";
import Twig from 'twig';
function setUpTwig(app) {
    app.set("twig options", {
        allowAsync: true,
        strict_variables: false
    });
}
Twig.extendFunction("frontScript", (value) => {
    return frontendConfig[value] || '';
});
export {
    setUpTwig
}