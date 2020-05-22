const express = require('express')
      app = express()



app.use(express.static(__dirname + "/public"))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/game', (req, res) => {
  res.render('game')
})

app.listen(3000, () => console.log('Tetris server running'))