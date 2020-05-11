class Board {
  ctx;
  piece;
  grid;

  constructor(ctx) {
    this.ctx = ctx
  }
  
  // Reset the board when we start a new game.
  reset() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.grid = this.getEmptyBoard();
  }
  
  // Get matrix filled with zeros.
  getEmptyBoard() {
    return Array.from(
      {length: ROWS}, () => Array(COLS).fill(0)
    );
  }
}

