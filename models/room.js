const mongoose = require('mongoose')

var RoomSchema = new mongoose.Schema({
  name: String
})

module.exports = mongoose.model("Room", RoomSchema)