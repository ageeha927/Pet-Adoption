const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const pets = require("./routes/petActions");
const port = process.env.PORT || 5001;
const cookieParser = require('cookie-parser');
const path = require('path');
app.use(cookieParser('password')); 

// const cloudinary = require('cloudinary').v2;

// // Connect to cloudinary
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//   });



// Middleware
app.set('view engine', 'ejs'); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Use pets routes
app.use('/', pets); 

// app.get("/", (req, res) => {
//     res.render("index");
// });


// Initialize server
const serverInit = async () => {
    try {
        await connectDB();
        console.log('Database connected');
        app.listen(port, () => console.log('Server running on port ' + port));
    } catch (error) {
        console.error('Error connecting to database:', error.message);
    }
};

serverInit();
