const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 20;


const KEY = {
  LEFT: 37,
  RIGHT: 39,
  DOWN: 40,
  DROP: 32,
  ROTATE: 38
}

const moveList = [
  KEY.LEFT,
  KEY.RIGHT,
  KEY.DOWN
]

const SHAPES = [
  { 
    color: 'cyan',
    shape: [
      [0, 0, 0, 0], 
      [1, 1, 1, 1], 
      [0, 0, 0, 0], 
      [0, 0, 0, 0]
    ]
  },
  { 
    color: 'blue',
    shape: [
      [2, 0, 0], 
      [2, 2, 2], 
      [0, 0, 0]
    ]
  },
  { 
    color: 'orange',
    shape: [
      [0, 0, 3], 
      [3, 3, 3], 
      [0, 0, 0]]
  },
  { 
    color: 'yellow',
    shape: [
      [4, 4], 
      [4, 4]
    ]
  },
  { 
    color: 'green',
    shape: [
      [0, 5, 5], 
      [5, 5, 0], 
      [0, 0, 0]
    ]
  },
  { 
    color: 'purple',
    shape: [
      [0, 6, 0], 
      [6, 6, 6], 
      [0, 0, 0]
    ]
  },
  { 
    color: 'red',
    shape: [
      [7, 7, 0], 
      [0, 7, 7], 
      [0, 0, 0]
    ]
  }
]