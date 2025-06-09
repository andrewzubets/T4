import SQLiteStore from 'connect-sqlite3';
import {sessionConfig} from "../config.mjs";
import session from 'express-session';
import {formatDateToDmyHis} from "./api.mjs";
import UsersDatabase from "../Db/UsersDatabase.mjs";

function sessionPull(session, prop, defaultValue = null){
    const value = session[prop] || defaultValue;
    delete session[prop];
    return value;
}

function connectSqlLiteSessionStore(session, options){
    return new (SQLiteStore(session))(options);
}

function SQLLiteSession(){
    const {store:storeConfig, ...config} = sessionConfig;
    return session({
        ...sessionConfig,
        store: connectSqlLiteSessionStore(session, storeConfig),
    });
}
function getSessionUser(user) {
    return {id: user.id, email: user.email};
}

async function saveLastSeen(req, res, next) {
    const sessionUser = req.user;
    if (!sessionUser) {
        next();
    }
    await UsersDatabase.setUserLastSeen(sessionUser.id,
        formatDateToDmyHis(new Date));
    next();
}

export {
    sessionPull,
    SQLLiteSession,
    getSessionUser,
    saveLastSeen
}