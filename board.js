class Board {
  ctx;
  ctxNext;
  piece;
  nextPiece;
  ghost;
  grid;

  constructor(ctx, ctxNext) {
    this.ctx = ctx
    this.ctxNext = ctxNext
    this.init()
  }

  init() {
    // Calculate size of canvas from constants.
    this.ctx.canvas.width = COLS * BLOCK_SIZE;
    this.ctx.canvas.height = ROWS * BLOCK_SIZE;
    // Scale blocks
    this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

    // Size canvas for four blocks.
    this.ctxNext.canvas.width = 4 * BLOCK_SIZE;
    this.ctxNext.canvas.height = 4 * BLOCK_SIZE;
    this.ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);
  }
  
  // Reset the board when we start a new game.
  reset() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctxNext.clearRect(0, 0, this.ctxNext.canvas.width, this.ctxNext.canvas.height);
    this.piece = new Piece(this.ctx);
    this.ghost = Object.create(this.piece)
    this.getNewPiece()
    this.grid = this.getEmptyBoard();
  }

  draw() {
    this.ghost = Object.create(this.piece) // copy piece
    this.ghost.makeGhost()
    while (this.valid(KEY.DOWN, this.ghost)) {
      this.ghost.move(KEY.DOWN)
    }
    this.piece.draw()
    this.ghost.draw()
    this.drawBoard()
  }

  getNewPiece() {
    this.nextPiece = new Piece(this.ctxNext);
    this.ctxNext.clearRect(0, 0, this.ctxNext.canvas.width, this.ctxNext.canvas.height);
    this.nextPiece.draw();
  }

  drop() {
    if (this.valid(KEY.DOWN)) {
      this.piece.move(KEY.DOWN)
    } else {
      this.freeze()
      this.clearLines()
      if (this.piece.y === 0) {
        // Game over
        return false;
      }
      this.piece = this.nextPiece
      this.piece.ctx = this.ctx;
      this.getNewPiece()
    }
    return true
  }

  valid(key, piece=this.piece) {
    var newx = piece.x
    var newy = piece.y
    if (key == KEY.LEFT) {
      newx -= 1
    } else if (key == KEY.RIGHT) {
      newx += 1
    } else if (key == KEY.DOWN) {
      newy += 1
    }

    for (let y = 0; y < piece.shape[0].length; y++) {
      for (let x = 0; x < piece.shape.length; x++) {
        if (piece.shape[y][x] > 0) { 
          var tempx = newx + x
          var tempy = newy + y
          if ((tempx < 0) || (tempx > COLS - 1) || (tempy > ROWS - 1) || (this.grid[tempy][tempx] != 0)) {
            return false
          }
        }
      }
    }
    return true
  }

  freeze() { 
    for (let y = 0; y < this.piece.shape[0].length; y++) {
      for (let x = 0; x < this.piece.shape.length; x++) {
        if (this.piece.shape[y][x] > 0) {
          var tempx = this.piece.x + x
          var tempy = this.piece.y + y
          this.grid[tempy][tempx] = this.piece.shape[y][x]
        }
      }
    }
  }

  drawBoard() {
    for (let y = 0; y < this.grid[0].length; y++) {
      for (let x = 0; x < this.grid.length; x++) {
        if (this.grid[x][y] > 0) {
          this.ctx.fillStyle = SHAPES[this.grid[x][y] - 1].color
          this.ctx.fillRect(y, x, 1, 1)
        }
      }
    }
  }

  clearLines() {
    for (let row = 0; row < this.grid.length; row++) {
      if (this.grid[row].every(i => i > 0)) {
        // Remove the row.
        this.grid.splice(row, 1);

        // Add zero filled row at the top.
        this.grid.unshift(Array(COLS).fill(0));
      }
    }
  }
  
  // Get matrix filled with zeros.
  getEmptyBoard() {
    return Array.from(
      {length: ROWS}, () => Array(COLS).fill(0)
    );
  }
}

