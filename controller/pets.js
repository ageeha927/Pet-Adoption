const Pet = require("../models/pets")
const asyncWrapper = require("../middleware/async");
// Change the amount of pets displayed in the home page
let maximum = 3
let featured = "Snake"
let searchValue = ""

// Home Page
const startPage = asyncWrapper(async (req,res) => {
    const pets = await Pet.find({type:featured});
    // console.log(pets)
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
    console.log(featured);
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
    console.log(pets)
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
    const { name, breed, species, age, description, behavior, history, image_url, popularity, type, gender, location, interested } = req.body;

    const newPet = new Pet({
        name,
        breed,
        species,
        age,
        description,
        behavior,
        history,
        image_url,
        popularity: parseInt(popularity),
        type,
        gender,
        location,
        interested: {
            name: interested.name || "",
            email: interested.email || "",
            message: interested.message || ""
        }
    });

    await newPet.save();
    res.redirect('index'); 
});


module.exports = {startPage, displayPage, searchPets, featuredPets, petProfile, upload, addPet};
