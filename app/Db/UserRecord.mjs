
class UserRecord {
    constructor(data = null) {
        this.id = data?.id;
        this.name = data.name ?? '';
        this.email = data.email ?? '';
        this.password = data?.password ?? '';
        this.salt = data?.salt ?? '';
        this.status = parseInt(data?.status ?? USER_STATUS_ACTIVE);
        this.created_at = data?.created_at ?? null;
        this.last_seen = data?.last_seen ?? null;
    }
    id;
    name;
    email;
    salt;
    password;
    status;
    last_seen;

    isActive(){
        return this.status === USER_STATUS_ACTIVE;
    }
    isBlocked(){
        return this.status === USER_STATUS_BLOCKED;
    }
}

const USER_STATUS_ACTIVE = 1;
const USER_STATUS_BLOCKED = 0;

export default UserRecord;
export {
    USER_STATUS_ACTIVE,
    USER_STATUS_BLOCKED
}