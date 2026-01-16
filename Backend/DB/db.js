const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
    displayName:String,
    username:String,
    email:String,
    password:String,
    avatarUrl:String,
    chatList:{type:[Object], default:[]}
})

const Message = new Schema({
    roomId:String,
    sender:String,
    content:String,
    readBy:[
      {
        username: String,
        readAt: Date,
      }
    ],
    },
    {
        timestamps: true,
    }
)

const userModel = mongoose.model('users', User);
const messageModel = mongoose.model('messages', Message);
module.exports={
    UserModel:userModel,
    MessageModel:messageModel
}