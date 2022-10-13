const User = require('../models/User')

const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route Get /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if(!users?.length){
        return res.status(400).json({ message: 'No users found' })
    }
    res.json(users)
})

// @desc Create new user
// @route Post /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, email, phone, password, roles } = req.body 

    // Confirm data
    if (!username || !email || !phone || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required!' })
    }

    // Check for duplicate
    const duplicate = await User.findOne({ email }).lean().exec()
    
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate email'})
    }


    //Hash password
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const userObject = { username, email, phone, "password": hashedPwd, roles}

    // Create and store new user
    const user = await User.create(userObject)

    if (user) {
        res.status(201).json({ message : `New user ${username} created`})
    }else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

// @desc Update user
// @route Patch /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, email, phone, roles, password} = req.body

    //Confirm data
    if (!id || !username || !email || !phone || !Array.isArray(roles) || !roles.length){
        return res.status(400).json({ message: 'All fields are required!'})
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found'})
    }

    //Check for duplicate
    const duplicate = await User.findOne({ email }).lean().exec()
    // Allow updates to the original user
    if(duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate email'})
    }

    user.username = username
    user.email = email
    user.phone = phone
    user.roles = roles

    if (password) {
        // Hash password
        user.password = await bcrypt.hash(password, 10) // salt rounds
    }

    const updatedUser = await user.save()

    res.json({ message : `${updatedUser.username} updated`})
})

// @desc Delete user
// @route Delete /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'User ID required'})
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found!'})
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} has been deleted`

    res.json(reply)
})


module.exports = { 
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}