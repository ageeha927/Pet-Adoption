const express = require('express');
const router = express.Router();
const {
    startPage,
    searchPets,
    featuredPets,
    displayPage,
    petProfile,
    upload,
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
    updatePetDetails
} = require('../controller/pets');

// Featured Pets Route (POST for featured pets on the home page)
router.post('/', featuredPets); 
// Start Page Route (GET for the homepage)
router.get('/', startPage);

// Search Pets Route (POST for search functionality)
router.post("/display", searchPets);
// Display Page Route (GET for displaying pets)
router.get("/display", displayPage);

// Pet Profile Route (GET for viewing pet details)
router.get("/petProfile", petProfile);

// Upload Pet Routes (GET for the upload form and POST to add the pet)
router.get("/uploadPet", upload);
router.post('/uploadPet', addPet);

// Email Routes (GET for the email form and POST for submission)
router.get('/user', showEmailForm);
router.post('/submitEmail', handleEmailSubmission);

// Login and Signup Routes (POST for account login and signup)
router.post('/login', logAccount);
router.post('/signup', createAccount);

// Logout Route (POST for logging out)
router.post("/logout", logOut);

// Dashboard Routes (GET for loading the dashboard and POST for data handling)
router.get('/dashboard', dashboard);
router.post('/getDashboard', getDashboard);

// Pet Selection Route (POST for selecting pet type like Snake, Lizard, or Frog)
router.post('/petSelector', petSelector);

// Delete Routes for User and Pet (DELETE to remove user or pet by ID)
router.delete('/deleteUser/:userId', deleteUser);
router.delete('/deletePet/:petId', deletePet);

// Edit Pet Routes (GET for showing the pet's edit form and POST for updating details)
// Edit Pet Routes (GET for showing the pet's edit form and POST for updating details)
router.get("/editPet/:petId", renderEditPetForm);  // Render edit form for pet
router.post("/editPet/:petId", updatePetDetails);  // Update pet details after form submission


module.exports = router;
