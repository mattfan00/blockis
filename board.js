class Board {
  ctx;
  piece;
  grid;

  constructor(ctx) {
    this.ctx = ctx
    this.piece = new Piece(ctx)
    this.init()
  }

  init() {
    // Calculate size of canvas from constants.
    this.ctx.canvas.width = COLS * BLOCK_SIZE;
    this.ctx.canvas.height = ROWS * BLOCK_SIZE;

    // Scale blocks
    this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
  }
  
  // Reset the board when we start a new game.
  reset() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.piece = new Piece(this.ctx);
    this.grid = this.getEmptyBoard();
  }

  draw() {
    this.piece.draw()
    this.drawBoard()
  }

  drop() {
    if (this.valid(KEY.DOWN)) {
      this.piece.move(KEY.DOWN)
    } else {
      this.freeze()
      this.clearLines()
      this.piece = new Piece(ctx)
    }
  }

  valid(key) {
    var newx = this.piece.x
    var newy = this.piece.y
    if (key == KEY.LEFT) {
      newx -= 1
    } else if (key == KEY.RIGHT) {
      newx += 1
    } else if (key == KEY.DOWN) {
      newy += 1
    }

    for (let y = 0; y < this.piece.shape[0].length; y++) {
      for (let x = 0; x < this.piece.shape.length; x++) {
        if (this.piece.shape[y][x] > 0) { 
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

