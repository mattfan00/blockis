const Room = require('../models/room')

module.exports = (io) => {
  io.on('connection', (socket) => {    
    let roomId
    
    socket.on('joinRoom', (msg) => {
      roomId = msg.roomId
      Room.findById(roomId, (err, foundRoom) => {
        let newUser = {
          username: msg.username,
          socketId: socket.id,
          joinedGame: !foundRoom.gameStarted
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

    socket.on('draw', (drawDetails) => {
      socket.to(roomId).broadcast.emit('draw', drawDetails)
    })

    socket.on('playerGameOver', (details) => {
      Room.findById(roomId, (err, foundRoom) => {
        // handle the case that its just one player in the game
        let winner
        if (foundRoom.users.filter(user => user.joinedGame).length == 1) { 
          let newUsers = foundRoom.users.map(user => {
            if (user.socketId == details.socketId) {
              winner = {...user.toObject(), gameOver: true, place: 1}
              return winner
            } else {
              return user.toObject()
            }
          })

          // trigger whole game over 
          foundRoom.users = newUsers
          foundRoom.gameStarted = false
          foundRoom.save()
          io.to(roomId).emit('wholeGameOver', {
            users: newUsers,
            winner
          })
          startCountdown(socket, roomId)
        } else {
          let numStillPlaying = foundRoom.users.filter(user => !user.gameOver && user.joinedGame).length

          io.to(roomId).emit('playerGameOver', {
            socketId: details.socketId,
            place: numStillPlaying
          }) 

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
              if (!user.place && user.joinedGame) {
                winner = {...user, gameOver: true, place: 1}
                return winner
              } else {
                return user
              }
            })

            // trigger whole game over
            foundRoom.gameStarted = false
            io.to(roomId).emit('wholeGameOver', {
              users: newUsers,
              winner
            })
            startCountdown(socket, roomId)
            newUsers = newUsers.map(user => {
              return {...user, gameOver: false, place: null, joinedGame: true}
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
        foundRoom.gameStarted = !(newUsers.length == 0)
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
        Room.findByIdAndUpdate(roomId, {gameStarted: true}, {new: true}, (err, updatedRoom) => {
          console.log(updatedRoom)
          io.to(roomId).emit('startGame')
        })
      }, 1000)
    }
  }, 1000)

  socket.on('disconnect', () => {
    Room.findById(roomId, (err, foundRoom) => {
      // don't clear the countdown if there are other players depending on the countdown
      if (foundRoom.users.length == 1) {
        clearInterval(intervalId)
      }
    })
  })

}
