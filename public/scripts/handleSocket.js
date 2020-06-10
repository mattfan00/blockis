const socket = io()

const roomId = window.location.pathname.split('/')[2]

console.log(registeredUser)

socket.emit('joinRoom', {username, roomId})

socket.on('getOtherPlayers', (users) => {
  // Add in the other players
  const players = document.querySelector('.players')
  players.innerHTML = ''

  console.log(users)

  if (users.length == 1) {
    players.innerHTML = 'No other players'
  } else {
    var users = users.filter(user => user.socketId != socket.id)
    users.forEach(user => {
      var div = document.createElement('div')
      div.innerHTML = `
        <div class="player-slot">
          <div>${user.username}</div>
          <canvas class="board board-${user.socketId}" width="100" height="200"></canvas>
        </div>
      `
      players.appendChild(div)
    })
  }

  
})

socket.on('startGame', () => {
  const countdownArea = document.querySelector('.countdown')
  countdownArea.innerHTML = ''
  const scoreboard = document.querySelector('.scoreboard')
  scoreboard.innerHTML = ''
  board.reset()
  board.draw()
  time = { start: performance.now(), elapsed: 0, buffer: 750 }

  socket.emit('draw', {
    username,
    socketId: socket.id,
    grid: board.grid,
    piece: board.piece,
    ghost: board.ghost
  })

  gameStarted = true
  
  animate()
})

socket.on('draw', (drawDetails) => {
  const canvasPlayer = document.querySelector('.board-' + drawDetails.socketId)
  const ctxPlayer = canvasPlayer.getContext('2d');

  ctxPlayer.clearRect(0, 0, ctxPlayer.canvas.width, ctxPlayer.canvas.height);

  // draw other player pieces
  ctxPlayer.fillStyle = drawDetails.piece.color
  for (let i = 0; i < drawDetails.piece.shape.length; i++) {
    for (let j = 0; j < drawDetails.piece.shape[0].length; j++) {
      if (drawDetails.piece.shape[j][i] > 0) { 
        ctxPlayer.fillRect((drawDetails.piece.x + i)*10, (drawDetails.piece.y + j)*10, 10, 10)
      }
    }
  }

  // draw other player ghost pieces
  ctxPlayer.fillStyle = drawDetails.ghost.color
  for (let i = 0; i < drawDetails.ghost.shape.length; i++) {
    for (let j = 0; j < drawDetails.ghost.shape[0].length; j++) {
      if (drawDetails.ghost.shape[j][i] > 0) { 
        ctxPlayer.fillRect((drawDetails.ghost.x + i)*10, (drawDetails.ghost.y + j)*10, 10, 10)
      }
    }
  }

  // draw other player boards
  for (let y = 0; y < drawDetails.grid[0].length; y++) {
    for (let x = 0; x < drawDetails.grid.length; x++) {
      if (drawDetails.grid[x][y] > 0) {
        ctxPlayer.fillStyle = SHAPES[drawDetails.grid[x][y] - 1].color
        ctxPlayer.fillRect(y*10, x*10, 10, 10)
      }
    }
  }
})

socket.on('playerGameOver', (details) => {
  // // goes into if statment when this player is the last player standing and triggers wholeGameOver
  // if (details.numRemaining == 1) {
  //   socket.emit('playerGameOver', {
  //     socketId: socket.id
  //   })
  // } 
  const canvasPlayer = document.querySelector('.board-' + details.socketId)
  const ctxPlayer = canvasPlayer.getContext('2d')

  ctxPlayer.clearRect(0, 0, ctxPlayer.canvas.width, ctxPlayer.canvas.height);

  ctxPlayer.fillStyle = 'red'
  ctxPlayer.fillRect(0, 0, ctxPlayer.canvas.width, ctxPlayer.canvas.height)
  
})

socket.on('wholeGameOver', (users) => {
  gameStarted = false

  // if (winner.socketId == socket.id) {
  //   console.log('i am the winner')
  //   ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  //   ctxNext.clearRect(0, 0, ctxNext.canvas.width, ctxNext.canvas.height)

  //   ctx.fillStyle = 'green'
  //   ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  // } else {
  //   const canvasPlayer = document.querySelector('.board-' + winner.socketId)
  //   const ctxPlayer = canvasPlayer.getContext('2d')

  //   ctxPlayer.clearRect(0, 0, ctxPlayer.canvas.width, ctxPlayer.canvas.height);

  //   ctxPlayer.fillStyle = 'green'
  //   ctxPlayer.fillRect(0, 0, ctxPlayer.canvas.width, ctxPlayer.canvas.height)
  // }

  const scoreboard = document.querySelector('.scoreboard')
  console.log(users)
  users = users.sort((a,b) => (a.place > b.place) || (!a.place) ? 1 : -1) 
  users.forEach(user => {
    var div = document.createElement('div')
    div.innerHTML = `
      <div>
        ${user.place ? user.place + ' - ' : ''}${user.username} ${user.socketId == socket.id ? '(me)' : ''}
      </div>
    `
    scoreboard.appendChild(div)
  })

  cancelAnimationFrame(animationId)
})

socket.on('countdown', (count) => {
  const countdownArea = document.querySelector('.countdown')
  countdownArea.innerHTML = `Next game starts in ${count}...`
})


socket.on('message', (msg) => {
  console.table(msg)
})
