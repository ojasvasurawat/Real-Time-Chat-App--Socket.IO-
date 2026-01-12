import { UserModel } from "../db/db";

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
}

// async function addChat(req,res){
    
// }