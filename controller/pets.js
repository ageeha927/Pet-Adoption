const { Dragon, Frog, Snake } = require('../models/pets');
const asyncWrapper = require("../middleware/async");

let dragons, frogs, snakes;

const allPets = async () => {
    dragons = await Dragon.find({});
    frogs = await Frog.find({});
    snakes = await Snake.find({});
};

const searchPets = asyncWrapper(async (req, res) => {
    await allPets();
    console.log(dragons); 
    res.render("index", { dragons, frogs, snakes });
});

module.exports = { allPets, searchPets };
