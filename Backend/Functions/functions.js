const { UserModel, ChatModel, MessageModel } = require("../db/db");
const mongoose = require("mongoose");

async function getChatList(req,res){

    try{
        const userId = req.ObjectId;
        const chats = await ChatModel.find({participants: userId}).populate("participants", "username, avatarUrl").sort({updatedAt: -1});
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
        });

        if(!chat){
            return res.json({ message: "you are not in this chat"})
        }

        const messages = await MessageModel.find({
            chat: chatId
        }).populate("sender", "username displayName avatarUrl").sort({ createAt: 1});

        res.json({
            messages
        })
    }
    catch(err){
        console.log(err)
        res.json({
            message: "Error occure while fetching messages",
            error: err
        })
    }
}

async function createGroup(req,res){
    try{
        const userId = req.ObjectId;
        const {groupName, participantUsernames} = req.body;

        const participants = await UserModel.find({
            username: { $in: participantUsernames}
        });
        const participantIds = participants.map(user => user._id);
        participantIds.push(userId);

        const groupChat = await ChatModel.create({
            name: groupName,
            isGroup: true,
            participants: participantIds
        });

        res.json({
            chat: groupChat
        })
    }
    catch(err){
        console.log(err);
        res.json({
            message: "error in creating group",
            error: err
        })
    }
}

async function getProfile(req, res){
    try{
        const userId = req.ObjectId;
        const user = await UserModel.findById(userId);
        res.json({
            user:user
        })
    }
    catch(err){
        console.log(err);
        res.json({
            message: "errorn in get profile",
            error: err
        })
    }
}


module.exports = {
    getChatList,
    addChat,
    getChatMessages,
    createGroup,
    getProfile
};