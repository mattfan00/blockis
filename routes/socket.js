const Room = require('../models/room')

module.exports = (io) => {
  io.on('connection', (socket) => {    
    var roomId
    
    socket.on('joinRoom', (msg) => {
      roomId = msg.roomId
      console.log(roomId)
      Room.findById(roomId, (err, foundRoom) => {
        var newUser = {
          username: msg.username,
          socketId: socket.id
        }
        foundRoom.users.push(newUser)
        foundRoom.save()
        console.log(foundRoom)

        socket.join(roomId)
 
        // Send message to the user that just joined the chat 
        socket.emit('message', 'Welcome to the room')

        // Send the list of the other users
        io.to(roomId).emit('getOtherPlayers', foundRoom.users)

        // If there is only one user in the room, start game immediately
        if (foundRoom.users.length == 1) {
          startCountdown(roomId)
        }

        // // Send message to the whole lobby except the user that joined
        // socket.to(roomId).broadcast.emit('message', msg.username + ' has joined the room')
      })
    })

    socket.on('startGame', () => {
      // Room.findById(roomId, (err, foundRoom) => {
      //   foundRoom.gameStarted = true
      //   foundRoom.save() 
      //   io.to(roomId).emit('startGame')
      // })
      io.to(roomId).emit('startGame')
    })

    socket.on('draw', (drawDetails) => {
      socket.to(roomId).broadcast.emit('draw', drawDetails)
    })

    socket.on('playerGameOver', (details) => [
      Room.findById(roomId, (err, foundRoom) => {
        var newUsers = foundRoom.users.map(user => {
          if (user.socketId == details.socketId) {
            return {...user.toObject(), gameOver: true}
          } else {
            return user
          }
        })
        foundRoom.users = newUsers 
        socket.to(roomId).broadcast.emit('playerGameOver', {
          socketId: details.socketId
        })

        var stillPlaying = foundRoom.users.filter(user => !user.gameOver)
        var winner 
        if (stillPlaying.length == 1) {
          // foundRoom.gameStarted = false
          winner = stillPlaying[0]
          
        } else if (stillPlaying.length == 0) {
          winner = foundRoom.users[0]
        }

        io.to(roomId).emit('wholeGameOver', winner)
        startCountdown(roomId)

        foundRoom.save()
      })
    ])

    // Send message to everyone that a user has left the chat 
    socket.on('disconnect', () => {
      console.log(roomId)
      Room.findById(roomId, (err, foundRoom) => {
        var newUsers = foundRoom.users.filter(user => user.socketId != socket.id)

        foundRoom.users = newUsers
        foundRoom.save()
        
        console.log(foundRoom)

        // Send the list of the other users
        io.to(roomId).emit('getOtherPlayers', foundRoom.users)

        io.emit('message', 'A user has left the chat')
      })
    })
  })
}

function startCountdown(roomId) {
  var count = 5
  var intervalId = setInterval(() => {
    io.to(roomId).emit('countdown', count)
    count--
    if (count < 0) {
      clearInterval(intervalId)
      setTimeout(() => {
        io.to(roomId).emit('startGame')
      }, 1000)
    }
  }, 1000)
  
}
