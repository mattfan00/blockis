const express = require('express')
      app = express()
      config = require('config')
      mongoose = require('mongoose')
      passport = require('passport')
      LocalStrategy = require('passport-local')
      User = require('./models/user')

const userRoutes = require('./routes/user')



const db = config.get('mongoURI')
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})

app.use(express.static(__dirname + "/public"))
app.set('view engine', 'ejs')

app.use(express.urlencoded())
app.use(express.json())

app.use(require("express-session")({
  secret: "this is my secret",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())




app.use(userRoutes)

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/game', (req, res) => {
  res.render('game')
})





app.listen(3000, () => console.log('Tetris server running'))