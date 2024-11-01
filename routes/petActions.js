const express = require('express');
const router = express.Router();
const { startPage, searchPets, featuredPets } = require('../controller/pets');

router.post('/', featuredPets); // Handle AJAX requests for pet updates
router.get('/', startPage); // Handle initial page load
router.post("/search", searchPets); // Handle search requests

module.exports = router;
