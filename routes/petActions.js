const express = require("express");
const router = express.Router();
const { allPets, searchPets } = require("../controller/pets"); // Ensure the correct path

// GET all pets and render index.ejs
router.get("/", searchPets);

module.exports = router;
