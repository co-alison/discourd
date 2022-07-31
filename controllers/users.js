const bcrypt = require('bcrypt')
const User = require('../models/user')
const usersRouter = require('express').Router()
const EMAIL_REGEX = /.+@student\.ubc\.ca/
const emailRouter = require('./email')

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


    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
        token += characters[Math.floor(Math.random() * characters.length )];
    }

    if (!EMAIL_REGEX.test(email)) {
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)
        const user = new User({
            name,
            email,
            passwordHash,
            confirmationCode: token
        })

        try {
            const savedUser = await user.save()
            response.status(201).json(savedUser)
            emailRouter.sendConfirmationEmail(
                name,
                email,
                savedUser.confirmationCode
            )
        } catch (error) {
            console.log(error)
            return
        }
    } else {
        return response.status(406).json({ 'message': 'Invalid UBC email'})
    }
})

usersRouter.delete('/:id', async (request, response) => {
    await User.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

module.exports = usersRouter