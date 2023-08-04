const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/Users");

//create a post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/allpost' ,async (req, res)=>{
  const allPost = await Post.find({})
  return res.json(allPost)
  
})

//update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post Successfully Updated");
    } else {
      res.status(403).json("You can update only your Post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("Post Successfully Deleted");
    } else {
      res.status(403).json("You can delete only your Post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//like a post
router.put("/like/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("Post Liked");
    } else {
      res.status(403).json("You have already liked this Post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//unlike a post
router.put("/unlike/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.likes.includes(req.body.userId)) {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("Post UnLiked");
    } else {
      res.status(403).json("You have already unliked this Post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});


//comment on a Post
router.post('/comment/:id', async(req,res)=>{
    if(!req.body){
      return res.json("empty body ! feild missing")
    }
  try {
    const userPosts = await Post.findById(req.params.id);
    console.log(userPosts)
    // const comment = new Post.comment
    await userPosts.updateOne({ $push: { comments : req.body }});
    // await user
    userPosts.save()
    res.status(200).json(userPosts);
  } catch (err) {
    res.status(500).json(err);
  }
});






//get a Post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});



//get all posts of a User
router.get("/all-posts/:id", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id);
    const userPosts = await Post.find({userId : currentUser._id});
    const friendPosts = await Promise.all(
        currentUser.followings.map(friendId=>{
            console.log(friendId)
           return Post.find({userId : friendId})
           
        }),
    );
    res.json(userPosts.concat(...friendPosts))
    // console.log(userPosts)
  } catch (err) {
    res.status(500).json("error");
  }
});



module.exports = router;
