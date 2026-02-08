const { UserModel, ChatModel, MessageModel } = require("../DB/db");
const mongoose = require("mongoose");

async function addChat(req,res){

    try{
        const userId = req.ObjectId;
        const {chatUsername} = req.body;

        const currentUser = await UserModel.findById(userId);
        const chatUser = await UserModel.findOne({ username: chatUsername });

        if(!chatUser){
            return res.json({
                message: "User does not exist"
            })
        }

        if (chatUser._id.equals(userId)) {
            return res.json({
                message: "You cannot start a conversation with yourself" 
            });
        }

        const existingChat = await ChatModel.findOne({
            isGroup: false,
            participants: { $all: [userId, chatUser._id]}
        });

        if (existingChat) {
            return res.json({ message: "A conversation with this user already exists" });
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