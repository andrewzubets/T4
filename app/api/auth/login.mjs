import crypto from "node:crypto";
import {hashPassword} from "../auth.mjs";
import UsersDatabase from "../../Db/UsersDatabase.mjs";
import {getSessionUser} from "../session.mjs";

function verifyBadUserError(verifyCallback, isNotExists){
    verifyCallback(null, false, {
        message: isNotExists ? 'User not registered.'
            : 'Your account is blocked.'
    });
}
function verifySuccess(verifyCallback, user){
    verifyCallback(null, getSessionUser(user));
}
function verifyError(verifyCallback, message) {
    verifyCallback(null, false, {message});
}

function setLastEmailLogin(req,res,next) {
    req.session['last_email'] = req.body.email;
    next();
}

function isLoginPasswordsMatch(user, password) {
    const passwordHash = hashPassword(password, user.salt);
    const storedPasswordHash = Buffer.from(user.password, 'hex');
    return crypto.timingSafeEqual(passwordHash, storedPasswordHash);
}

async function loginVerifyPassword(email, password, cb) {
    try {
        const user = await UsersDatabase.getUserByEmail(email);
        console.log(user);
        if (!user || user.isBlocked()) {
            return verifyBadUserError(cb, !user);
        }
        if (isLoginPasswordsMatch(user, password)) {
            return verifySuccess(cb, user);
        }
        return verifyError(cb, 'Incorrect username or password.');
    }
    catch (error) {
        console.error(error);
        verifyError(cb, 'Database error')
    }
}

export {
    loginVerifyPassword,
    setLastEmailLogin
}