const Pet = require("../models/pets")
const asyncWrapper = require("../middleware/async");
const bcrypt = require('bcrypt');
const User = require('../models/users');



// Change the amount of pets displayed in the home page
let maximum = 3
let featured = "Snake"
let searchValue = ""

// Home Page
const startPage = asyncWrapper(async (req,res) => {
    const pets = await Pet.find({});
    // console.log(pets)
    console.log(pets)
    res.render('index', { pets: pets.slice(0,maximum) });


})

const displayPage = asyncWrapper(async (req,res) => {
    const pets = await Pet.find({});
    // console.log(pets)
    res.render('display', {pets, searchValue: ""});
});

const featuredPets = asyncWrapper(async (req, res) => {
    featured = req.body.animal;
    const pets = await Pet.find({ type: featured }).sort({ popularity: -1 });
    // console.log(featured);
    // this was explained in index, but it basically checks and makes sure both of these values are requested by the client side, and then it runs the code to send the json over.
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({ pets: pets.slice(0,maximum) });
    }

    res.render("index", { pets: pets.slice(0,maximum) });
});


// const displayPage = asyncWrapper(async (req, res) => {
//     const { sortBy } = req.query;  // Get sorting parameter from query string
//     let sortCriteria = {};

//     // Set sorting criteria based on the user's selection
//     if (sortBy === 'popularity') {
//         sortCriteria = { popularity: -1 }; // Sort by popularity in descending order
//     } else if (sortBy === 'age') {
//         sortCriteria = { age: 1 }; // Sort by age in ascending order
//     } else if (sortBy === 'location') {
//         sortCriteria = { location: 1 };
//     }

//     const pets = await Pet.find({}).sort(sortCriteria);
//     res.render('display', { pets, searchValue: "" });
// });



// Display Page
const searchPets = asyncWrapper(async (req, res) => {
    if(req.body.searchBar){
    // b insures the first letter of each word, w matches each "word character", and then g stands for global, meaning it goes through the entire string. After all of this, it uppercases it. / reperesents the start of the regex, or string. 
    const searchName = req.body.searchBar ? req.body.searchBar.replace(/\b\w/g, char => char.toUpperCase()) : null;
    const pets = await Pet.find({name:searchName});
    searchValue = (req.body.searchBar) ? req.body.searchBar : "";
    // console.log(searchName)
    // console.log(req.body)
    // console.log(pets)
    res.render('display', {pets, searchValue:searchValue})
    }else{
        const pets = await Pet.find({});
        const searchValue = "";
        res.render('display', {pets, searchValue})
    }
});

const petProfile = asyncWrapper(async (req, res) => {
    const petId = req.query.id;
    const pet = await Pet.findById(petId);
    if (!pet) {
        return res.status(404).send('Pet not found');
    }
    res.render('petProfile', { pet, searchValue:searchValue });
});

// Pet Uploader
const upload = asyncWrapper(async (req, res) => {
    res.render('uploadPet');
});

const addPet = asyncWrapper(async (req, res) => {
    const petData = {
        ...req.body,
        popularity: 0
    };

    const newPet = new Pet(petData);
    newPet.save()
    res.render('submission')
});
let loggedUser = false;
    let count = false;
const user = asyncWrapper(async (req, res) => {
    res.render('user'); // Render the user registration form
});


const userData = asyncWrapper(async (req, res) => {
    
    let { email } = req.body;
    email = email.toLowerCase();

    console.log(email); // Log email for debugging

    // Check if the user already exists
    const user = await User.findOne({ email });
    if (user) {
        loggedUser = true;
        count = true;
    } else {
        count = true;
    }

    // Render the user page with `loggedUser` and `count` values
    res.render("user", { loggedUser:loggedUser, count:count });
});



module.exports = {startPage, displayPage, searchPets, featuredPets, petProfile, upload, addPet, user, userData};
