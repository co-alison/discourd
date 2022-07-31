const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    const { email, password } = request.body

    const user = await User.findOne({ email })
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid email or password'
        })
    }

    if (user.status != 'Active') {
        return response.status(401).send({
            message: 'Pending account. Please verify your email.'
        })
    }

    const userForToken = {
        name: user.name,
        id: user._id
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    response
        .status(200)
        .send({ token, name: user.name, email: user.email, id: user._id })
})

module.exports = loginRouter