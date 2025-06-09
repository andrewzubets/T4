import {Result as ValidationResult} from "express-validator";

function getUserResponse(user){
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        created_at: user.created_at,
        last_seen: user.last_seen
    };
}
function getUserListResponse(users){
    return {
        data: users.map(user => getUserResponse(user))
    }
}
function getUnAuthResponse(data, redirect){
    return {
        error: 'Unauthorized',
        ...data,
        redirect
    };
}
function getValidatedFieldResponse(value, isValid = true, msg = ''){
    if(value instanceof ValidationResult){
        return {
            isValid: value.isEmpty(),
            ...(value.array()[0])
        };
    }
    return {
        isValid,
        value,
        msg
    };
}
export {
    getUserListResponse,
    getUnAuthResponse,
    getValidatedFieldResponse
}