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

const userModel = mongoose.model('users', User);
module.exports={
    UserModel:userModel,
}