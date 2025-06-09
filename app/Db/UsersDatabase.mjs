import UserRecord, {USER_STATUS_ACTIVE} from "./UserRecord.mjs";
import {connectDatabase} from "../api/database.mjs";
import {formatDateToDmyHis} from "../api/api.mjs";


class UsersDatabase {
    static async query(sql, values){
        const connection = await connectDatabase();
        const [queryResults] = await connection.query(sql, values);
        return queryResults ?? [];
    }

    static async getUsers(filterValue = '', sortData = {}) {
        let sql = 'select * from users where deleted_at is null';
        let values = {};
        if (filterValue !== '') {
            sql += ' and email like :email';
            values['email'] = '%' + filterValue + '%';
        }
        if (sortData.id && sortData.direction) {
            sql += ' order by ' + sortData.id + ' ' + sortData.direction;
        }

        const results = await UsersDatabase.query(sql, values);

        return results.map(result => new UserRecord(result));
    }
    static async getUserByEmail(email) {
        return await getUserBy('email', email);
    }
    static async getUserById(id) {
        return await getUserBy('id', id);
    }

    static async createUser(user) {
        const sql = 'insert into users(name,email,salt,password,status,created_at) ' +
            'values(:name,:email,:salt,:password,:status,:created_at)';
        const {name,email,salt,password} = user;
        const values = {
            name,email,salt,password,
            status: USER_STATUS_ACTIVE,
            created_at: formatDateToDmyHis(new Date())
        }
        const result = await UsersDatabase.query(sql,values);
        user.id = result.insertId;
        return user;
    }

    static async setUserLastSeen(id, lastSeen){
        return await UsersDatabase.query(
            'update users set last_seen = :lastSeen where id = :id', {
                id,
                lastSeen
            });
    }
    static async patchUsers(patchData) {
        return new Promise((resolve, reject) => {
            connectDatabase()
                .then(connection => {
                for (const patchUserData of patchData) {
                    const {sql, values} = getPatchUserSqlData(patchUserData);
                    connection.execute(sql, values).then(()=>{},(err)=>{
                        reject(err);
                    });
                }
            })
            resolve(true);
        });
    }
}
function getPatchUserSqlData(patchUserData) {
    const {id, ...data} = patchUserData;
    if(!id || data.length === 0){
        return;
    }
    let sql = 'update users set';
    for (let fieldId in data){
        sql+=` ${fieldId} = :${fieldId},`;
        if(fieldId === 'deleted_at' && data[fieldId] !== null){
            sql+=' deleted_email = email,email = id,';
        }
    }
    sql = sql.substring(0, sql.length - 1);
    sql+=' where id = :id and deleted_at is null';
    return { sql, values: patchUserData };
}
async function getUserBy(field, value) {
    const results = await UsersDatabase.query(
        `select *
         from users
         where ${field} = :value
           and deleted_at is null limit 0,1`, {value});
    return results.length > 0
        ? new UserRecord(results[0]) : null;
}

export default UsersDatabase;