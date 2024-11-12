const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const pets = require("./routes/petActions");
const port = process.env.PORT || 5001;
const cookieParser = require('cookie-parser');
const path = require('path');
app.use(cookieParser('password')); 

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
