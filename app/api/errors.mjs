import {isApiRequest} from "./request.mjs";

const HTTP_CODES = {
    SERVER_ERROR: 500,
};
const databaseMessages = {
    ECONNREFUSED: 'Failed to connect database.',
    ER_CON_COUNT_ERROR: 'Too many database connections.',
    ECONNRESET: 'Database connection was reset.',
    ETIMEDOUT: 'Database connection timeout.',
}

const errorHandler = (err, req, res, next) => {

    const code = err.code;
    const message = databaseMessages[code];
    console.log('error: ',code);
    if(isApiRequest(req)){
        res.status(HTTP_CODES.SERVER_ERROR).json({
            error: message || 'Server error.',
            code,
        });
    }else{
        res.status(HTTP_CODES.SERVER_ERROR).render('error.twig',{
            message: message || 'Server error.',
        });
    }

    if(!message){
        console.error(err);
    }
};

export {
    errorHandler
}