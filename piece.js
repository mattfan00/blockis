class Piece {
  x;
  y;
  color;
  shape;
  ctx;
  
  constructor(ctx) {
    this.ctx = ctx;
    this.x = 0;
    this.y = 0;
    this.spawn();
  }
  
  spawn() {
    const i = this.randomShape()
    this.color = SHAPES[i].color
    this.shape = SHAPES[i].shape
  
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
    var shape = this.shape

    for (let y = 0; y < shape.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [shape[x][y], shape[y][x]] = [shape[y][x], shape[x][y]];
      }
    }

    shape.forEach(row => row.reverse());
  }


  randomShape() {
    return Math.floor(Math.random() * SHAPES.length)
  }
}