class Piece {
  x;
  y;
  color;
  shape;
  shapeId;
  ctx;
  
  constructor(ctx, isMain) {
    this.ctx = ctx;
    if (isMain) {
      this.x = 3
      this.y = 0
    } else {
      this.x = 1
      this.y = 2
    }
    this.spawn();
  }
  
  spawn() { 
    this.shapeId = this.randomShape()
    this.color = SHAPES[this.shapeId].color
    this.shape = SHAPES[this.shapeId].shape
  
  }

  initShape(shapeId) {
    this.shapeId = shapeId
    this.color = SHAPES[this.shapeId].color
    this.shape = SHAPES[this.shapeId].shape
  }

  setPosition(isMain) {
    if (isMain) {
      this.x = 3
      this.y = 0
    } else {
      this.x = 1
      this.y = 2
    }
  }

  draw() {
    this.ctx.fillStyle = this.color
    for (let i = 0; i < this.shape.length; i++) {
      for (let j = 0; j < this.shape[0].length; j++) {
        if (this.shape[j][i] > 0) { 
          this.ctx.fillRect(this.x + i, this.y + j, 1, 1)
        }
      }
    }
  }

  move(key) {
    if (key == KEY.LEFT) {
      this.x -= 1
    } else if (key == KEY.RIGHT) {
      this.x += 1
    } else if (key == KEY.DOWN) {
      this.y += 1
    } 
  }

  rotate() {
    var shape = JSON.parse(JSON.stringify(this.shape)) // creates copy of multidimensional array

    for (let y = 0; y < shape.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [shape[x][y], shape[y][x]] = [shape[y][x], shape[x][y]];
      }
    }

    shape.forEach(row => row.reverse());
    return shape
  }


  randomShape() {
    return Math.floor(Math.random() * SHAPES.length)
  }

  makeGhost() {
    this.color = SHAPES[this.shapeId].ghostColor
  }
}