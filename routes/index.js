const express = require('express')
      router = express.Router()


router.get('/', (req, res) => {
  res.render('index')
})

router.get('/custom', (req, res) => {
  Room.find({}, (err, foundRooms) => {
    res.render('gameList', {rooms:foundRooms})
  })
})

router.get('/settings', (req, res) => {
  res.render('settings')
})

module.exports = router