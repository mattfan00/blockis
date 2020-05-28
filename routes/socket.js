const Room = require('../models/room')

module.exports = (io) => {
  io.on('connection', (socket) => {    
    // socket.on('move', (msg) => {
    //   socket.broadcast.emit('message', msg)
    // })
    var roomId
    
    socket.on('joinRoom', (msg) => {
      roomId = msg.roomId
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

        // Send message to the whole lobby except the user that joined
        socket.to(roomId).broadcast.emit('message', msg.username + ' has joined the room')
      })
    })

    // Send message to everyone that a user has left the chat 
    socket.on('disconnect', () => {
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

  //   socket.on('chat message', (msg) => {
  //     io.to(msg.chatId).emit('message', formatMessage(msg.user, msg.value))
  //   })
  })
}