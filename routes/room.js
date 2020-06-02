const express = require('express')
      router = express.Router()
      Room = require('../models/room')


router.get('/game', (req, res) => {
  Room.find({}, (err, foundRooms) => {
    if (foundRooms.length == 0) {
      Room.create({name: 'default'}, (err, newRoom) => {
        console.log(newRoom)
        res.redirect('/game/' + newRoom.id)
      })
    } else {
      console.log(foundRooms)
      res.redirect('/game/' + foundRooms[0].id)
    }
  })
})

router.get('/game/new', (req, res) => {
  res.render('newRoom')
})

router.get('/game/:id', (req, res) => {
  res.render('game')
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

module.exports = router