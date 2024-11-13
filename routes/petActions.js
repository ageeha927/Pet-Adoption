const express = require('express');
const router = express.Router();
const {
    startPage,
    searchPets,
    featuredPets,
    displayPage,
    petProfile,
    uploader,
    addPet,
    showEmailForm,
    handleEmailSubmission,
    createAccount,
    logAccount,
    logOut,
    dashboard,
    getDashboard,
    petSelector,
    deleteUser,
    deletePet,
    renderEditPetForm,
    updatePetDetails,
    upload
} = require('../controller/pets');

router.get('/', startPage);
router.post('/', featuredPets); 




router.post("/display", searchPets);
router.get("/display", displayPage);

router.get("/petProfile", petProfile);

router.get("/uploadPet", uploader);
router.post('/uploadPet', upload.single("image"), addPet);

router.get('/user', showEmailForm);
router.post('/submitEmail', handleEmailSubmission);

router.post('/login', logAccount);
router.post('/signup', createAccount);

router.post("/logout", logOut);

router.get('/dashboard', dashboard);
router.post('/getDashboard', getDashboard);

router.post('/petSelector', petSelector);

router.delete('/deleteUser/:userId', deleteUser);
router.delete('/deletePet/:petId', deletePet);


router.get("/editPet/:petId", renderEditPetForm); 
router.post('/editPet/:petId', upload.single('image'), updatePetDetails);


module.exports = router;
