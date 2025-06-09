import express from 'express';
import {saveLastSeen, SQLLiteSession} from "./api/session.mjs";
import {errorHandler} from "./api/errors.mjs";
import {setUpTwig} from "./api/twig.mjs";
import passport from "passport";
import apiRouter from './routes/apiRouter.mjs';
import authRouter from './routes/authRouter.mjs';
import {authorizeRequest} from "./api/auth.mjs";

const app = express();

app.use(express.static('public'));
app.use(SQLLiteSession());
app.use(passport.authenticate('session'));
setUpTwig(app);

app.use('/api', apiRouter);
app.use('/user', authRouter);

app.get('/', authorizeRequest, saveLastSeen,
    function(req, res) {
        const user = req.user;
        res.render('home/dashboard.twig',{
            user
        });
    });

app.use(errorHandler);
app.listen(3000, () => {
    console.log(`App listening on port ${3000}`)
});