const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

const canvasNext = document.getElementById('next')
const ctxNext = canvasNext.getContext('2d');

let board = new Board(ctx, ctxNext)

function play() {
  socket.emit('startGame')
}

socket.on('startGame', () => {
  board.reset()
  board.draw()
  addEventListener()
  time = { start: performance.now(), elapsed: 0, buffer: 750 }
  
  animate()
})

socket.on('draw', (drawDetails) => {
  // console.log(drawDetails)
  const canvasPlayer = document.querySelector('.board-' + drawDetails.socketId)
  const ctxPlayer = canvasPlayer.getContext('2d');

  ctxPlayer.clearRect(0, 0, ctxPlayer.canvas.width, ctxPlayer.canvas.height);

  for (let y = 0; y < drawDetails.grid[0].length; y++) {
    for (let x = 0; x < drawDetails.grid.length; x++) {
      if (drawDetails.grid[x][y] > 0) {
        ctxPlayer.fillStyle = SHAPES[drawDetails.grid[x][y] - 1].color
        ctxPlayer.fillRect(y*10, x*10, 10, 10)
      }
    }
  }
})

function animate(now = 0) {
  time.elapsed = now - time.start;
  if (time.elapsed > time.buffer) {
    time.start = now;
    if (!board.drop()) {
      return
    }
  }

  // Clear board before drawing new state.
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  board.draw()
  requestAnimationFrame(animate)
}

function addEventListener() {
  document.addEventListener('keydown', e => {
    e.preventDefault()
  
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

    socket.emit('move', 'A player has moved')

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    board.draw()
  })
}


