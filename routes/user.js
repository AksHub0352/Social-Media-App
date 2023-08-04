const router = require("express").Router();
const User = require('../models/Users')
const bcrypt = require("bcrypt")

//update a user
router.put("/:id", async(req,res)=>{
    if(req.body.userId === req.params.id){
        if(req.body.password){
            //password updated
            try{
                const salt = await bcrypt.genSalt(12);
                req.body.password = await bcrypt.hash(req.body.password,salt);

            }catch(err){
                return res.status(500).json(err);
            }
        }
        try{
            //updating user
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set : req.body,
            })
            res.status(200).json("Account Updated")
        }
        catch(err){
            return res.status(500).json(err);
        }
    }
    else{
        return res.status(403).json("Id not found");
    }
})

//delete a user
router.delete("/:id", async(req,res)=>{
    if(req.body.userId === req.params.id){
        try{
            //updating user
            const user = await User.findByIdAndDelete(req.params.id)
           
            res.status(200).json("Account Deleted")
        }
        catch(err){
            return res.status(500).json(err);
        }
    }
    else{
        return res.status(403).json("No Id Found");
    }
})


//get a user
router.get('/:id', async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        //to get only necessary files
        const {password,updatedAt ,_id,email,createdAt,__v, ...other} = user._doc
        res.status(200).json(other)
    }
    catch(err){
        return res.status(500).json(err);
    }
})

//follow a user
router.put("/follow/:id" , async(req,res)=>{
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
    
})

//unfollow a user
router.put("/unfollow/:id" , async(req,res)=>{
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
    
})






module.exports = router
