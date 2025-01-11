const express = require('express');
const User = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const JWT_SECRET = 'sayan12';


router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExist = await User.findOne({ email });
        console.log("userexist ", userExist);
        if (userExist) {
            return res.json({ message: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        res.json({
            message: 'Registration Successful',
        });
    } catch (error) {
        console.error('server error', error);
        res.json({ message: " register Internal server Error" });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExist = await User.findOne({ email });
        if (!userExist) {
            return res.json({ message: 'User is not Register ' });
        }
        const isPass = await bcrypt.compare(password, userExist.password);
        if (isPass) {
            req.session.user = { 
                email: userExist.email,
                name : userExist.name,
            };
            res.json({ message: 'Login successful' });
        } else {
            res.json({ message: 'password is wrong ' });
        }
    } catch (error) {
        res.json({ message: " Login Internal server Error" });
    }
});


// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Failed to destroy session:', err);
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

// Check authentication route (optional, for checking if the user is authenticated)
router.get('/check', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ authenticated: true });
    } else {
        res.status(401).json({ authenticated: false });
    }
});



module.exports = router;