const express = require('express')
const router = express.Router()
const carController = require('../controllers/carsController')

router.route('/')
    .get(carController.getAllCars)
    .post(carController.createNewCar)
    .delete(carController.deleteCar)


module.exports = router