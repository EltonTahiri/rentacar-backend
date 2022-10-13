const mongoose = require('mongoose')

const carSchema = new mongoose.Schema({
    manufacturer: {
        type: String, 
        required: true,
    },
    engine: {
        type: String,
        required: true,
    },
    consumption: {
        type: Number,
        required: true,
    },
    seats: {
        type: Number,
        required: true,
    }

})


module.exports = mongoose.model('Car', carSchema)