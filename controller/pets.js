const Pet = require("../models/pets")
const asyncWrapper = require("../middleware/async");

const searchPets = asyncWrapper(async (req, res) => {
    //b insures the first letter of each word, w matches each "word character", and then g stands for global, meaning it goes through the entire string. After all of this, it uppercases it. / reperesents the start of the regex, or string. 
    const searchName = req.body.searchBar.replace(/\b\w/g, char => char.toUpperCase());
    const pets = await Pet.find({name:searchName});
    console.log(searchName)
    console.log(pets)
    console.log(req.body)
    res.render("index", {pets});
});

const featuredPets = asyncWrapper(async (req,res) =>{

})

module.exports = {searchPets };
