class Board {
  ctx;
  ctxNext;
  ctxHold;
  piece;
  nextPiece;
  hold;
  changedHold;
  ghost;
  grid;

  constructor(ctx, ctxNext, ctxHold, ctxGarb) {
    this.ctx = ctx
    this.ctxNext = ctxNext
    this.ctxHold = ctxHold
    this.ctxGarb = ctxGarb
    this.changedHold = false
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
    this.ctxNext.scale(13, 13)
    // this.ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);

    this.ctxHold.canvas.width = 4 * BLOCK_SIZE;
    this.ctxHold.canvas.height = 4 * BLOCK_SIZE;
    this.ctxHold.scale(13, 13)
    // this.ctxHold.scale(BLOCK_SIZE, BLOCK_SIZE);

    this.ctxGarb.canvas.width = 10
    this.ctxGarb.canvas.height = (20*BLOCK_SIZE) - (4*BLOCK_SIZE) - 1
    this.ctxGarb.scale(ctxGarb.canvas.width, ctxGarb.canvas.height / MAX_GARB_LINES)
  }
  
  // Reset the board when we start a new game.
  reset() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctxNext.clearRect(0, 0, this.ctxNext.canvas.width, this.ctxNext.canvas.height);
    this.ctxHold.clearRect(0, 0, this.ctxHold.canvas.width, this.ctxHold.canvas.height);
    this.ctxGarb.clearRect(0, 0, this.ctxGarb.canvas.width, this.ctxGarb.canvas.height)
    this.piece = new Piece(this.ctx, true);
    this.ghost = Object.assign(Object.create(Object.getPrototypeOf(this.piece)), this.piece)
    this.getNewPiece()
    this.hold = null
    this.grid = this.getEmptyBoard();
  }

  draw() {
    // this.ghost = Object.create(this.piece) // copy piece
    this.ghost = Object.assign(Object.create(Object.getPrototypeOf(this.piece)), this.piece) // copy piece
    this.ghost.makeGhost()
    while (this.valid(KEY.DOWN, this.ghost)) {
      this.ghost.move(KEY.DOWN)
    }
    this.piece.draw()
    this.ghost.draw()
    if (this.hold) {
      this.hold.draw()
    }
    this.drawBoard()
    // socket.emit('draw', {
    //   username,
    //   socketId: socket.id,
    //   grid: this.grid,
    //   piece: this.piece,
    //   ghost: this.ghost
    // })
  }

  getNewPiece() {
    this.nextPiece = new Piece(this.ctxNext, false);
    
    this.ctxNext.clearRect(0, 0, this.ctxNext.canvas.width, this.ctxNext.canvas.height);
    this.nextPiece.draw();
  }

  drop() {
    if (this.valid(KEY.DOWN)) {
      this.piece.move(KEY.DOWN)
    } else {
      this.freeze()
      this.clearLines()
      if (garbageLines > 0) {
        console.log("adding garbage")
        this.addGarbage()
      }
      if (this.piece.y <= 0) {
        // Game over
        return false;
      }
      this.piece = this.nextPiece
      this.piece.ctx = this.ctx;
      this.piece.setPosition(true)
      this.getNewPiece()
      this.changedHold = false
    }
    socket.emit('draw', {
      username,
      socketId: socket.id,
      grid: this.grid,
      piece: this.piece, 
      ghost: this.ghost
    })
    return true
  }

  holdPiece() {
    if (!this.hold) {
      // this.hold = Object.assign(Object.create(Object.getPrototypeOf(this.piece)), this.piece) // copy piece
      this.hold = new Piece(this.ctxHold, false)
      this.hold.initShape(this.piece.shapeId)
      this.piece = this.nextPiece 
      this.piece.ctx = this.ctx;
      this.piece.setPosition(true)
      this.getNewPiece()
      this.changedHold = true
    } else {
      if (!this.changedHold) {
        this.ctxHold.clearRect(0, 0, this.ctxHold.canvas.width, this.ctxHold.canvas.height);
        let pieceShape = this.piece.shapeId
        this.piece.initShape(this.hold.shapeId)
        this.piece.setPosition(true)
        this.hold.initShape(pieceShape)
        this.changedHold = true
      }
    }
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
  
  validRotate(piece=this.piece) {
    var newShape = piece.rotate()
    for (let y = 0; y < newShape[0].length; y++) {
      for (let x = 0; x < newShape.length; x++) {
        if (newShape[y][x] > 0) { 
          var tempx = piece.x + x
          var tempy = piece.y + y
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
          if (this.grid[x][y] == 8) {
            this.ctx.fillStyle = "rgba(176, 176, 176, 1)"
          } else {
            this.ctx.fillStyle = SHAPES[this.grid[x][y] - 1].color
          }
          this.ctx.fillRect(y, x, 1, 1)
        }
      }
    }
  }

  clearLines() {
    let numCleared = 0
    for (let row = 0; row < this.grid.length; row++) {
      if (this.grid[row].every(i => i > 0)) {
        // Remove the row.
        this.grid.splice(row, 1);
        numCleared++

        // Add zero filled row at the top.
        this.grid.unshift(Array(COLS).fill(0));
      }
    }

    if (numCleared > 0) {
      let numSend = 0
      console.log("currenlty have " + garbageLines + " garbage lines queued")
      console.log("generated " + GARBAGE[numCleared])
      if (garbageLines - GARBAGE[numCleared] < 0) {
        garbageLines = 0
        numSend = Math.abs(garbageLines - GARBAGE[numCleared])
      } else { 
        garbageLines -= GARBAGE[numCleared]
      }
      
      document.querySelector(".garbage").innerHTML = garbageLines

      if (numSend > 0) {
        console.log("sending " + numSend + " garbage lines")
        socket.emit('garbage', numSend)
      }
    }
  }

  addGarbage() {
    let gapIndex = Math.floor(Math.random() * COLS)
    let gapArray = Array(COLS).fill(8)
    gapArray[gapIndex] = 0

    for (let i = 0; i < garbageLines; i++) {
      this.grid.splice(0, 1)
      this.grid.push(gapArray)
    }

    garbageLines = 0
    // document.querySelector(".garbage").innerHTML = garbageLines
    this.ctxGarb.clearRect(0, 0, this.ctxGarb.canvas.width, this.ctxGarb.canvas.height)


    console.table(this.grid)

  }
  
  // Get matrix filled with zeros.
  getEmptyBoard() {
    return Array.from(
      {length: ROWS}, () => Array(COLS).fill(0)
    );
  }
}

