const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: { type: String, required: true },
    species: { type: String, required: true },
    age: { type: Number, required: true },
    description: { type: String },
    behavior: { type: String },
    history: { type: String },
    image_url: { type: String },
    popularity: { type: mongoose.Schema.Types.Decimal128 },
    type: {type:String}
}, {collection:"Pets"});

const Pet = mongoose.model('Pets', petSchema);

module.exports = Pet;