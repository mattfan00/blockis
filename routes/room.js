const express = require('express')
      router = express.Router()
      Room = require('../models/room')


router.get('/game', (req, res) => {
  console.log(req.user)
  res.render('game')
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
    let newChat = await Room.create({name})
    if (!newChat) throw Error('Error creating room')

    res.redirect('/')
  } catch(err) {
    console.log(err)
  }
})

module.exports = router