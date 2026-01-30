const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
    displayName:String,
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    avatarUrl: String,
    chatList: {type:[Object], default:[]}
})

const Chat = new Schema({
    name: String,
    isGroup: {type: Boolean, default: false},
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }]
},{ timestamps: true });

const Message = new Schema({
    chat: {type: mongoose.Schema.Types.ObjectId, ref: 'chats'},
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    content: String,
    avatarUrl: String,
},{ timestamps: true });

const userModel = mongoose.model('users', User);
const chatModel = mongoose.model('chats', Chat);
const messageModel = mongoose.model('messages', Message);
module.exports={
    UserModel:userModel,
    ChatModel:chatModel,
    MessageModel:messageModel
}