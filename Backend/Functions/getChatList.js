const { UserModel, ChatModel, MessageModel } = require("../db/db");
const mongoose = require("mongoose");

async function getChatList(req,res){

    try{
        const userId = req.ObjectId;
        const chats = await ChatModel.find({participants: userId}).populate("participants", "username, avatarUrl, displayName").sort({updatedAt: -1});
        res.json({
            chats
        });
    }
    catch(err){
        console.log(err)
        res.json({
            message:"Failed to fetch chat list.", 
            error: err
        });
    }
}

module.exports = {
    getChatList,
};