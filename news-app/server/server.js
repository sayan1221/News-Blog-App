const express = require('express');
const app = express();
const model = require('./models/user-model');
const connectDb = require('./db.js');
const router = require('./routes/authRoutes.js')
const profile_router = require('./routes/Profile_rout.js');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session'); // Import express-session


const PORT = 5000;
const allowedOrigin = 'http://localhost:3000';
app.use(bodyParser.json());
app.use(cors({
    origin: allowedOrigin,
    credentials: true,
}));

// Session middleware configuration
app.use(session({
    secret: 'sayan12', // Replace with your secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// app.use(express.json());

app.use('/auth', router);
app.use('/auth', profile_router);

const server_start = async () => {
    try {
        await connectDb();
        app.listen(PORT, () => {
            console.log(`server is running at port : ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server: ", error);
    }
}
server_start();

