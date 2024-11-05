const express = require('express');
const router = express.Router();
const { startPage, searchPets, featuredPets, displayPage, petProfile, upload, addPet, user, userData} = require('../controller/pets');

router.post('/', featuredPets); 
router.get('/', startPage);

router.post("/display", searchPets);



router.get("/display", displayPage);


router.get("/petProfile", petProfile)


router.get("/uploadPet", upload);
router.post('/uploadPet', addPet);


router.get('/user', user);
router.post("/user", userData)
module.exports = router;
