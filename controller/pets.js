const Pet = require("../models/pets")
const asyncWrapper = require("../middleware/async");


const searchPets = asyncWrapper(async (req, res) => {
    // b insures the first letter of each word, w matches each "word character", and then g stands for global, meaning it goes through the entire string. After all of this, it uppercases it. / reperesents the start of the regex, or string. 
    const searchName = req.body.searchBar ? req.body.searchBar.replace(/\b\w/g, char => char.toUpperCase()) : '';
    const pets = await Pet.findOne({name:searchName});
    // console.log(searchName)
    // console.log(req.body)
    console.log(pets)
    res.render('index', {pets})
});

const featuredPets = (async (req,res) =>{
    const typeOf = req.body.animal
    const pets = await Pet.find({type:typeOf});
    console.log(pets)
    // res.send(200)
    // res.render('index');
    return "bob"
})

const startPage = asyncWrapper(async (req,res) => {
    pets = await featuredPets
    console.log(pets)
    res.render('index');

})


module.exports = {startPage, searchPets, featuredPets};
