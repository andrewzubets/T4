import {body as bodyValidator} from 'express-validator';
import crypto from "node:crypto";
import {getUnAuthResponse, getValidatedFieldResponse} from "./response.mjs";
import UsersDatabase from "../Db/UsersDatabase.mjs";

const AUTH_REDIRECT = '/user/login';

function hashPassword(password, salt){
    return crypto.pbkdf2Sync(password,
        salt, 310000, 32, 'sha256');
}
function generateSalt(){
    return crypto.randomBytes(16).toString('hex')
}

function loginUser(req,res,next, user){
    req.login({id: user.id, email: user.email}, function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
}
function logoutHanlder(req, res, next){
    req.logout(function(err) {
        if (err && next) { return next(err); }
        res.redirect(AUTH_REDIRECT);
    });
}
function logout(req, res, next, withRedirect = true, redirectTo = '/user/login'){
    req.logout(function(err) {
        if (err && next instanceof Function) { return next(err); }
        if(withRedirect) { res.redirect(redirectTo);}
    });
}

function authorizeAuthRequest(req,res, isJson = false) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return true;
    }
    if(isJson) {
        res.json(getUnAuthResponse({
            returnTo: req.session ? req.originalUrl || req.url : '/',
        }, AUTH_REDIRECT));
    }else{
        res.redirect(AUTH_REDIRECT);
    }
}
function authorizeValidSessionRequest(req,res, isJson = false) {
    if(req.user && Number.isInteger(req.user.id)) {
        return true;
    }
    logout(req, res,false, !isJson);
    if(isJson){
        res.json(getUnAuthResponse({reason: 'nos'}, AUTH_REDIRECT));
    }
}
async function authorizeActiveUserRequest(req,res, isJson = false) {
    const user = await UsersDatabase.getUserById(req.user.id);
    if(user && user.isActive()){
        return true;
    }
    logout(req, res,false, !isJson, AUTH_REDIRECT + '?from=blocked');
    if(isJson){
        res.status(401).json(getUnAuthResponse({
            reason: !user ? 'deleted' : 'blocked',
            redirect: AUTH_REDIRECT + '?from=blocked',
        }));
    }
}

async function authorizeJsonRequest(req, res, next) {
    return authorizeRequest(req,res,next, true);
}
async function authorizeRequest(req, res, next, isJson = false) {
    if(
        !authorizeAuthRequest(req, res, isJson)
        || !authorizeValidSessionRequest(req, res, isJson)
        || !await authorizeActiveUserRequest(req, res, isJson)
    ){
        return;
    }
    next();
}


export {
    loginUser,
    generateSalt,
    hashPassword,
    authorizeRequest,
    authorizeJsonRequest,
    logout,
    logoutHanlder,
    AUTH_REDIRECT
}