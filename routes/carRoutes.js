const express = require('express')
const router = express.Router()
const carController = require('../controllers/carsController')

router.route('/')
    .get(carController.getAllCars)
    .post(carController.createNewCar)
    .patch(carController.updateCar)
    .delete(carController.deleteCar)


module.exports = router