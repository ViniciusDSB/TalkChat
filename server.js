const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app)

const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('index.html');
})

io.on('connection', (socket) => {
    console.log(`User ${socket.id} has arrived`)
    socket.on('disconnect', () => {
        console.log(`User ${socket.id} is gone`)
    })
})

io.on('connection', (socket) => {
    socket.on('newMsg', (msg) => {
        io.emit("msgForAll", (msg))
    })
})

server.listen(3000, () => {
    console.log('Listening!')
})