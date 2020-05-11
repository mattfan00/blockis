const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

// Calculate size of canvas from constants.
ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

// Scale blocks
ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

let board = new Board(ctx)

function play() {
  board.reset()

  let piece = new Piece(ctx)
  board.piece = piece
  board.piece.draw()
}

document.addEventListener('keydown', e => {
  e.preventDefault()

  if (moveList.includes(e.keyCode)) {
    board.piece.move(e.keyCode)
  } else if (e.keyCode == KEY.ROTATE) {
    board.piece.rotate()
  }
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  board.piece.draw()
})