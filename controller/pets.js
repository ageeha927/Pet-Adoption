const Pet = require("../models/pets")
const asyncWrapper = require("../middleware/async");

const searchPets = asyncWrapper(async (req, res) => {
    // b insures the first letter of each word, w matches each "word character", and then g stands for global, meaning it goes through the entire string. After all of this, it uppercases it. / reperesents the start of the regex, or string. 
    const searchName = req.body.searchBar ? req.body.searchBar.replace(/\b\w/g, char => char.toUpperCase()) : null;
    const pets = await Pet.find({name:searchName});
    // console.log(searchName)
    // console.log(req.body)
    console.log(pets)
    res.render('search', {pets})
});
let featured = "Snake"

const featuredPets = (async (req, res) => {
    featured = req.body.animal;
    const pets = await Pet.find({type:featured});
    // console.log(pets)
    console.log(featured)
    res.render("index",{pets}); 
});


const startPage = asyncWrapper(async (req,res) => {
    const pets = await Pet.find({type:featured});
    // console.log(pets)
    res.render('index', {pets});

})


module.exports = {startPage, searchPets, featuredPets};
