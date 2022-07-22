const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.error('error connecting to MongoDB: ', error.message)
    })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

module.exports = app