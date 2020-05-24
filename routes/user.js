const express = require('express')
      router = express.Router()
      passport = require("passport")
      User = require('../models/user')

router.get('/api/user', (req, res) => {
  res.json(req.user)
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login"
}), function(req, res) {
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', async (req, res) => {
  try {
    let newUser = await User.register(new User({username: req.body.username}), req.body.password)
    if(!newUser) throw Error('Error registering user')

    passport.authenticate('local')(req, res, () => {
      res.redirect('/')
    })
  } catch(err) {
    console.log(err)
  }
})

router.get('/logout', (req, res) => {
  console.log(req.user.username + " has logged out")
  req.logout()
  res.redirect("/login")
})

module.exports = router