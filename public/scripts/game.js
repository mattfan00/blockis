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
  // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  // ctxNext.clearRect(0, 0, ctxNext.canvas.width, ctxNext.canvas.height)

  // ctx.fillStyle = 'red'
  // ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  socket.emit('playerGameOver', {
    socketId: socket.id
  })
}


