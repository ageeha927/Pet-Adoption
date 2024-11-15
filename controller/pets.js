const Pet = require("../models/pets");
const asyncWrapper = require("../middleware/async");
const bcrypt = require('bcrypt');
const User = require('../models/users');
const loggedIn = false;
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");


// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "task-manager",
        allowed_formats: ["jpg", "jpeg", "png"],
    },
});
const upload = multer({ storage: storage });


let maximum = 3;
let featured = "Snake";
let searchValue = "";

const startPage = asyncWrapper(async (req, res) => {
    try{
        // Gets the cookies to see if user is logged in, if their an admin, and then checks the email and saves it.
        const loggedIn = req.cookies.loggedIn || false;  
        const loggedInAdmin = req.cookies.administrator; 
        const email = req.cookies.email || "user@Gmail.com"
        const pet = await Pet.find({});
        res.render('index', { 
            pet: pet.slice(0, maximum), loggedIn, loggedInAdmin, email
        });
    }
    catch(error) {
        console.error("Error fetching all pets:", error);
        res.status(500).send("Error fetching all pets");
    }
});

const displayPage = asyncWrapper(async (req, res) => {
    try{
        // finds all pets and displays them
    const pets = await Pet.find({});
    res.render('display', { pets, searchValue: searchValue });  
    }
    catch(error) {
        console.error("Error fetching all pets:", error);
        res.status(500).send("Error fetching all pets");
    }
});

const featuredPets = asyncWrapper(async (req, res) => {
    try {
        // sorts them through thier popularity levels.
        featured = req.body.animal;
        console.log(featured)

        const pet = await Pet.find({ type: featured }).sort({ popularity: -1 });
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.json({ pet: pet.slice(0, maximum) });
        }
        res.render("index", { pet: pet.slice(0, maximum) });
    }
    catch(error) {
        console.error("Error fetching featured pets:", error);
        res.status(500).send("Error fetching featured pets");
    }
});

const searchPets = asyncWrapper(async (req, res) => {
    try{
    let pets;
    let searchValue = req.body.searchBar || "";

    if (searchValue) {
        // Lowers the search value and then lowers the search value on the list created to see if any match.
        const lowercaseSearch = searchValue.toLowerCase();
        pets = (await Pet.find({})).filter(pet => 
            pet.name.toLowerCase() === lowercaseSearch
        );
    } else {
        pets = await Pet.find({});
    }
    res.render('display', { pets, searchValue });
    }
    catch(error) {
        console.error("Error searching for pets:", error);
        res.status(500).send("Error searching for pets");
    } 
});

const petProfile = asyncWrapper(async (req, res) => {
    try{
        const petId = req.query.id;
        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).send('Pet not found');
        }
        res.render('petProfile', { pet, searchValue });
    }
    catch(error) {
        console.error("Error showing pet profile:", error);
        res.status(500).send("Error showing pet profile");
    }
});

const uploader = asyncWrapper(async (req, res) => {
    try{
    res.render('uploadPet');
    }
    catch(error) {
        console.error("Error showing upload form:", error);
        res.status(500).send("Error showing upload form");
    }
});

const addPet = asyncWrapper(async (req, res) => {
    try {
        // Gets the image file, and then saves it as a new pet. 
        const imageUrl = req.file ? req.file.path : null;
        // console.log("Body:", req.body); // log form data
        // console.log("File:", req.file); // log uploaded file
        const petData = {
            ...req.body,
            popularity: 0,
            image_url: imageUrl
        };
        const newPet = new Pet(petData);
        await newPet.save();
        console.log(req.body)
        res.render('submission');
        
    } catch (error) {
        console.error("Error saving pet data:", error);
        res.status(500).send("Error saving pet");
    }
});

const showEmailForm = asyncWrapper(async (req, res) => {
    try{
    res.render('user', { emailSubmitted: false, emailExists: null });
    }
    catch(error) {
        console.error("Error showing email form:", error);
        res.status(500).send("Error showing email form");
    }
});

const handleEmailSubmission = asyncWrapper(async (req, res) => {
    try{
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            res.render('user', { emailSubmitted: true, emailExists: true, email });
        } else {
            res.render('user', { emailSubmitted: true, emailExists: false, email });
        }
    }
    catch(error) {
        console.error("Error handling email submission:", error);
        res.status(500).send("Error handling email submission");
    }
});

const createAccount = asyncWrapper(async (req, res) => {
    try{
        const pets = await Pet.find({});
        const { email, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Email already registered. Please login.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword,
            administrator: false
        });

        await newUser.save();
        // creates the cookies and tells the website that the user has now been logged in. 
        res.cookie('loggedIn', true, { httpOnly: true, maxAge: 86400000 });
        res.redirect("/");
    }
    catch(error) {
        console.error("Error creating account:", error);
        res.status(500).send("Error creating account");
    }
});

