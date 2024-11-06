const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const pets = require("./routes/petActions");
const port = process.env.PORT || 5001;
const cookieParser = require('cookie-parser');
app.use(cookieParser('password')); 

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.set('view engine', 'ejs'); 


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
