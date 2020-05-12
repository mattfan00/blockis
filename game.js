const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');


let board = new Board(ctx)

function play() {
  board.reset()
  board.draw()
  
  animate()
}

function animate() {
  addEventListener()
  setInterval(() => {
    board.drop()

    // Clear board before drawing new state.
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    board.draw()
  }, 750)
}

function addEventListener() {
  document.addEventListener('keydown', e => {
    e.preventDefault()
  
    if (e.keyCode == KEY.DROP) {
      while (board.valid(KEY.DOWN)) {
        board.piece.move(KEY.DOWN)
      }
    } else if (e.keyCode == KEY.ROTATE) {
      board.piece.rotate()
    } else if (moveList.includes(e.keyCode)) {
      if (board.valid(e.keyCode)) {
        board.piece.move(e.keyCode)
      }
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    board.draw()
  })
}
