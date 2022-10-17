const mongoose = require('mongoose')

const carSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    manufacturer: {
        type: String, 
        required: true,
    },
    engine: {
        type: String,
        required: true,
    },
    consumption: {
        type: String,
        required: true,
    },
    seats: {
        type: Number,
        required: true,
    },
    licensePlate: {
        type: String,
        required: true,
        unique: true
    }


})


module.exports = mongoose.model('Car', carSchema)