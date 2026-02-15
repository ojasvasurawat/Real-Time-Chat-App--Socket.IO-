const {z} = require("zod");
const mongoose = require("mongoose");
const { UserModel } = require("../DB/db");




async function updateDisplayname(req, res){
    const ObjectId = req.ObjectId;
    // console.log(ObjectId);
    const user = await UserModel.findOne({_id: ObjectId});
    // console.log(user);

    const bodyContent = z.object({
        displayName : z.string().min(3).max(50),
    }).strict();
    
    const check = await bodyContent.safeParseAsync(req.body);
    
    if(!check.success){
        res.status(400).json({
            message: "incorrect format",
            error: check.error
        });
        return;
    }
    
    const {displayName} = req.body;
    
    try{
        await UserModel.updateOne(
            {_id: ObjectId} , {$set:{ displayName: displayName}}
        )
    
        res.json({
            message: "display name updated successfully"
        })
    }
    catch(e){
        res.json({
            message: "error in updating display name",
            error: e
        });
    }

}

module.exports = {
    updateDisplayname,
};