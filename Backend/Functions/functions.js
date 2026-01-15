const { UserModel } = require("../db/db");

async function getChatList(req,res){
    const ObjectId = req.ObjectId;
    const user = await UserModel.findOne({_id: ObjectId});
    console.log(user);
    const chatList = user.chatList;
    if(user){
        res.json({
            chatList
        })
    }
    else{
        res.status(404).send("user is not authenticated")
    }
}

async function addChat(req,res){
    const ObjectId = req.ObjectId;
    const user = await UserModel.findOne({_id: ObjectId});
    console.log(user);
    const {chatUsername} = req.body;
    chatUser = await UserModel.findOne({username: chatUsername});
    if(!chatUser){
        res.json({
            message: "user not found"
        });
    }
    if( user.chatList.find(u => u.chatUsername === chatUsername) ){
        res.status(404).send("chat already exists")
        return;
    }
    const roomId = user.username+"-"+chatUsername
    user.chatList.push({chatUsername: chatUsername, roomId: roomId});
    chatUser.chatList.push({chatUsername: user.username, roomId: roomId});
    const chatList = user.chatList;
    const chatUserChatList = chatUser.chatList;
    await UserModel.updateOne({_id: ObjectId}, {$set:{chatList: chatList}});
    await UserModel.updateOne({_id: chatUser._id}, {$set:{chatList: chatUserChatList}});
    res.json({ chatList, chatUserChatList });
}


// i think this should happen in frontend in on click logic
// async function enterRoom(req, res){
//     const ObjectId = req.ObjectId;
//     const user = await UserModel.findOne({_id: ObjectId});
//     console.log(user);
//     const {roomId} = req.body;
//     const socket = io('http://localhost:3000');
//     socket.emit('join', roomId);
//     res.json({
//         message:"joined room successfuly"
//     })
// }

module.exports = {
    getChatList,
    addChat,
};