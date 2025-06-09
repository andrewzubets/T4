import React from "react";
import {SelectRow} from "../UserSelect";
import moment from "moment/moment";


function Row({onClick, children}) {
    return (<tr onClick={onClick}>{children}</tr>);
}
function Cell({children, ...props}) {
    return (<td className="az-cell-full" {...props}>{children}</td>);
}
function Body({children}) {
    return (<tbody>{children}</tbody>);
}

function StatusBadge({status:statusValue = 0}) {
    const isBlocked = statusValue === 0;
    const className= 'badge az-status '
        + (isBlocked ? 'az-status-blocked' : 'az-status-active');
    const label = isBlocked ? 'Blocked' : 'Active';
    return (<span className={className}>{label}</span>);
}

function getLastSeenAgo(lastSeen) {
    return lastSeen ? moment(lastSeen).fromNow():'';
}

function getLastSeenDetailed(lastSeen) {
    return lastSeen ? moment(lastSeen)
        .format('MMMM Do YYYY, h:mm:ss'):'';
}

function LastSeen({lastSeen}){
    const lastSeenAgo = getLastSeenAgo(lastSeen);
    const lastSeenDetailed = getLastSeenDetailed(lastSeen);
    return (<span className="cooltipz--top" data-cooltipz-dir="top"
                  aria-label={lastSeenDetailed}>{lastSeenAgo}</span>);
}

function CellMobile({user}){
    const lastSeenAgo = getLastSeenAgo(user.last_seen);
    const lastSeenDetailed = getLastSeenDetailed(user.last_seen);

    const statusValue = user.status;

    return (<td className="az-cell-mobile" colSpan={5}>
            <ul className="list-group az-mobile-list-group">
                <li className="list-group-item">
                    <div className="az-title">Email</div>
                    {user.email}
                </li>
                <li className="list-group-item">
                    <div className="az-title">Name</div>
                    {user.name}
                </li>
                <li className="list-group-item">
                    <div className="az-title">Status:</div>
                    {statusValue === 1 ? 'Active' : 'Blocked'}
                </li>
                <li className="list-group-item">
                    <div className="az-cell-mobile-last-seen">
                        <div className="az-last-seen-ago">{lastSeenAgo}</div>
                        <div className="az-last-seen-full">({lastSeenDetailed})</div>
                    </div>

                </li>
            </ul>
        </td>
    );
}


export default Body;

export {
    Row, Cell, StatusBadge, LastSeen, CellMobile
}