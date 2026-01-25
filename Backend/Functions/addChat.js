const { UserModel, ChatModel, MessageModel } = require("../db/db");
const mongoose = require("mongoose");

async function addChat(req,res){

    try{
        const userId = req.ObjectId;
        const {chatUsername} = req.body;

        const currentUser = await UserModel.findById(userId);
        const chatUser = await UserModel.findOne({ username: chatUsername });

        if(!chatUser){
            return res.json({
                message: "User not found"
            })
        }

        if (chatUser._id.equals(userId)) {
            return res.json({
                message: "Cannot chat with yourself" 
            });
        }

        const existingChat = await ChatModel.findOne({
            isGroup: false,
            participants: { $all: [userId, chatUser._id]}
        });

        if (existingChat) {
            return res.json({ chat: existingChat });
        }

        const chat = await ChatModel.create({
            name:currentUser.username+"-"+chatUser.username,
            isGroup: false,
            participants: [userId, chatUser._id]
        });

        res.json({
            chat
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message: "Failed to create chat"
        });
    }
}

module.exports = {
    addChat,
};