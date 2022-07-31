const emailRouter = require('express').Router()
const nodemailer = require('nodemailer')
const logger = require('../utils/logger')

const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

emailRouter.post('/', async (request, response, next) => {

    const body = request.body

    const mail = {
        from: process.env.EMAIL,
        to: body.to,
        subject: body.subject,
        text: body.text
    }

    transporter.sendMail(mail, (err, info) => {
        if (err) {
            console.log(err)
            return response.status(400).json({
                status: 'fail'
            })
        } else {
            console.log('Sent: ' + info.response)
            return response.status(200)
        }
    })
})

const sendConfirmationEmail = (name, email, confirmationCode) => {

    const mail = {
        from: process.env.EMAIL,
        to: email,
        subject: "Please verify your account",
        html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for signing up for Discourd. Please confirm your email by clicking on the following link</p>
        <a href=http://localhost:3000/confirm/${confirmationCode}> Click here</a>
        </div>`
    }

    transporter.sendMail(mail, (err, info) => {
        if (err) {
            console.log(err)
            return response.status(400).json({
                status: 'fail'
            })
        } else {
            console.log('Sent: ' + info.response)
            return response.status(200)
        }
    })
}

module.exports = { sendConfirmationEmail, emailRouter }