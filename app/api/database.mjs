import mysql from "mysql2/promise";
import {dbConfig} from "../config.mjs";


let connection = null;

const connectDatabase = async () => {
    return connection ? connection
        : connection = await mysql.createPool(dbConfig);
}

const disconnectDatabase = () => {
    // if(connection) {
    //     connection.end();
    // }
}

export {
    connectDatabase,
    disconnectDatabase
}