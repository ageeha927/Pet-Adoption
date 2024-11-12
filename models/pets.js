const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: { type: String, required: true },
    breed: { type: String, required: true },
    age: { type: Number, required: true },
    description: { type: String, required: true },
    behavior: { type: String, required: true },
    history: { type: String, required: true },
    image_url: { type: String, required: true },  // Image URL path will be stored here
    popularity: { type: Number, min: 0, max: 100, required: true },
    type: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    location: { type: String, enum: ["North West", "West", "South West", "Mid West", "South East", "Mid Atlantic", "North East"], required: true }
}, { 
    collection: "Pets",
    versionKey: false
});

const Pet = mongoose.model('Pets', petSchema);

module.exports = Pet;
