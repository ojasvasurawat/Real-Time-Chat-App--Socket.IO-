const {z} = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { UserModel } = require("../DB/db");

const nodemailer = require("nodemailer");

const { createClient } = require("redis");



require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

const REDIS_PASS = process.env.REDIS_PASS;
const REDIS_USERNAME = process.env.REDIS_USERNAME;



const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
    socketTimeout: 60000
});

// try{
//     await transporter.verify();
//     console.log("Server is ready to take our message");
// }
// catch(err){
//     console.log("Verification failed: ", err);
// }




const client = createClient({
    url: `redis://${REDIS_USERNAME}:${REDIS_PASS}@redis-11947.c15.us-east-1-2.ec2.cloud.redislabs.com:11947`
});

client.on('error', err => console.log('Redis Client Error', err));



mongoose.connect(MONGODB_URI);

async function connectRedis() {
    await client.connect();
}

connectRedis();


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
        password : z.string().min(0).max(20),
        sub: z.string(),
    }).strict();

    const check = await bodyContent.safeParseAsync(req.body);

    if(!check.success){
        res.status(400).json({
            message: "incorrect format",
            error: check.error,
            errorMessage: check.error.message
        });
        return;
    }

    const {displayName, username, email, password, sub} = req.body;

    try{
        const hashdPassword = await bcrypt.hash(password, 5);


        if(sub !== ""){

            const hashedSub = await bcrypt.hash(sub, 5);
            await UserModel.create({
                displayName: displayName,
                username: username,
                email: email,
                sub: hashedSub
            });



            res.json({
                message: "user created"
            });
            return;
        }
        else{


            const validationCode = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);

            try {
                const info = await transporter.sendMail({
                    from: 'ojasva.surawat.dev@gmail.com',
                    to: email,
                    subject: "Real Time Chat App email validation code",
                    text: `Your validation code is:\n\n${validationCode}\n\nEnter this in your application`,
                });

                await client.set(email, validationCode, { EX: 120 });


                res.json({
                    message: "we have send you a code on mail"
                });
                return;
                // console.log("info is: ", info);
                // console.log("Message sent: %s", info.messageId);
                // // Preview URL is only available when using an Ethereal test account
                // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            } catch (err) {
                // console.error("Error while sending mail:", err);
                res.json({
                    message: "error occur during sending mail",
                    error: err
                });
                return;
            }

        }


        // await UserModel.create({
        //     displayName: displayName,
        //     username: username,
        //     email: email,
        //     password: hashdPassword
        // });

        // res.json({
        //     message: "user created"
        // })

        
    }
    catch(e){
        res.json({
            message: "user exist",
            error: e
        });
    }
}


async function verifyCode(req, res) {

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
        password : z.string().min(8).max(20),
        code : z.string().min(6).max(6),
        sub: z.string(),
    }).strict();

    const check = await bodyContent.safeParseAsync(req.body);

    if(!check.success){
        res.status(400).json({
            message: "incorrect format",
            error: check.error,
            errorMessage: check.error.message
        });
        return;
    }

    const {displayName, username, email, password, sub, code} = req.body;

    try{
        const hashdPassword = await bcrypt.hash(password, 5);

        const originalCode = await client.get(email);


        if(code === originalCode){
            await UserModel.create({
                displayName: displayName,
                username: username,
                email: email,
                password: hashdPassword 
            });



            res.json({
                message: "user created"
            });
            return;
        }
        
    }
    catch(e){
        res.json({
            message: "expired or wrong code",
            error: e
        });
    }
    
}


async function signIn(req, res){
    const {email, password, sub} = req.body;

    const user = await UserModel.findOne({email});

    if(!user){
        res.json({
            message: "user not found"
        });
        return;
    }

    if(sub !== ""){

        const compare = await bcrypt.compare(sub, user.sub);

        if(compare){
            const token = jwt.sign({
                id: user._id.toString()
            }, JWT_SECRET);
            res.json({
                user: user,
                message: "user signed in successfully",
                token: token
            });
            return;
        }
        else{
            res.status(404).send("incorrect credential");
            return;
        }

    }
    else{
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
            return;
        }
        else{
            res.status(404).send("incorrect credential");
            return;
        }
    }
}

async function logout(req, res){
    const ObjectId = req.ObjectId;
    // console.log('i am in profile');
    // console.log(ObjectId);
    const user = await UserModel.findOne({_id: ObjectId});

    if(user){
        res.json({
            user,
        })
    }else{
        res.send({
            message:"some error occured"
        })
    }
}

module.exports = {
    signUp,
    verifyCode,
    signIn,
    logout
};