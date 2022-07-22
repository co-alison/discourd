const mongoose = require('mongoose')

const serverSchema = new mongoose.Schema({
    course: String,
    url: String
})

serverSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Server = mongoose.model('Server', serverSchema)

module.exports = Server