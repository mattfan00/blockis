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
    const { name } = req.body
    let newRoom = await Room.create({name})
    if (!newRoom) throw Error('Error creating room')

    res.redirect('/')
  } catch(err) {
    console.log(err)
  }
})

router.get("/api/game/:id", (req, res) => {
  Room.findById(req.params.id, (err, foundRoom) => {
    res.json(foundRoom)
  })
})

module.exports = router