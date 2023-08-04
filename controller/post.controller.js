const Post = require("../models/Post");
const User = require("../models/Users");

//create a post
exports.createPost = async (req, res) => {
  try {
    const newPost = new Post({ userId : req.user._id,...req.body});
    const savedPost = await newPost.save();
    const {userId,updatedAt ,likes , comments, __v, ...other} = savedPost._doc
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
}




//delete a post
exports.deletePost =  async (req, res) => {
  try {
    const post = await Post.findById(req.params.id.toString());
    if (post.userId === req.user._id.toString()) {
      await post.deleteOne();
      res.status(200).json("Post Successfully Deleted");
    } else {
      res.status(403).json("You can delete only your Post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

//like a post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.user._id)) {
      await post.updateOne({ $push: { likes: req.user._id } });
      res.status(200).json("Post Liked");
    } else {
      res.status(403).json("You have already liked this Post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
}

//unlike a post
exports.unlikePost =  async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.likes.includes(req.user._id)) {
      await post.updateOne({ $pull: { likes: req.user._id } });
      res.status(200).json("Post UnLiked");
    } else {
      res.status(403).json("You have already unliked this Post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
}


//comment on a Post
exports.commentOnPost =  async(req,res)=>{
  try {
    const userPosts = await Post.findById(req.params.id);
    // const comment = new Post.comment
    await userPosts.updateOne({ $push: { comments : {UserId : req.user._id , comment : req.body.comment }}});
    // await user
    userPosts.save()
    res.status(200).json({UserId : req.user._id , comment : req.body.comment });
  } catch (err) {
    res.status(500).json(err);
  }
}






//get a Post
exports.getPost =  async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const {userId,updatedAt ,title,description,createdAt, __v, ...other} = post._doc
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
}


//get all posts
exports.allPosts = async (req, res)=>{
    const allPost = await Post.find({userId : req.user._id})
    if (!allPost){
        res.json("No post found")
    }
    else{
        let allposts  =[]
        for(let i = 0 ; i<allPost.length ; i++){
            const {userId,updatedAt , __v, ...other} = allPost[i]._doc
            allposts.push(other)
        }
        return res.json(allposts)
    }
    

    
  }

