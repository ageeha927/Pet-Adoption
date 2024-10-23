const express = require('express');

const app = express();
const pets = require('./routes/pets');
const connectDB = require('./db/connect');
const port = process.env.PORT | 3000;

//Libraries
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

const serverInit = async () => {
    try {
        await connectDB();
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.log(error);
    }
}

serverInit();