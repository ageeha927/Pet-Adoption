const mongoose = require('mongoose');

const dragonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    species: { type: String, required: true },
    age: { type: Number, required: true },
    description: { type: String },
    behavior: { type: String },
    history: { type: String },
    image_url: { type: String }
}, {collection:"Dragons"});

const frogSchema = new mongoose.Schema({
    name: { type: String, required: true },
    species: { type: String, required: true },
    age: { type: Number, required: true },
    description: { type: String },
    behavior: { type: String },
    history: { type: String },
    image_url: { type: String }
}, {collection:"Frogs"});

const snakeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    species: { type: String, required: true },
    age: { type: Number, required: true },
    description: { type: String },
    behavior: { type: String },
    history: { type: String },
    image_url: { type: String }
}, {collection:"Snakes"});

// const Pet = mongoose.model('Pets', petSchema);
const Dragon = mongoose.model('Dragon', dragonSchema);
const Frog = mongoose.model("Frog", frogSchema);
const Snake = mongoose.model('Snake', snakeSchema);


module.exports = {Dragon, Frog, Snake};
