const { UserModel, ChatModel, MessageModel } = require("../DB/db");
const mongoose = require("mongoose");

// Require the cloudinary library
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const storage = multer.memoryStorage();
const upload = multer({ storage });


// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true
});
cloudinary.config();

// Log the configuration



/////////////////////////
// Uploads an image file
/////////////////////////
const uploadImage = async (imagePath) => {

    // Use the uploaded file's name as the asset's public ID and 
    // allow overwriting the asset with new versions
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    try {
      // Upload the image
      const result = await cloudinary.uploader.upload(imagePath, { 
        use_filename: true});
      console.log(result);
      return result.public_id;
    } catch (error) {
      console.error("the error is:",error);
    }
};


async function addProfilePicture(req, res){
    const ObjectId = req.ObjectId;
    // console.log('i am in profile');
    console.log(ObjectId);
    const user = await UserModel.findOne({_id: ObjectId});
    console.log(user);

    const {avatarUrl} = req.body; 

    try {

        const result = await cloudinary.uploader.upload(avatarUrl, {
        folder: 'realTimeChatAppAvatars',
        });

        await UserModel.updateOne(
            {_id: ObjectId} , {$set:{ avatarUrl: result.secure_url}}
        )

        res.json({ url: result.secure_url });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Failed to upload image' });
    }
}

module.exports = {
    addProfilePicture,
};