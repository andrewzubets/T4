import { createRoot } from 'react-dom/client';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import moment from 'moment';
import ActionPanel from "./components/ActionPanel";
import Modal from "./components/Modal";
import Preloader from "./components/Preloader";
import UserTable from "./components/UserTable";
import {ajaxFetchUsers, ajaxListAction, getAuthErrorModalMessage, getServerErrorModalMessage} from "./api.mjs";


const defaultSortData = {
    id: 'last_seen',
    direction: 'desc'
};
function Dashboard() {
    const [isFetching, setIsFetching] = useState(true);
    const [users = [], setUsers] = useState();
    const [modal, setModal] = useState({});
    const [sortData, setSortData] = useState(defaultSortData);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [nameFilter, setNameFilter] = useState([]);
    const fetchUsers = () => {
        setIsFetching(true);
        ajaxFetchUsers(sortData,nameFilter).then(onFetchUsersSuccess, handleAxiosError);
    }
    useEffect(() => {
        fetchUsers();
    },[sortData,nameFilter]);

    const onFetchUsersSuccess = (response) => {
        const users = response.data.data;
        const usersIds = users.map(user => user.id);
        setUsers(users);
        setIsFetching(false);
        setSelectedUsers((prevSelection)=>{
            return prevSelection.filter(prevId =>{
                return usersIds.includes(prevId);
            });
        });
    }

    const handleAxiosError = (axiosError) => {
        setIsFetching(false);
        const responseData = axiosError.response;
        if(axiosError.status === 401) {
            handleAuthError(responseData);
        }else{
            handleDbConnectionLostError(axiosError, responseData);
        }
    }

    const handleAuthError = (responseData) => {
        setModal({
            visible: true,
            closeAction: 'reload',
            message: getAuthErrorModalMessage(responseData)
        });
    }
    const handleDbConnectionLostError = (axiosError, responseData) => {
        setModal({
            visible: true,
            title: 'Server error',
            message: getServerErrorModalMessage(responseData),
        });
    }
    const onActionButtonClick = (actionId) => {
        setIsFetching(true);
        ajaxListAction(actionId, selectedUsers)
            .then(() => {
                ajaxFetchUsers(sortData, nameFilter).then(
                    onFetchUsersSuccess,
                    handleAxiosError
                );
            }, (error) => {
                setIsFetching(false);
                handleAxiosError(error);
            });

    }

    const onModalClose = (closeAction) => {
        if(closeAction === 'reload'){
            window.document.location.reload();
        }
        setModal(prevState=> ({...prevState, visible: false}));
    }

    return (<>
        <Preloader visible={isFetching} />

        <Modal {...modal} onClose={onModalClose} />
        <ActionPanel onAction={onActionButtonClick}
                     disabled={selectedUsers.length === 0}
                     onChangeNameFilter={setNameFilter}
        />
        <UserTable
                   selectedUsers={selectedUsers}
                   onSelect={setSelectedUsers}
                   currentSort={sortData}
                   users={users}
                   onSort={setSortData} />
    </>);
}




 function UserTable1({
                        onSort,
                        sort = null,
                        users = [],
                        onSelect = null,
                        isAllSelected= false,
                        rowSelection = {}
 }){
    return (

            <table className="table table-striped table-responsive table-hover az-user-table">
            <UserTableHead onSort={onSort}
                           sort={sort}
                           onSelect={onSelect}
                           isAllSelected={isAllSelected} />
            <tbody>
                {users.map((user, index) =>
                    <UserTableRow
                        key={index}
                        user={user}
                        onSelect={onSelect}
                        isSelected={ rowSelection.includes(user.id) }
                    />)}
            </tbody>
            </table>
        );
}
function TableCellSelect({isSelected = false, onChange = null}){
    return (<td>
        <input className="form-check-input" type="checkbox" readOnly={true} checked={isSelected} onChange={onChange}/>
    </td>);
}
function TableCellEmail({email=''}){
    return (<td className="az-cell-full az-cell-email">
        {email}
    </td>);
}



function TableCellStatus({statusValue = 0}) {
    return (<td className="az-cell-full"><UserStatusBadge statusValue={statusValue} /></td>);
}
function TableCellLastSeen({last_seen = ''}){
    const lastSeenAgo = last_seen ? moment(last_seen).fromNow():'';
    const lastSeenAttr = {
        'aria-label': last_seen ? moment(last_seen).format('MMMM Do YYYY, h:mm:ss'):'',
        'className': 'az-cell-full az-cell-last-seen cooltipz--top',
        'data-cooltipz-dir': 'top'
    }
    return (<td {...lastSeenAttr}>{lastSeenAgo}</td>);
}
function TableCellMobile({email = '', statusValue = 0, last_seen = ''}){
    const lastSeenAgo = last_seen ? moment(last_seen).fromNow():'';
    const lastSeen = last_seen ? moment(last_seen).format('MMMM Do YYYY, h:mm:ss'):'';
    return (<td className="az-cell-mobile" colSpan={3}>
        <ul className="list-group az-cell-mobile-group">
            <li className="list-group-item">
                <div className="az-title">Email</div>
                {email}
            </li>
            <li className="list-group-item">
                <div className="az-title">Status:</div>
                <UserStatusBadge statusValue={statusValue} />
            </li>
            <li className="list-group-item">
                {/*<div className="az-title">Last seen:</div>*/}
                <div className="az-cell-mobile-last-seen">
                    <div className="az-last-seen-ago">{lastSeenAgo}</div>
                    <div className="az-last-seen-full">({lastSeen})</div>
                </div>

            </li>
        </ul>
        </td>
    );
}

function UserTableRow({
    user = {}, isSelected = false, onSelect = null
}) {
    let {id = null, email = '', status:statusValue = 0, last_seen = ''} = user;
    console.log(user);
    const onSelectRow = () => {
        if (onSelect) {
            onSelect('row', isSelected, id);
        }
    }
    return (<tr onClick={onSelectRow}>
        <TableCellSelect isSelected={isSelected} />
        <TableCellMobile email={email} statusValue={statusValue} last_seen={last_seen} />
        <TableCellEmail email={email} />
        <TableCellStatus statusValue={statusValue} />
        <TableCellLastSeen last_seen={last_seen} />
    </tr>);//2025-05-04T08:32:11.000Z
}

function UserTableHead({onSort,sort = null, isAllSelected = true, onSelect = null}) {
    const onSelectAll = () => {
        if(onSelect){
            onSelect('all', isAllSelected);
        }
    }
    return (<thead>
    <tr>
        <th scope="col" >
            <label>
                <input className="form-check-input" type="checkbox" checked={isAllSelected} onChange={onSelectAll} />
                </label>
            </th>
        <TableHeadSortCol fieldId="email" label="Email" onSort={onSort} sort={sort} />
        <TableHeadSortCol fieldId="status" label="Status" onSort={onSort} sort={sort} />
        <TableHeadSortCol fieldId="last_seen" label="Last seen" onSort={onSort} sort={sort} />
    </tr>
    </thead>);
}
function TableHeadSortCol({
      label='',
      sort = null,
      fieldId='', onSort=null
}){
    const {field = 'none',direction = 'desc'} = sort;
    const onClick = () => {
        if(onSort){
            onSort(fieldId, field, direction );
        }
        console.log('click',onSort);
    };
    return (<th scope="col">
        <div onClick={onClick} className={'az-sortable az-sort-'+(field === fieldId ? direction : 'none')}>
            <span>{label}</span>
            <i></i>
        </div>
    </th>);
}

const domNode = document.getElementById('react-app');
createRoot(domNode)
    .render(<Dashboard/>);