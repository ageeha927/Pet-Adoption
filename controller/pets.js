const Pet = require('../models/pets');
const asyncWrapper = require("../middleware/async");

const getallPets = asyncWrapper(async (req, res) => {
    const pets = await Pet.find({});
    console.log(pets); // Print all pets to the console

    // Optionally, render the index view and pass the pets data to it
    res.render("index", { pets });
});

module.exports = { getallPets };
