const express = require('express')
      router = express.Router()
      Room = require('../models/room')


router.get('/game', (req, res) => {
  // Room.find({}, (err, foundRooms) => {
  //   console.log(res.locals.username)
  //   let username = req.session.username
  //   req.session.username = null
  //   if (foundRooms.length == 0) {
  //     Room.create({name: 'default'}, (err, newRoom) => {
  //       res.render('game', {
  //         username,
  //         room: newRoom
  //       })
  //     })
  //   } else {
  //     res.render('game', {
  //       username,
  //       room: foundRooms[0]
  //     })
  //   }
  // })
  res.redirect("/")
})

router.post('/game', (req, res) => {
  Room.find({}, (err, foundRooms) => {
    let username = req.body.username
    console.log(username)
    if (foundRooms.length == 0) {
      Room.create({name: 'default'}, (err, newRoom) => {
        res.render('game', {
          username,
          room: newRoom
        })
      })
    } else {
      res.render('game', {
        username,
        room: foundRooms[0]
      })
    }
  })
})

router.get('/game/new', (req, res) => {
  res.render('newRoom')
})

router.get('/game/invite/:id', (req, res) => {
  // Room.findById(req.params.id, (err, foundRoom) => {
  //   res.render('game', {room: foundRoom})
  // })
  Room.findById(req.params.id, (err, foundRoom) => {
    res.render("invite", {room: foundRoom})
  })
})

router.post('/game/new', async (req, res) => {
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