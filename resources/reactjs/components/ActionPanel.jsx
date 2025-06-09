import React from "react";
import SvgIcon from "./ActionPanel/SvgIcon";
import Button from "./ActionPanel/Button";
import NameFilter from "./ActionPanel/NameFilter";

export default function ActionPanel({disabled, onAction, onChangeNameFilter}){
    return (
        <div className="az-action-panel bg-info-subtle">
            <div className="btn-group">
                <Button actionId="block" type="primary" onClick={onAction} disabled={disabled} >
                    <SvgIcon icon="lock" />
                    <span>Block</span>
                </Button>
                <Button actionId="unblock" type="success" onClick={onAction} disabled={disabled} >
                    <SvgIcon icon="unlock" />
                </Button>
                <Button actionId="delete" type="danger" onClick={onAction} disabled={disabled} >
                    <SvgIcon icon="user-x" />
                </Button>
            </div>
            <div className="az-name-filter">
                <NameFilter onChange={onChangeNameFilter} />
            </div>
        </div>
    );
}