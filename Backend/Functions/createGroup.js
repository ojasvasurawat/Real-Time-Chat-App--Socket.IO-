const { UserModel, ChatModel, MessageModel } = require("../DB/db");
const mongoose = require("mongoose");

async function createGroup(req,res){
    try{
        const userId = req.ObjectId;
        const {groupName, participantUsernames} = req.body;

        const participants = await UserModel.find({
            username: { $in: participantUsernames}
        });

        if(participants.length !== participantUsernames.length){
            return res.json({
                message: "Some usernames are invalid"
            })
        }

        const participantIds = participants.map(user => user._id);

        if (participantIds.some(id => id.toString() === userId.toString())) {
            return res.json({
                message: "Please remove your name from list"
            });
        }
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
        // console.log(err);
        res.json({
            message: "error in creating group",
            error: err
        })
    }
}

module.exports = {
    createGroup,
};