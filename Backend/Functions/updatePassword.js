const {z} = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { UserModel } = require("../db/db");



async function updatePassword(req, res){
    const ObjectId = req.ObjectId;
    console.log(ObjectId);
    const user = await UserModel.findOne({_id: ObjectId});

    const bodyContent = z.object({
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
    
    const {password} = req.body;
    
    try{
        const hashedPassword = await bcrypt.hash(password, 5);

        await UserModel.updateOne(
            {_id: ObjectId} , {$set:{password: hashedPassword}}
        )
    
        res.json({
            message: "password updated successfully"
        })
    }
    catch(e){
        res.json({
            message: "error in updating password",
            error: e
        });
    }

}

module.exports = {
    updatePassword,
};