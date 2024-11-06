const express = require('express');
const router = express.Router();
const { startPage, searchPets, featuredPets, displayPage, petProfile, upload, addPet, showEmailForm, handleEmailSubmission, createAccount, logAccount, logOut} = require('../controller/pets');

router.post('/', featuredPets); 
router.get('/', startPage);

router.post("/display", searchPets);



router.get("/display", displayPage);


router.get("/petProfile", petProfile)


router.get("/uploadPet", upload);
router.post('/uploadPet', addPet);


router.get('/user', showEmailForm);

router.post('/submitEmail', handleEmailSubmission);

router.post('/login', logAccount);
router.post('/signup', createAccount);

router.post("/logout", logOut);
module.exports = router;