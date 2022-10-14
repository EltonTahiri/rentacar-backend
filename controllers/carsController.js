const Car = require('../models/Car')

const asyncHandler = require('express-async-handler')

// @desc Get all cars
// @route Get /cars
// @access Private
const getAllCars = asyncHandler(async (req, res) => {
    const cars = await Car.find().lean()
    if(!cars?.length){
        return res.status(400).json({ message: 'No cars found' })
    }
    res.json(cars)
})

// @desc Add new Car
// @route Post /cars
// @access Private
const createNewCar = asyncHandler(async (req, res) => {
    const { name, manufacturer, engine, consumption, seats, licensePlate} =req.body

    //Confirm data
    if( !name || !manufacturer || !engine || !consumption || !seats) {
        return res.status(400).json({ message: 'All fields are required!'})
    }

    //Check for duplicate
    const duplicate = await Car.findOne({ licensePlate }).lean().exec()

    if(duplicate){
        return res.status(409).json({ message: 'Duplicate license plate, car exists'})
    }

    const carObject = { name, manufacturer, engine, consumption, seats, licensePlate }

    //Create and store new Car
    const car = await Car.create(carObject)

    if(car) {
        res.status(201).json({message : `New car with ${licensePlate} plate created` })
    } else {
        res.status(400).json({ message: 'Invalid car data received' })
    }
})

// @desc Delete car
// @route Delete /cars
// @access Private
const deleteCar = asyncHandler(async (req, res) => {
    const { id } = req.body

    if(!id) {
        return res.status(400).json({ message: 'Car ID required'})
    }

    const car = await Car.findById(id).exec()

    if (!car) {
        return res.status(400).json({ message: 'Car not found!'})
    }

    const result = await car.deleteOne()

    const reply = `Car with ${result.licensePlate} plate, with ID ${result._id} has been deleted`

    res.json(reply)
})


module.exports ={
    getAllCars,
    createNewCar,
    deleteCar
}