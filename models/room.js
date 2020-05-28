const mongoose = require('mongoose')

var RoomSchema = new mongoose.Schema({
  name: String,
  users: [
    {
      _id: false,
      username: String,
      socketId: String
    }
  ]
})

module.exports = mongoose.model("Room", RoomSchema)