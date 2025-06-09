import {body as bodyValidator} from 'express-validator';
import {getValidatedFieldResponse} from "../response.mjs";

async function validateRegisterEmail(req){
    let validationResult = await bodyValidator('email').isEmail()
        .withMessage('Enter valid email').run(req);
    return getValidatedFieldResponse(validationResult);
}
async function validateRegisterPassword(req){
    let validationResult = await bodyValidator('password')
        .notEmpty()
        .withMessage('Enter password').run(req);
    return getValidatedFieldResponse(validationResult);
}
async function validateRegisterPasswordConfirm(req){
    let validationResult = await bodyValidator('password_confirm')
        .custom((confirm, { req }) => {
            return confirm === req.body.password;
        }).withMessage('Password confirm doesn\'t match').run(req);
    return getValidatedFieldResponse(validationResult);
}
async function validateRegister(req, res, next) {
    const fieldName = getValidatedFieldResponse(req.body.name);
    const fieldEmail = await validateRegisterEmail(req);
    const fieldPassword = await validateRegisterPassword(req);
    const fieldPasswordConfirm = await validateRegisterPasswordConfirm(req);
    if(!fieldEmail.isValid || !fieldPassword.isValid || !fieldPasswordConfirm.isValid){
        return res.render('user/register.twig',{
            wasValidated: true,
            fieldName,
            fieldEmail,
            fieldPassword,
            fieldPasswordConfirm
        });
    }
    next();
}
function logRegistrationError(error){
    if(error.code === 'ER_DUP_ENTRY'){
        return;
    }
    console.error(error);
}

function getRegistrationErrorViewData(error,req){
    const msg = error.code === 'ER_DUP_ENTRY'
        ? 'Another account exists with same email.'
        : 'Server error occurred.';
    return  {
        wasValidated: true,
        fieldName: getValidatedFieldResponse(req.body.name),
        fieldEmail: getValidatedFieldResponse(req.body.email, false, msg)
    }
}

export {
    validateRegister,
    logRegistrationError,
    getRegistrationErrorViewData
}