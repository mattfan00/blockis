const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

const canvasNext = document.getElementById('next')
const ctxNext = canvasNext.getContext('2d');

const canvasHold = document.getElementById('hold')
const ctxHold = canvasHold.getContext('2d');

const canvasGarb = document.getElementById("garbage") 
const ctxGarb = canvasGarb.getContext('2d')
ctxGarb.canvas.width = 10
ctxGarb.canvas.height = (20*BLOCK_SIZE) - (4*BLOCK_SIZE) - 1
ctxGarb.scale(ctxGarb.canvas.width, ctxGarb.canvas.height / MAX_GARB_LINES)

var animationId, gameStarted

let timers = {}

// let garbageLines = 0

let board = new Board(ctx, ctxNext, ctxHold)
console.log(board)

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
  document.onkeydown = (e) => {
    // e.preventDefault()
    let key = e.keyCode
    if (!(Object.values(KEY).includes(key))) 
      return true

    // dont let drop and rotate have the high repeating action
    if (!(moveList.includes(key))) {
      keyAction(key)
    }
    if (!(key in timers) && moveList.includes(key)) {
      timers[key] = null
      keyAction(key)

      // after a set amount of time, do the key action again as long as the key is being pressed down
      timers[key] = setInterval(() => {
        keyAction(key)
      }, 100)
    }
    return false
  }

  document.onkeyup = (e) => {
    let key = e.keyCode
    if (key in timers) {
      if (timers[key] !== null)
          clearInterval(timers[key]);
      delete timers[key];
    }
  }
}

function keyAction(key) {
    if (key == KEY.DROP) {
      while (board.valid(KEY.DOWN)) {
        board.piece.move(KEY.DOWN)
      }
      board.piece.draw()
      board.drop()
    } else if (key == KEY.ROTATE) {
      if (board.validRotate()) {
        board.piece.shape = board.piece.rotate()  
      }
    } else if (key == KEY.HOLD) {
      board.holdPiece()
    } else if (moveList.includes(key)) {
      if (board.valid(key)) {
        board.piece.move(key)
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


