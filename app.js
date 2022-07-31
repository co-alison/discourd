const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const usersRouter = require('./controllers/users')
const serversRouter = require('./controllers/servers')
const loginRouter = require('./controllers/login')
const email = require('./controllers/email')
const verifyRouter = require('./controllers/verify')

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB: ', error.message)
    })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/email', email.emailRouter)
app.use('/api/users', usersRouter)
app.use('/api/servers', middleware.userExtractor, serversRouter)
app.use('/api/login', loginRouter)
app.use('/api/confirm', verifyRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app