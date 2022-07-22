const res = require('express/lib/response')
const User = require('../models/user')
const usersRouter = require('express').Router()
const EMAIL_REGEX = /.+@student\.ubc\.ca/

usersRouter.get('/', async ( request, response) => {
    const users = await User.find({})
    response.json(users)
})

usersRouter.post('/', async ( request, response) => {
    const { name, email } = request.body
    if (!name || !email) {
        return res.status(400).json({ 'message': 'Name and email required'})
    }

    const existingUser = await User.findOne({ email }).exec()

    if (existingUser) {
        return response.sendStatus(409)
        // user should already be verified
    }

    if (EMAIL_REGEX.test(email)) {
        const user = new User({
            name,
            email
        })

        const savedUser = await user.save()
        response.status(201).json(savedUser)
    } else {
        return res.status(400).json({ 'message': 'Invalid UBC email'})
    }
})

module.exports = usersRouter