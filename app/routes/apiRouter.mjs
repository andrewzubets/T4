import express from 'express';
import {authorizeJsonRequest} from "../api/auth.mjs";
import {getUserListResponse} from "../api/response.mjs";
import {formatDateToDmyHis} from "../api/api.mjs";
import {getRequestQueryFilters} from "../api/request.mjs";
import UsersDatabase from "../Db/UsersDatabase.mjs";
import {disconnectDatabase} from "../api/database.mjs";
import {saveLastSeen} from "../api/session.mjs";



const router = express.Router();
router.use(express.json());

router.get('/users',
    authorizeJsonRequest,
    saveLastSeen,
    async (req,res) => {
        const {filterValue, sortData}
            = getRequestQueryFilters(req,{
                sort: {
                    id: 'last_seen',
                    direction: 'desc',
                }
        });
        const users = await UsersDatabase.getUsers(filterValue, sortData);

        res.json(getUserListResponse(users));
    });
function filterUserPatchData(data, allowedFields) {
    const dateNowDb = formatDateToDmyHis(new Date());
    return data.map(userRaw =>{
        let filtered = {};
        allowedFields.forEach(allowedField => {
            if(userRaw.hasOwnProperty(allowedField)){
                filtered[allowedField] = userRaw[allowedField];
            }
        });
        if(userRaw.hasOwnProperty('delete')){
            filtered.deleted_at = dateNowDb;
        }
        return filtered;
    });
}
router.patch('/users',
    authorizeJsonRequest,
    saveLastSeen,
    async (req,res) => {
        const allowedFields = ['id','status'];
        const patchData = filterUserPatchData(req.body, allowedFields);
        await UsersDatabase.patchUsers(patchData);

        res.status(204).send();
    });
export default router;