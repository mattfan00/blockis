const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

const canvasNext = document.getElementById('next')
const ctxNext = canvasNext.getContext('2d');

var animationId, gameStarted

let board = new Board(ctx, ctxNext)

addEventListener()

function play() {
  socket.emit('startGame')
}

socket.on('startGame', () => {
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
  const canvasPlayer = document.querySelector('.board-' + details.socketId)
  const ctxPlayer = canvasPlayer.getContext('2d')

  ctxPlayer.clearRect(0, 0, ctxPlayer.canvas.width, ctxPlayer.canvas.height);

  ctxPlayer.fillStyle = 'red'
  ctxPlayer.fillRect(0, 0, ctxPlayer.canvas.width, ctxPlayer.canvas.height)
})

socket.on('wholeGameOver', (winner) => {
  gameStarted = false

  if (winner.socketId == socket.id) {
    console.log('i am the winner')
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = 'green'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  } else {
    const canvasPlayer = document.querySelector('.board-' + winner.socketId)
    const ctxPlayer = canvasPlayer.getContext('2d')

    ctxPlayer.clearRect(0, 0, ctxPlayer.canvas.width, ctxPlayer.canvas.height);

    ctxPlayer.fillStyle = 'green'
    ctxPlayer.fillRect(0, 0, ctxPlayer.canvas.width, ctxPlayer.canvas.height)
  }

  cancelAnimationFrame(animationId)
})

function animate(now = 0) {
  time.elapsed = now - time.start;
  if (time.elapsed > time.buffer) {
    time.start = now;
    if (!board.drop()) {
      gameOver()
      return
    }
  }

  // Clear board before drawing new state.
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  board.draw()
  animationId = requestAnimationFrame(animate)
}

function addEventListener() {
  document.addEventListener('keydown', e => {
    e.preventDefault()

    if (!gameStarted) {
      return
    }
  
    if (e.keyCode == KEY.DROP) {
      while (board.valid(KEY.DOWN)) {
        board.piece.move(KEY.DOWN)
      }
      board.piece.draw()
      board.drop()
    } else if (e.keyCode == KEY.ROTATE) {
      if (board.validRotate()) {
        board.piece.shape = board.piece.rotate()  
      }
    } else if (moveList.includes(e.keyCode)) {
      if (board.valid(e.keyCode)) {
        board.piece.move(e.keyCode)
      }
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    board.draw()

    socket.emit('draw', {
      username,
      socketId: socket.id,
      grid: board.grid,
      piece: board.piece,
      ghost: board.ghost
    })
  })
}

function gameOver() {
  // document.removeEventListener('keydown', () => {
  //   socket.emit('playerGameOver', {
  //     socketId: socket.id
  //   })
  // })
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.fillStyle = 'red'
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  socket.emit('playerGameOver', {
    socketId: socket.id
  })
}


