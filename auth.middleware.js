const User = require('./models/Users')
var jwt = require('jsonwebtoken');

exports.checkuserauth = async (req,res ,next)=>{
    const {authorization} = req.headers
    if(authorization){
        try {
            const {userID} = jwt.verify(authorization, process.env.JWT_SECRET_KEY)
            const user = await User.findById(userID)
            const {password,updatedAt ,createdAt,__v, ...other} = user._doc
            req.user = other;
            next()
        } 
        catch (error) {
            res.status(500).json({"status":"failed", "message": error.message ||"Unauthorized User" });
        }
    }
    if(!authorization){
        res.status(401).json({"status":"failed", "message": "No token or incorrect format, inside header write - Authorization  : eyJhbGciOiJIUzI1..............." });
    }
}