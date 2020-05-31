const express = require('express')
      router = express.Router()


router.get('/', (req, res) => {
  res.render('index')
})

router.get('/custom', (req, res) => {
  Room.find({}, (err, foundRooms) => {
    res.render('customGames', {rooms:foundRooms})
  })
})

module.exports = router