const User = require('../models/Users')
const bcrypt = require("bcrypt")

//follow a user
exports.follow = async(req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push : {followers : req.body.userId} })
                await currentUser.updateOne({$push : {followings : req.params.id} })
                res.status(200).json("User has been Followed")
            }else{
                res.status(403).json("You are already a Follower")
            }
        }
        catch(err){
            return res.status(500).json(err);
        }
    }else{
        res.status(403).json("You can't follow yourself");
    }
    
}

//unfollow a user
exports.unfollow = async(req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull : {followers : req.body.userId} })
                await currentUser.updateOne({$pull : {followings : req.params.id} })
                res.status(200).json("User has been Unfollowed")
            }else{
                res.status(403).json("You don't follow this user ")
            }
        }
        catch(err){
            return res.status(500).json(err);
        }
    }else{
        res.status(403).json("You can't unfollow yourself");
    }
    
}

//get a user
exports.userProfile =  async(req,res)=>{
    try{
        
        //to get only necessary files
        // const {password,updatedAt ,_id,email,createdAt,__v, ...other} = user._doc
        res.status(200).json(req.user)
    }
    catch(err){
        return res.status(500).json(err);
    }
}




