const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
var path = require('path');
//entegar a pagina
app.use(express.static(path.join(__dirname, 'Public/')));
//area do socket io

//Mostrar nova conexão e contador de usuarios
var userCounter = 0

io.on('connection', (socket) => {
    userCounter = userCounter +1
    io.emit('usersOnline', userCounter, socket.id)

    socket.on('disconnect', (socket) => {
    userCounter = userCounter -1
    io.emit('usersOnline', userCounter)
    })
})


//evento da mensagem
let messageArr = []

io.on('connection', (socket) => {

    io.to(socket.id).emit('previousMessages', messageArr )

    socket.on('whoIsTyping', (theOne) => {
        io.emit('typing', theOne)
    })

    socket.on('messageEvent', (msg) => {
        msg.userID = socket.id
        messageArr.push(msg)

        io.emit('messageEvent', msg)
    })
})

//dizer que esta "ouvindo"
http.listen(3000, () => {
    console.log('Server On')
})