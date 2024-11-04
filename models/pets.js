const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: { type: String, required: true },
    breed: { type: String, required: true },
    species: { type: String, required: true },
    age: { type: Number, required: true },
    description: { type: String },
    behavior: { type: String },
    history: { type: String },
    image_url: { type: String },
    popularity: { type: mongoose.Schema.Types.Decimal128, min: 0},
    type: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    location: { type: String, enum: ["North West", "West", "South West", "Mid West", "South East", "Mid Atlantic", "North East"], required: true },
    interested: {
        name: { type: String, default: "" },
        email: { type: String, default: "" },
        message: { type: String, default: "" }
    }
}, { collection: "Pets" });

const Pet = mongoose.model('Pets', petSchema);

module.exports = Pet;
