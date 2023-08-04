const express = require('express')
const app = express();
const mongoose = require('mongoose')
const morgan = require('morgan')
const dotenv = require('dotenv')
const helmet = require('helmet');
const router = require('./routes/route');


dotenv.config();

mongoose.connect(process.env.MONGO_URL,
    {useNewUrlParser:true,useUnifiedTopology : true},)
    .then(()=>
    console.log("Connected to MongoDB"))
    .catch((err)=>{
        console.log(err);
    });

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));


app.use('/api', router);




app.listen(8000,()=>{
    console.log("Backend is running!")
})