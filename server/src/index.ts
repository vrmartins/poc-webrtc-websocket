import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const port = 8000
const app = express()
app.use(cors)
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

io.on('connection', socket => {
    console.log('User connected')

    socket.on('disconnect', () => {
        console.log('User disconnected')
    })
})

server.listen(port, () => {
    console.log(`Listening to the server on port ${port}`)
})