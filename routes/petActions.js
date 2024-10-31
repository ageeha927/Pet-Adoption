const express = require('express');
const router = express.Router();
const { startPage, searchPets, featuredPets } = require('../controller/pets');

// Render index page
router.get("/",startPage)

router.post("/search", searchPets);
// router.post("/", featuredPets);

module.exports = router;
