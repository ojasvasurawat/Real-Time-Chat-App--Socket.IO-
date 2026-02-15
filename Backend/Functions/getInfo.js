const { UserModel, ChatModel, MessageModel } = require("../DB/db");
const mongoose = require("mongoose");

async function getInfo(req, res){
    try{
        const userId = req.ObjectId;
        const user = await UserModel.findById(userId);
        res.json({
            user:user
        })
    }
    catch(err){
        // console.log(err);
        res.json({
            message: "errorn in get profile",
            error: err
        })
    }
}

module.exports = {
    getInfo,
};