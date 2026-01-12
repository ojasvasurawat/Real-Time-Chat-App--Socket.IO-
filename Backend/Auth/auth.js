const {z} = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { UserModel } = require("../db/db");

require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

mongoose.connect(MONGODB_URI);



async function signUp(req,res){
    const bodyContent = z.object({
        email : z.string().min(3).max(320).email().refine(async (email)=>{
            const existingEmail = await UserModel.findOne({email: email.toLowerCase()});
            return !existingEmail;
        }, {
            message: "There is already an account with this email"
        }),
        username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/).refine(async (username)=>{
            const existingUsername = await UserModel.findOne({username: username});
            return !existingUsername;
        }, {
            message: "There is already an user with this username"
        }),
        displayName : z.string().min(3).max(50),
        password : z.string().min(8).max(20)
    }).strict();

    const check = await bodyContent.safeParseAsync(req.body);

    if(!check.success){
        res.status(400).json({
            message: "incorrect format",
            error: check.error
        });
        return;
    }

    const {displayName, username, email, password} = req.body;

    try{
        const hashdPassword = await bcrypt.hash(password, 5);

        await UserModel.create({
            displayName: displayName,
            username: username,
            email: email,
            password: hashdPassword
        });

        res.json({
            message: "user created"
        })
    }
    catch(e){
        res.json({
            message: "user exist",
            error: e
        });
    }
}


async function signIn(req, res){
    const {email, password} = req.body;

    const user = await UserModel.findOne({email});

    if(!user){
        res.json({
            message: "user not found"
        });
    }

    const compare = await bcrypt.compare(password, user.password);

    if(compare){
        const token = jwt.sign({
            id: user._id.toString()
        }, JWT_SECRET);
        res.json({
            user: user,
            message: "user signed in successfully",
            token: token
        });
    }
    else{
        res.status(404).send("incorrect credential");
    }
}

module.exports = {
    signUp,
    signIn
};