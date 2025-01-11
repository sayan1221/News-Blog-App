const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    email:{
        type:String,
        require:true,
    },
    name:{
        type:String,
        require:true,
    },
    blog_topic:{
        type:String,
        require:true,
    },
    date: {
        type: Date,
        default: Date(),
    },

});

const Blog = mongoose.model('Blog_topic',blogSchema);
module.exports = Blog;