const logAccount = asyncWrapper(async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (user && await bcrypt.compare(password, user.password)) {
            // It tells the user its logged in, gets the email, and then sees if the email has admin permissions. 
            res.cookie('loggedIn', true, { maxAge: 3600000 });
            res.cookie('email', email, { maxAge: 3600000 });
            res.cookie('administrator', user.administrator, { maxAge: 3600000 });

            res.redirect("/");
        } else {
            res.send("Invalid email or password");
    }}
    catch(error) {
        console.error("Error logging in:", error);
        res.status(500).send("Error logging in");
    }
});

const logOut = asyncWrapper(async (req, res) => {
    try {
        // clears all cookies
        res.clearCookie('loggedIn');
        res.clearCookie('email');
        res.clearCookie('administrator');
        res.redirect("/");
    } catch (error) {
        console.error("Error clearing cookies:", error);
        res.status(500).send("Error clearing cookies");
    }
});

const dashboard = asyncWrapper(async (req, res) => {
    try {
        const loggedInAdmin = req.cookies.administrator;
        if (loggedInAdmin) {
            res.render('dashboard', { data: null, section: null });
        } else {
            res.status(404).json({ message: "Invalid" });
        }
    }
    catch(error) {
        res.status(500).send("Error fetching dashboard data");
    }
});

const getDashboard = asyncWrapper(async (req, res) => {
    try{
        const loggedInAdmin = req.cookies.administrator;
        if (!loggedInAdmin) {
            return res.status(404).json({ message: "Invalid" });
        }

        let data = null;
        let section = req.body.section;

        if (section === "Pets") {
            data = await Pet.find({ type: "Snake" });
        } else if (section === "Users") {
            data = await User.find({});
        }

        res.render('dashboard', { data, section });
    }
    catch(error) {
        res.status(500).send("Error fetching data");
    }
});

const petSelector = asyncWrapper(async (req, res) => {
    try{
        const { animal } = req.body;

        if (!animal) {
            return res.status(400).json({ message: "No animal type selected" });
        }

        const pets = await Pet.find({ type: animal });

        res.json({ pets });
    }
    catch(error) {
        res.status(500).send("Error fetching pets");
    }
});

const deleteUser = asyncWrapper(async (req, res) => {
    try{
        const loggedInAdmin = req.cookies.administrator;
        if (!loggedInAdmin) {
            return res.status(404).json({ message: "Invalid" });
        }
        const userId = req.params.userId;
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.redirect('/dashboard');
    }
    catch(error) {
        res.status(500).send("Error deleting user");
    }
    
});

const deletePet = asyncWrapper(async (req, res) => {
    try{
        const loggedInAdmin = req.cookies.administrator;
        if (!loggedInAdmin) {
            return res.status(404).json({ message: "Invalid" });
        }
        const petId = req.params.petId;
        const pet = await Pet.findByIdAndDelete(petId);
        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }
        res.redirect('/dashboard');
    }
    catch(error) {
        res.status(500).send("Error deleting pet");
    }
});

const renderEditPetForm = async (req, res) => {
    const petId = req.params.petId;
    try {
        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).send("Pet not found");
        }
        res.render('editPet', { pet });
    } catch (error) {
        res.status(500).send("Error fetching pet details");
    }
};

const updatePetDetails = async (req, res) => {
    const petId = req.params.petId;
    const { name, breed, age, description, behavior, history, type, gender, location } = req.body;
    // Gets the Image file and then saves it
    const imageUrl = req.file ? req.file.path : null; 

    try {
        const petToUpdate = await Pet.findById(petId);
        if (!petToUpdate) {
            return res.status(404).send("Pet not found");
        }

        petToUpdate.name = name;
        petToUpdate.breed = breed;
        petToUpdate.age = age;
        petToUpdate.description = description;
        petToUpdate.behavior = behavior;
        petToUpdate.history = history;
        petToUpdate.type = type;
        petToUpdate.gender = gender;
        petToUpdate.location = location;
        if (imageUrl) {
            petToUpdate.image_url = imageUrl;
        }

        await petToUpdate.save();

        const data = await Pet.find({ type: petToUpdate.type });
        res.redirect('/')
    } catch (error) {
        console.error("Error updating pet:", error);
        res.status(500).send("Error updating pet");
    }
};

module.exports = {
    renderEditPetForm, updatePetDetails, startPage, displayPage, searchPets,
    featuredPets, petProfile, uploader, addPet, showEmailForm, handleEmailSubmission,
    createAccount, logAccount, logOut, dashboard, getDashboard, petSelector, deleteUser, deletePet, upload
};
