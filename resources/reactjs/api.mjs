import axios from "axios";

function getAuthErrorModalMessage(responseData) {
    const reason = responseData.data.reason;
    let message = [
        'Your session was closed or you log out in other tab.',
        'Press continue to re-login.'
    ];
    if(reason === 'blocked') {
        message = [
            'Your account have been blocked and you were logout from app.',
            'Press continue to proceed.'
        ];
    }
    if(reason === 'deleted') {
        message = [
            'Your account has been deleted and you were logout from app.',
            'Press continue to proceed.'
        ];
    }
    return message;
}
function getServerErrorModalMessage(responseData) {
    let message = 'An error occurred.';

    if(responseData.code === 'ECONNREFUSED'){
        message = 'Failed to connect database.';
    }
    return message;
}

function ajaxListAction(actionId, ids) {
    let data = [];
    const statusValue = actionId === 'block' ? 0 : 1;
    ids.forEach(id => {
        let userData = {id};
        if(actionId === 'delete'){
            userData.delete = 1;
        }else{
            userData.status = statusValue;
        }
        data.push(userData);
    });

    return  axios.patch('/api/users',data);
}
function getAjaxFetchUserFilter(sort, nameFilter){
    let filter =
        (nameFilter ? `filter=${nameFilter}&`:'')
        + (sort ? `sort[id]=${sort.id}&sort[direction]=${sort.direction}`:'');
    return filter === '' ? '' : '?' + filter;
}
async function ajaxFetchUsers(sort,nameFilter){
    const queryFilter = getAjaxFetchUserFilter(sort, nameFilter);
    return await axios.get('/api/users' + queryFilter);
}

export {
    getAuthErrorModalMessage,
    getServerErrorModalMessage,
    ajaxListAction,
    ajaxFetchUsers
}