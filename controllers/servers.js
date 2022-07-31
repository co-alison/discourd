const Server = require('../models/server')
const serversRouter = require('express').Router()

serversRouter.get('/', async (request, response) => {
    const servers = await Server.find({})
    response.json(servers)
})

serversRouter.post('/', async (request, response) => {
    const { name, url } = request.body

    const server = new Server({
        name,
        url
    })

    const savedServer = await server.save()
    response.status(201).json(savedServer)
})

serversRouter.put('/:id', async (request, response) => {
    const newServer = request.body

    const updatedServer = await Server.findByIdAndUpdate(
        request.params.id,
        newServer,
        { new: true, runValidators: true, context: 'query'}
    )

    response.status(200).json(updatedServer)
})

serversRouter.delete('/:id', async (request, response) => {
    await Server.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

module.exports = serversRouter