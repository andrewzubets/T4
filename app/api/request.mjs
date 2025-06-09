import {generateSalt, hashPassword} from "./auth.mjs";
import UserRecord from "../Db/UserRecord.mjs";

function isApiRequest(req){
    const url = req.originalUrl || req.url;
    return url && url.startsWith('/api');
}
function getRequestQuerySort(req, defaultId, defaultDirection){
    const direction = req.query['sort[direction]'] ?? defaultDirection;
    return {
        id: req.query['sort[id]'] ?? defaultId,
        direction: direction === 'none' ? null : direction,
    }
}
function getRequestQueryFilters (req, defaults) {
    return {
        filterValue: req.query['filter'] ?? '',
        sortData: getRequestQuerySort(req, defaults.sort?.id, defaults.sort?.direction)
    }
}
function extractUserNameIfEmpty(name, email) {
    if(name.length > 0){
        return name;
    }
    return email.substring(0, email.indexOf('@'));
}
function getNewUserFromRequest(req){
    const email = req.body.email;
    const name = extractUserNameIfEmpty(req.body.name, email);
    const salt = generateSalt();
    const password = hashPassword(req.body.password, salt)
        .toString('hex');

    return new UserRecord({name, email, salt, password});
}

export {
    getRequestQueryFilters,
    getNewUserFromRequest,
    isApiRequest
}