const verifyRouter = require('express').Router()
const User = require('../models/user')


verifyRouter.get('/:confirmationCode', (request, response) => {
    User.findOne({
        confirmationCode: request.params.confirmationCode
    })
        .then((user) => {
            if (!user) {
                return response.status(404).send({ message: 'User not found'})
            }

            user.status = 'Active'
            user.save((err) => {
                if (err) {
                    response.status(500).send({ message: err})
                    return
                } else {
                    response.status(200).send({ message: 'User confirmed', user: user })
                }
            })
        })
        .catch((e) => console.log('error', e))
})

module.exports = verifyRouter