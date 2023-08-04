const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema(
    {
        userId :{
            type : String,
            require : true
        },
        title : {
            type : String,
            require : true,
            max : 50
        },
        description : {
            type : String,
            max : 750
        },
        likes : {
            type : Array,
            default : []
        },
        comments: {
            type : Array,
            default : []
        }

    
    },
{timestamps:true}
);


module.exports = mongoose.model("Post",PostSchema);

