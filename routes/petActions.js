const express = require("express");
const router = express.Router();
const { searchPets } = require("../controller/pets"); // Ensure the correct path

// GET all pets and render index.ejs
// router.post("/", searchPets);
router.route("/").get(searchPets).post(searchPets)
module.exports = router;

// router.route("/").get(getAllTasks).post(createTask);
// router.route("/").get(getAllTasks).post(createTask);
