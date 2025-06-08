import express from 'express';



const app = express();
app.get('/', 
    function(req, res) {
        const user = req.user;
        res.send('node working');
});

app.listen(3000, () => {
    console.log(`Example app listening on port ${3000}`)
});