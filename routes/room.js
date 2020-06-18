const express = require('express')
      router = express.Router()
      Room = require('../models/room')


router.get('/game', (req, res) => {
  Room.find({}, (err, foundRooms) => {
    if (foundRooms.length == 0) {
      Room.create({name: 'default'}, (err, newRoom) => {
        res.redirect('/game/' + newRoom.id)
      })
    } else {
      res.redirect('/game/' + foundRooms[0].id)
    }
  })
})

router.get('/game/new', (req, res) => {
  res.render('newRoom')
})

router.get('/game/:id', (req, res) => {
  Room.findById(req.params.id, (err, foundRoom) => {
    res.render('game', {room: foundRoom})
  })
})

router.post('/game', async (req, res) => {
  try {
    let { name, private } = req.body
    private = private == "on" ? true : false
    let newRoom = await Room.create({name, private})
    if (!newRoom) throw Error('Error creating room')

    res.redirect('/game/' + newRoom.id)
  } catch(err) {
    console.log(err)
  }
})

module.exports = router