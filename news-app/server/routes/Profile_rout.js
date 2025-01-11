const express = require('express');
const User = require('../models/user-model');
const Topic = require('../models/Topic-model');
const Blog = require('../models/Blog-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const profile_router = express.Router();


const verifySession = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'Login Failed' });
    }
};

const check = async () => {
        try {
            const response = await fetch('http://localhost:5000/auth/check', {
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Include credentials in the request
            });
            if (!response) {
                const data = await response.json();
                setLogin(false);
            }
            setLogin(true);
        } catch (err) {
            console.error("Failed to update value", err);
            setLogin(false);
        }
    }

// Protected profile route
profile_router.get('/profile', verifySession, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.session.user.email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ email: user.email, name: user.name });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// update password
profile_router.post('/update_pass', verifySession, async (req, res) => {
    // console.log("come into update pass");
    try {
        const { oldPass, newPass } = req.body;
        const userExist = await User.findOne({ email: req.session.user.email });
        if (!userExist) {
            return res.json({ message: 'User not found' });
        }
        // console.log(userExist.password,oldPass,newPass,);
        const isPass = await bcrypt.compare(oldPass, userExist.password);
        if (!isPass) {
            return res.status(200).json({ message: 'Old password is incorrect' });
        }

        userExist.password = await bcrypt.hash(newPass, 10);
        await userExist.save();
        res.status(200).json({ message: 'Password updated successfully' });

    } catch (err) {
        console.error('fail to update', err);
    }
});


// add topic ...............
profile_router.post('/add_topic', verifySession, async (req, res) => {
    try {
        const { email, add_data } = req.body;
        const userExist = await User.findOne({ email: req.session.user.email });
        if (!userExist) {
            return res.json({ message: 'User not found' });
        }
        const newTopic = new Topic({
            email: req.session.user.email,
            topic_name: add_data,
        });
        await newTopic.save();
        res.json({
            message: 'Topic save Successful',
        });
    } catch (err) {
        console.error("NOT ADD data ", err);
    }
});


// fetch topic data
profile_router.get('/get_topic', verifySession, async (req, res) => {
    try {
        const topic = await Topic.find({ email: req.session.user.email });
        if (!topic || topic.length === 0) {
            return res.status(404).json({ message: "no topic found" });
        }
        res.json(topic);
    } catch (error) {
        console.error('Error fetching topic datA:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


profile_router.delete('/delete_topic/:id', verifySession, async (req, res) => {
    try {
        console.log('Delete topic route hit');
        const topicId = req.params.id;
        // console.log(`Topic ID: ${topicId}`);
        const del_topic = await Topic.findOneAndDelete({ _id: topicId, email: req.session.user.email });
        if (!del_topic) {
            return res.status(404).json({ message: "Topic not found" });
        }
        res.json({ message: 'Topic delete successfully' });
    } catch (err) {
        console.error('Error failed to delete topic ', err);
        res.status(500).json({ message: req.params.id });
    }
});


// fatch blog ................
profile_router.get('/fetch_blog', verifySession, async (req, res) => {
    try {
        const get_blog = await Blog.find();
        if (get_blog === 0 || !get_blog) {
            return res.json({ message: 'Blog not found' });
        }
        res.json(get_blog);
    } catch (err) {
        console.error("Blog error in backend side : ", err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// fetch my_blog.............
profile_router.get('/my_blog', verifySession, async (req, res) => {
    try {
        console.log('handel come to fetch my blog backend')
        const get_blog = await Blog.find({ email: req.session.user.email });
        if (!get_blog) {
            return res.json({ message: 'Blog not found' });
        }
        console.log(get_blog);
        res.json(get_blog);
    } catch (err) {
        console.error('My_Blog not found', err);
        res.status(500).json({ message: 'Blog is not present' })
    }
});

// add blog to database ..............
profile_router.post('/add_blog', verifySession, async (req, res) => {
    try {
        const userExist = await User.findOne({ email: req.session.user.email });
        if (!userExist) {
            return res.json({ message: 'User not found' });
        }
        // console.log("name not present",req.session.user.email);
        const { textBlog } = req.body;
        console.log("backend ", textBlog);
        const new_blog = new Blog({
            email: req.session.user.email,
            name: req.session.user.name,
            blog_topic: textBlog,
        });
        await new_blog.save();
        return res.json({ message: 'Topic save Successful' });
    } catch (err) {
        console.error("add blog fail in backend", err);
    }
});

// update my blog ...................
profile_router.post('/update_myBlog', verifySession, async (req, res) => {
    try {
        const userExist = await User.findOne({ email: req.session.user.email });
        if (!userExist) {
            return res.json({ message: 'User not found' });
        }
        // console.log('user :',userExist);
        const { data, id } = req.body;
        // console.log(id,data);
        const present = await Blog.findOne({ _id: id });
        console.log('Present : ', present)
        if (!present) {
            return res.json({ message: 'Blog is not availabe' });
        }
        present.blog_topic = data;
        await present.save();
        req.json({ message: 'Blog update Successful' });
    } catch (err) {
        return res.json({ message: err });
    }
});

// delete my blog .............
profile_router.delete('/delete_blog/:id',verifySession, async(req,res)=>{
    try{
        const userExist = await User.findOne({email:req.session.user.email});
        if(!userExist){
            return res.json({message:'user not found'});
        }
        const delId = req.params.id;
        const del_blog = await Blog.findOneAndDelete({_id:delId});
        if (!del_blog) {
            return res.status(404).json({ message: "Topic not found" });
        }
        res.json({ message: 'Topic delete successfully' });
        console.log(del_blog)
    }catch(err){
        return res.json({message:err});
    }
});


module.exports = profile_router;