const router = require("express").Router();
const { checkuserauth } = require("../auth.middleware");
const { signup, authenticate } = require("../controller/auth.controller");
const { createPost, deletePost, like, likePost, allPosts, unlikePost, commentOnPost, getPost } = require("../controller/post.controller");
const { follow, unfollow, userProfile } = require("../controller/user.controller");


router.use('/user' , checkuserauth)
router.use('/posts' , checkuserauth)
// router.use('/posts/:id' , checkuserauth)
router.use('/like/' , checkuserauth)
router.use('/unlike/' , checkuserauth)
router.use('/comment' , checkuserauth)
router.use('/all_posts' , checkuserauth)
router.use('/follow/' , checkuserauth)
router.use('/unfollow/' , checkuserauth)


// signup & authenticatin

router.post('/signup' , signup)
router.post('/authenticate' , authenticate)

// user
router.post('/follow/:id' , follow)
router.post('/unfollow/:id' ,unfollow )
router.get('/user' , userProfile)


// post
router.post('/posts/' , createPost)
router.delete('/posts/:id' , deletePost)
router.post('/like/:id' , likePost)
router.post('/unlike/:id' , unlikePost)
router.post('/comment/:id' , commentOnPost)
router.get('/posts/:id' , getPost)
router.get('/all_posts' , allPosts)



module.exports = router;