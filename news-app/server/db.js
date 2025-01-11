const mongoose = require('mongoose');

const URL = 'mongodb://127.0.0.1:27017/news_app';
const connectDb = async()=>{
    try{
        await mongoose.connect(URL);
        console.log("Connection Successful");
    }catch(error){
        console.log("Database Connection fieled",error);
        process.exit(0);
    }
}

module.exports = connectDb;