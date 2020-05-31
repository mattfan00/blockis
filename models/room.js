const mongoose = require('mongoose')

var RoomSchema = new mongoose.Schema({
  name: String,
  custom: {
    type: Boolean,
    default: false
  },
  users: [
    {
      _id: false,
      username: String,
      socketId: String,
      gameOver: {
        type: Boolean,
        default: false
      }
    }
  ]
})

module.exports = mongoose.model("Room", RoomSchema)