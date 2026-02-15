const { UserModel, ChatModel, MessageModel } = require("../DB/db");
const mongoose = require("mongoose");

async function getChatMessages(req,res){

    try{
        const userId = req.ObjectId;
        const {chatId} = req.query;

        if (!mongoose.Types.ObjectId.isValid(chatId)) {
            return res.json({ message: "Invalid chatId" });
        }

        const chat = await ChatModel.findOne({
            _id: chatId,
            participants: userId
        }).populate("participants", "username avatarUrl displayName");

        if(!chat){
            return res.json({ message: "you are not in this chat"})
        }

        const messages = await MessageModel.find({
            chat: chatId
        }).populate("sender", "username displayName avatarUrl").sort({ createdAt: 1});

        res.json({
            chat,
            messages
        })
    }
    catch(err){
        // console.log(err)
        res.json({
            message: "Error occure while fetching messages",
            error: err
        })
    }
}

module.exports = {
    getChatMessages,
};