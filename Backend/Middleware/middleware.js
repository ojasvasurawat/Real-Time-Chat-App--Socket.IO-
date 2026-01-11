const jwt = require("jsonwebtoken");

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;



function auth(req, res, next){
    const token = req.headers.authorization;

    if(token){
        const user = jwt.verify(token, JWT_SECRET);
        if(user){
            req.userId = user.id;
            const userId = user.id;
            console.log(userId);
            req.ObjectId = userId;
            next();
        }
        else{
            res.status(404).send("user not found");
        }
    }
    else{
        res.status(404).send("no token found");
    }
}

module.exports = auth;