const Pet = require("../models/pets")
const asyncWrapper = require("../middleware/async");
const bcrypt = require('bcrypt');
const User = require('../models/users');
const loggedIn = false;


// Change the amount of pets displayed in the home page
let maximum = 3
let featured = "Snake"
let searchValue = ""

const startPage = asyncWrapper(async (req, res) => {
    // Get cookies
    const loggedIn = req.cookies.loggedIn || false;  // Check if loggedIn cookie exists
    const loggedInEmail = req.cookies.email || '';   // Get email cookie if logged in

    const pets = await Pet.find({});
    // Render the 'index' page with the logged-in status and email if logged in
    res.render('index', { 
        pets: pets.slice(0, maximum),
        loggedIn: loggedIn, 
        loggedInEmail: loggedInEmail // Pass the loggedInEmail to the template
    });
});
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

// const user = asyncWrapper(async (req, res) => {
//     res.render('user', {loggedUser: null}); // Render the user registration form
// });

// const userData = asyncWrapper(async (req, res) => {
//     const { email, password } = req.body; // Destructure email and password from request body

//     if (!password) {
//         return res.status(400).send('Password is required'); // Validate password
//     }

//     console.log(email); // Log email for debugging

//     // Check if the user already exists
//     const user = await User.findOne({ email });
//     if (user) {
//         return res.status(400).send('User already exists');
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

//     // Create a new user instance
//     const newUser = new User({ 
//         email, 
//         password: hashedPassword, 
//         administrator: false // Use boolean value
//     });

//     // Save the new user to the database
//     await newUser.save();
//     console.log("User saved to database")
    
//     // Respond with a success message
//     res.status(201).send('User created successfully');
// });

const showEmailForm = asyncWrapper(async (req, res) => {
    res.render('user', { emailSubmitted: false, emailExists: null }); // Initial render
});

// Step 2: Handle email submission
const handleEmailSubmission = asyncWrapper(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        res.render('user', { emailSubmitted: true, emailExists: true, email });
    } else {
        res.render('user', { emailSubmitted: true, emailExists: false, email });
    }
});

const createAccount = asyncWrapper(async (req, res) => {
    const pets = await Pet.find({});
    const { email, password } = req.body;
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).send('Email already registered. Please login.');
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
        email,
        password: hashedPassword,
        administrator: false
    });

    await newUser.save();
    
    // Set a cookie indicating the user is logged in
    res.cookie('loggedIn', true, { httpOnly: true, maxAge: 86400000 }); // 1 day expiration

    res.redirect("/");  // Redirect to homepage after successful account creation
});
const logAccount = asyncWrapper(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (user && await bcrypt.compare(password, user.password)) {
        // Set cookies when user logs in
        res.cookie('loggedIn', true, {maxAge: 3600000});
        res.cookie('email', email, {maxAge: 3600000 });

        res.redirect("/");  // Redirect to homepage after successful login
    } else {
        res.send("Invalid email or password");
    }
});

const logOut = asyncWrapper(async (req,res) =>{
    res.clearCookie('loggedIn');
    res.clearCookie('email');
    res.redirect("/"); 

})
module.exports = {startPage, displayPage, searchPets, featuredPets, petProfile, upload, addPet, showEmailForm, handleEmailSubmission, createAccount, logAccount,logOut};
