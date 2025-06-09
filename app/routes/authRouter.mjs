import express from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import { sessionPull } from "../api/session.mjs";

import {
    loginUser,
    logout, logoutHanlder
} from "../api/auth.mjs";
import {getValidatedFieldResponse} from "../api/response.mjs";
import {loginVerifyPassword, setLastEmailLogin} from "../api/auth/login.mjs";
import {passportDeserializeUser, passportSerializeUser} from "../api/auth/passport.mjs";
import {getRegistrationErrorViewData, logRegistrationError, validateRegister} from "../api/auth/register.mjs";
import {getNewUserFromRequest} from "../api/request.mjs";
import UsersDatabase from "../Db/UsersDatabase.mjs";

const router = express.Router();
router.use(express.urlencoded({ extended: false }));

passport.use('local',
    new LocalStrategy({usernameField: 'email'}, loginVerifyPassword)
);
passport.serializeUser(passportSerializeUser);
passport.deserializeUser(passportDeserializeUser);

router.get('/login', function(req, res) {
    let errorMessage = sessionPull(req.session,
        'messages', [])[0] || false;

    if(req.query['from'] === 'blocked'){
        errorMessage = 'Your account was blocked and was logout automatically.';
    }
    res.render('user/login.twig',{
        title: 'Log in',
        email: sessionPull(req.session,'last_email', ''),
        errorMessage,
    });
});

router.post('/login',
    setLastEmailLogin,
    passport.authenticate('local', {
        successReturnToOrRedirect: '/',
        failureRedirect: '/user/login',
        failureMessage: true,
        usernameField: 'email'
    })
);

router.post('/logout', logoutHanlder);

router.get('/register', function(req, res) {
    res.render('user/register.twig');
});

router.post('/register', validateRegister,
    async function (req, res, next) {
        try {
            const requestUser = getNewUserFromRequest(req);
            const newUser = await UsersDatabase.createUser(requestUser);
            loginUser(req,res,next, newUser);
        }
        catch(error) {
            res.render('user/register.twig', getRegistrationErrorViewData(error,req));
            logRegistrationError(error);
        }
    });

export default router;