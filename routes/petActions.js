const express = require("express");
const router = express.Router();
const { getallPets } = require("../controller/pets"); // Ensure the correct path

// GET all pets and render index.ejs
router.get("/", getallPets);

module.exports = router;
