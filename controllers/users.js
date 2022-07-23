const bcrypt = require('bcrypt')
const User = require('../models/user')
const usersRouter = require('express').Router()
const EMAIL_REGEX = /.+@student\.ubc\.ca/

usersRouter.get('/', async ( request, response) => {
    const users = await User.find({})
    response.json(users)
})

usersRouter.post('/', async ( request, response) => {
    const { name, email, password } = request.body
    if (!name || !email || !password) {
        return response.status(400).json({ 'message': 'All fields required'})
    }

    const existingUser = await User.findOne({ email }).exec()

    if (existingUser) {
        return response.sendStatus(409)
        // user should already be verified
    }

    if (EMAIL_REGEX.test(email)) {
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)
        const user = new User({
            name,
            email,
            passwordHash
        })

        const savedUser = await user.save()
        response.status(201).json(savedUser)
    } else {
        return response.status(400).json({ 'message': 'Invalid UBC email'})
    }
})

module.exports = usersRouter