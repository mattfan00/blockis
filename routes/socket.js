const Room = require('../models/room')

module.exports = (io) => {
  io.on('connection', (socket) => {    
    let roomId
    
    socket.on('joinRoom', (msg) => {
      roomId = msg.roomId
      Room.findById(roomId, (err, foundRoom) => {
        let newUser = {
          username: msg.username,
          socketId: socket.id
        }
        foundRoom.users.push(newUser)
        foundRoom.save()

        socket.join(roomId)
 
        // Send message to the user that just joined the chat 
        socket.emit('message', 'Welcome to the room')

        // Send the list of the other users
        io.to(roomId).emit('getOtherPlayers', foundRoom.users)

        // If there is only one user in the room, start game immediately
        if (foundRoom.users.length == 1) {
          startCountdown(socket, roomId)
        }

        // // Send message to the whole lobby except the user that joined
        // socket.to(roomId).broadcast.emit('message', msg.username + ' has joined the room')
      })
    })

    socket.on('startGame', () => {
      // Room.findById(roomId, (err, foundRoom) => {
      //   let newUsers = newUsers.map(user => {
      //     return {...user.toObject(), gameOver: false, place: null}
      //   })
      //   foundRoom.users = newUsers
      //   foundRoom.save() 
      //   io.to(roomId).emit('startGame')
      // })
      io.to(roomId).emit('startGame')
    })

    socket.on('draw', (drawDetails) => {
      socket.to(roomId).broadcast.emit('draw', drawDetails)
    })

    socket.on('playerGameOver', (details) => {
      Room.findById(roomId, (err, foundRoom) => {
        // handle the case that its just one player in the game
        if (foundRoom.users.length == 1) { 
          let newUsers = foundRoom.users.map(user => {
            if (user.socketId == details.socketId) {
              return {...user.toObject(), gameOver: true, place: 1}
            } else {
              return user.toObject()
            }
          })
          foundRoom.users = newUsers
          foundRoom.save()
          io.to(roomId).emit('wholeGameOver', newUsers)
          startCountdown(socket, roomId)
        } else {
          socket.to(roomId).broadcast.emit('playerGameOver', {
            socketId: details.socketId
          }) 

          let numStillPlaying = foundRoom.users.filter(user => !user.gameOver).length
          let newUsers = foundRoom.users.map(user => {
            if (user.socketId == details.socketId) {
              return {...user.toObject(), gameOver: true, place: numStillPlaying}
            } else {
              return user.toObject()
            }
          })

          // signal whole game over when game over for 1 out of the 2 remaining 
          if (numStillPlaying == 2) { 
            newUsers = newUsers.map(user => {
              if (!user.place) {
                return {...user, gameOver: true, place: 1}
              } else {
                return user
              }
            })
            io.to(roomId).emit('wholeGameOver', newUsers)
            startCountdown(socket, roomId)
            newUsers = newUsers.map(user => {
              return {...user, gameOver: false, place: null}
            })
          }
          foundRoom.users = newUsers
          foundRoom.save()
        }
      })
    })

    // Send message to everyone that a user has left the chat 
    socket.on('disconnect', () => {
      Room.findById(roomId, (err, foundRoom) => {
        let newUsers = foundRoom.users.filter(user => user.socketId != socket.id)

        foundRoom.users = newUsers
        foundRoom.save()

        // Send the list of the other users
        io.to(roomId).emit('getOtherPlayers', foundRoom.users)

        io.emit('message', 'A user has left the chat')
      })
    })
  })
}

function startCountdown(socket, roomId) {
  let count = 5
  let intervalId = setInterval(() => {
    io.to(roomId).emit('countdown', count)
    count--
    if (count < 0) {
      clearInterval(intervalId)
      setTimeout(() => {
        io.to(roomId).emit('startGame')
      }, 1000)
    }
  }, 1000)

  socket.on('disconnect', () => {
    clearInterval(intervalId)
  })

}
