const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome To the API'
    });
});
//Want this posts route to be the protected route
//passing the post the route, a middlewear function, authData if any and an error 
app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err){
            res.sendStatus(403)
        }else{
            res.json({
                message: 'Post created...',
                authData
            })
        }
    })
});

//Login route will supply the jwt
app.post('/api/login', (req, res) => {
    //Mock user
    const user = {
        id: 1,
        username: 'Jordan',
        email: 'jordanrosasdev@gmail.com'
    }

    jwt.sign({user}, 'secretkey', { expiresIn: 30 }, (err, token) => {
        res.json({
            token
        });
    });
});

//verifyToken format Bearer <authToken>

function verifyToken(req, res, next){
    //get Auth header value
    const bearerHeader = req.headers['authorization'];
    //check if bearer is undefined 
    if(typeof bearerHeader !== undefined){
        //split at the space of the bearer token space 
        const bearer = bearerHeader.split(' ')
        //get token from array
        const bearertoken = bearer[1]
        //set token
        req.token = bearertoken
        //next middlewear
        next();
    }else{
        //Forbidden
        res.sendStatus(403)
    }

}
app.listen(5000, () => console.log('Server started on port 5000'));