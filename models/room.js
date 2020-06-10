const mongoose = require('mongoose')

var RoomSchema = new mongoose.Schema({
  name: String,
  maxSize: {
    type: Number,
    default: 7
  },
  users: [
    {
      _id: false,
      username: String,
      socketId: String,
      place: Number,
      gameOver: {
        type: Boolean,
        default: false
      }
    }
  ]
})

module.exports = mongoose.model("Room", RoomSchema)