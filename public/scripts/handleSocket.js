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

  console.log(details.socketId == socket.id)

  const canvasPlayer = (details.socketId == socket.id) ? document.getElementById('board') : document.querySelector('.board-' + details.socketId)
  const ctxPlayer = canvasPlayer.getContext('2d')

  ctxPlayer.clearRect(0, 0, ctxPlayer.canvas.width, ctxPlayer.canvas.height);

  ctxPlayer.fillStyle = 'white'
  ctxPlayer.textAlign = 'center'

  let text
  switch (details.place % 10) {
    case 1: 
      text = details.place + 'st'
      break
    case 2: 
      text = details.place + 'nd'
      break
    case 3: 
      text = details.place + 'rd'
      break
    default: 
      text = details.place + 'th'
      break
  }

  // need to accomodate for different scaling for the main board
  if (details.socketId == socket.id) {
    ctxPlayer.font = 'bold 2px ubuntu'
    ctxPlayer.fillText(text,  (ctxPlayer.canvas.width/2)/BLOCK_SIZE, (ctxPlayer.canvas.height/2)/BLOCK_SIZE );
  } else {
    ctxPlayer.font = 'bold 18px ubuntu'
    ctxPlayer.fillText(text,  ctxPlayer.canvas.width/2, ctxPlayer.canvas.height/2);
  }
})

socket.on('wholeGameOver', (details) => {
  gameStarted = false

  if (details.winner.socketId == socket.id) {
    console.log('i am the winner')
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctxNext.clearRect(0, 0, ctxNext.canvas.width, ctxNext.canvas.height)

    ctx.fillStyle = 'white'
    ctx.textAlign = 'center'
    ctx.font = 'bold 2px ubuntu'
    ctx.fillText('1st',  (ctx.canvas.width/2)/BLOCK_SIZE, (ctx.canvas.height/2)/BLOCK_SIZE );
  } else {
    const canvasPlayer = document.querySelector('.board-' + details.winner.socketId)
    const ctxPlayer = canvasPlayer.getContext('2d')

    ctxPlayer.clearRect(0, 0, ctxPlayer.canvas.width, ctxPlayer.canvas.height);

    ctxPlayer.fillStyle = 'white'
    ctxPlayer.textAlign = 'center'
    ctxPlayer.font = 'bold 18px ubuntu'
    ctxPlayer.fillText('1st',  ctxPlayer.canvas.width/2, ctxPlayer.canvas.height/2);
  }

  const scoreboard = document.querySelector('.scoreboard')
  users = details.users.sort((a,b) => (a.place > b.place) || (!a.place) ? 1 : -1) 
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
