const express = require('express')
const app = express()
const PORT = 5000

const http = require('http').Server(app)
const cors = require('cors')
const socketIO = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:5173'
    }
})

app.get('api', (req, res) => {
    res.json({
        message: 'Hello'
    })
})

let users = []

socketIO.on('connection', (socket) => {
    console.log(`${socket.id} user connected`)

    socket.on('message', (data) => {
        socketIO.emit('response', data)
    })

    socket.on('newUser', (data) => {
        if(users.filter(u => ((u.user == data.user) || (u.socketID == data.socketID)) ).length == 0){
            // console.log(users.filter(u => u.user == data.user ).length == 0)
            users = [...users, data]

            socketIO.emit('responseNewUser', users)
            socketIO.emit('unknownUser', {nameCreate:'Вы придумали имя', user: data})
        } else {
            // console.log(users.filter(u => u.user == data.user ).length == 0)
            socketIO.emit('haveThisUser', 'Имя занято, придумайте новое имя')
        }
        
    })

    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnect`)
        users = users.filter(u => u.socketID != socket.id)
        console.log(users)
        socketIO.emit('refreshUsers', users)
    })
})

http.listen(PORT, () => {
    console.log('server worcking')
})