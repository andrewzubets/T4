import React, {useMemo} from "react";
import Table from "./UserTable/Table";
import Head, {ColumnSortable} from "./UserTable/Head";
import Body, {Cell, CellMobile, LastSeen, StatusBadge} from "./UserTable/Body";
import {SelectColumn, SelectRow} from "./UserSelect"

function UserTable({selectedUsers,users, onSelect, currentSort,onSort}) {
    const usersIds = useMemo(()=>users.map(user=>user.id), [users]);
    return (<Table>
        <Head>
            <SelectColumn selected={selectedUsers} options={usersIds} onSelect={onSelect} />
            <ColumnSortable id="name" label="Name" onSort={onSort} currentSort={currentSort} />
            <ColumnSortable id="email" label="Email" onSort={onSort} currentSort={currentSort} />
            <ColumnSortable id="status" label="Status" onSort={onSort} currentSort={currentSort} />
            <ColumnSortable id="last_seen" label="Last seen" onSort={onSort} currentSort={currentSort} />
        </Head>
        <Body>
            {users.map((user,index) =>
                (<SelectRow key={index} option={user.id} selected={selectedUsers} onSelect={onSelect}>
                    <CellMobile user={user} />
                    <Cell children={user.name} />
                    <Cell children={user.email} />
                    <Cell>
                        <StatusBadge status={user.status} />
                    </Cell>
                    <Cell>
                        <LastSeen lastSeen={user.last_seen} />
                    </Cell>
                </SelectRow>))}
        </Body>
    </Table>)
}

export default UserTable;