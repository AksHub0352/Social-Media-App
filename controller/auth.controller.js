const User = require("../models/Users");
const bcrypt = require("bcrypt")


//register a user
exports.signup = async(req,res)=>{
    try{
        //hash password
        const salt = await bcrypt.genSalt(12);
        const hashedpassword = await bcrypt.hash(req.body.password,salt);
        //create new user
        const newUser = new User({
            userName : req.body.username,
            email : req.body.email,
            password : hashedpassword
        });

        //save and return response
        const user = await newUser.save();
        res.status(200).json(user);
    }

       catch(err){
        res.status(500).json(err);
       }
    

   
};


//Authentication
exports.authenticate = async(req,res)=>{
    console.log(req.body)
    try{
        const user = await User.findOne({email : req.body.email})
        !user && res.status(404).json("User not Found");

        const validPassword =  bcrypt.compare(req.body.password,user.password)
        !validPassword &&  res.status(400).json("Invalid Password");

        const token = jwt.sign({ userID: user._id },
            process.env.JWT_SECRET_KEY, { expiresIn: '10d' })
        return res.status(200).json({ status: "success", message: "user login successfully", token : token })
    }
    catch(err){
        console.log(err);
    }
    
};