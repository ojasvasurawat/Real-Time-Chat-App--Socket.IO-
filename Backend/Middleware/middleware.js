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
            res.status(404).json({message: "user not found"});
        }
    }
    else{
        res.status(404).json({message: "no token found"});
    }
}

function sktMdw(socket, next){
    // console.log("inside socket middleware");
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization;

    if(token){
        const user = jwt.verify(token, JWT_SECRET);
        if(user){
            // req.userId = user.id;
            // const userId = user.id;
            // console.log(userId);
            // req.ObjectId = userId;
            socket.ObjectId = user.id;
            // console.log("user ",user," cleared middleware");
            next();
        }
        else{
            const err = new Error("user not found");
            err.data = { content: "Please create account" };
            next(err);
        }
    }
    else{
        const err = new Error("no token found");
        err.data = { content: "Please enter valid credentials" };
        next(err);
    }
}

module.exports = {
    auth,
    sktMdw
}