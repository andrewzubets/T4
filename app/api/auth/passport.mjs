import {getSessionUser} from "../session.mjs";

function passportSerializeUser(user, cb){
    process.nextTick(function() {
        cb(null, getSessionUser(user));
    });
}
function passportDeserializeUser(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
}

export {
    passportSerializeUser,
    passportDeserializeUser
}