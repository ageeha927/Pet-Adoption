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
    const loggedIn = req.cookies.loggedIn || false;  
    const loggedInAdmin = req.cookies.administrator; 
    const email = req.cookies.email || "undefined@undefined.com"
    const pet = await Pet.find({});
    res.render('index', { 
        pet: pet.slice(0, maximum), loggedIn, loggedInAdmin, email
    });
});

const displayPage = asyncWrapper(async (req, res) => {
    const pets = await Pet.find({});
    res.render('display', { pets, searchValue: "" });  // Change 'pet' to 'pets'
});

const featuredPets = asyncWrapper(async (req, res) => {
    featured = req.body.animal;
    const pet = await Pet.find({ type: featured }).sort({ popularity: -1 });
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({ pet: pet.slice(0, maximum) });
    }
    res.render("index", { pet: pet.slice(0, maximum) });
});

const searchPets = asyncWrapper(async (req, res) => {
    let pets;
    let searchValue = req.body.searchBar || "";

    if (searchValue) {
        const lowercaseSearch = searchValue.toLowerCase();
        pets = (await Pet.find({})).filter(pet => 
            pet.name.toLowerCase() === lowercaseSearch
        );
    } else {
        pets = await Pet.find({});
    }
    res.render('display', { pets, searchValue });
});

const petProfile = asyncWrapper(async (req, res) => {
    const petId = req.query.id;
    const pet = await Pet.findById(petId);
    if (!pet) {
        return res.status(404).send('Pet not found');
    }
    res.render('petProfile', { pet, searchValue });
});

const uploader = asyncWrapper(async (req, res) => {
    res.render('uploadPet');
});

const addPet = asyncWrapper(async (req, res) => {
    try {
        const imageUrl = req.file ? req.file.path : null;
        console.log("Body:", req.body); // log form data
        console.log("File:", req.file); // log uploaded file
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
    res.render('user', { emailSubmitted: false, emailExists: null });
});

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
    
    res.cookie('loggedIn', true, { httpOnly: true, maxAge: 86400000 });
    res.redirect("/");
});

const logAccount = asyncWrapper(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (user && await bcrypt.compare(password, user.password)) {
        res.cookie('loggedIn', true, { maxAge: 3600000 });
        res.cookie('email', email, { maxAge: 3600000 });
        res.cookie('administrator', user.administrator, { maxAge: 3600000 });

        res.redirect("/");
    } else {
        res.send("Invalid email or password");
    }
});

const logOut = asyncWrapper(async (req, res) => {
    res.clearCookie('loggedIn');
    res.clearCookie('email');
    res.clearCookie('administrator');
    res.redirect("/");
});

const dashboard = asyncWrapper(async (req, res) => {
    const loggedInAdmin = req.cookies.administrator;
    if (loggedInAdmin) {
        res.render('dashboard', { data: null, section: null });
    } else {
        res.status(404).json({ message: "Invalid" });
    }
});

const getDashboard = asyncWrapper(async (req, res) => {
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
});

const petSelector = asyncWrapper(async (req, res) => {
    const { animal } = req.body;

    if (!animal) {
        return res.status(400).json({ message: "No animal type selected" });
    }

    const pets = await Pet.find({ type: animal });

    res.json({ pets });
});

const deleteUser = asyncWrapper(async (req, res) => {
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
});

const deletePet = asyncWrapper(async (req, res) => {
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
    const { name, species, description } = req.body;

    try {
        const updatedPet = await Pet.findByIdAndUpdate(
            petId,
            { name, species, description },
            { new: true }
        );

        if (!updatedPet) {
            return res.status(404).send("Pet not found");
        }

        const data = await Pet.find({ type: updatedPet.type });
        res.render('dashboard', { data, section: 'Pets' });
    } catch (error) {
        res.status(500).send("Error updating pet");
    }
};

module.exports = {
    renderEditPetForm, updatePetDetails, startPage, displayPage, searchPets,
    featuredPets, petProfile, uploader, addPet, showEmailForm, handleEmailSubmission,
    createAccount, logAccount, logOut, dashboard, getDashboard, petSelector, deleteUser, deletePet, upload
};
