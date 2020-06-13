const mongoose = require('mongoose')

var RoomSchema = new mongoose.Schema({
  name: String,
  maxSize: {
    type: Number,
    default: 7
  },
  gameStarted: {
    type: Boolean,
    default: false
  },
  private: {
    type: Boolean,
    default: false
  },
  // password: String,
  users: [
    {
      _id: false,
      username: String,
      socketId: String,
      place: Number,
      gameOver: {
        type: Boolean,
        default: false
      },
      joinedGame: {
        type: Boolean,
        default: true
      }
    }
  ]
})

module.exports = mongoose.model("Room", RoomSchema)