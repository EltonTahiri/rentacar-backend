const express = require('express')
const router = express.Router()
const carController = require('../controllers/carsController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(carController.getAllCars)
    .post(carController.createNewCar)
    .patch(carController.updateCar)
    .delete(carController.deleteCar)


module.exports = router