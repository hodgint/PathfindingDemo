let GRID_SIZE = 20;
let DEFAULT_COLOR = "#ffffff"; // white
let VISITED_COLOR = "#fff700"; //yellow
let WALL_COLOR = "#777"; // gray
let START_COLOR = "17e300"; //green
let END_COLOR = "#ff0000"; // red
let PATH_COLOR = "#0015ff"; //blue
let SET = false; // Check for drawn table

/* Object containing everything we need to know about a square in the grid */
class square {
  constructor(
    type = "Empty",
    visited = false,
    color = DEFAULT_COLOR,
    cell = null,
    cost = 999999
  ) {
    this.type = type; // Empty, Wall, Start, End. Default Empty
    this.visited = visited; // True/False wether it was visited;
    this.color = color; // Hex color code;
    this.cell = cell; // designated cell in the table
    this.cost = cost;
  }

  get type() {
    return this._type;
  }

  get visited() {
    return this._visited;
  }

  get color() {
    return this._color;
  }

  get cell() {
    return this._cell;
  }

  get cost() {
    return this._cost;
  }

  set type(t) {
    this._type = t;
  }

  set visited(v) {
    this._visited = v;
  }

  set color(clr) {
    this._color = clr;
  }

  set cell(c) {
    this._cell = c;
  }

  set cost(cs) {
    this._cost = cs;
  }
}

/*
 * Sets the start and end of the path to be middle row, on the ends of the column
 */
function setStartAndEnd(squares) {
  let mid = Math.floor(GRID_SIZE / 2);
  squares[mid][0].type = "Start";
  squares[mid][0].cell.bgColor = START_COLOR;
  squares[mid][GRID_SIZE - 1].type = "End";
  squares[mid][GRID_SIZE - 1].cell.bgColor = END_COLOR;
}

function randInt(high, low) {
  return Math.floor(Math.random() * (high - low) + low);
}

function randomWalls(squares) {
  let numWalls = randInt(1, GRID_SIZE - 1);
  while (numWalls > 0) {
    let randRow = randInt(0, GRID_SIZE - 1);
    let randCol = randInt(0, GRID_SIZE - 1);
    if (squares[randRow][randCol].type === "Empty") {
      squares[randRow][randCol].type = "Wall";
      squares[randRow][randCol].cell.bgColor = WALL_COLOR;
      numWalls--;
    }
  }
}

/*
 * Sets up the clickable grid and displays on the page
 */
function createGrid(squares) {
  let grid = null;
  // prevent multiple tables from displaying
  if (SET === true) {
    $(".grid").remove();
  }
  SET = true;
  let c = 0;
  let gridDiv = document.getElementById("grid");
  grid = document.createElement("table");
  grid.className = "grid";
  for (let i = 0; i < GRID_SIZE; ++i) {
    let tr = grid.appendChild(document.createElement("tr"));
    for (let j = 0; j < GRID_SIZE; ++j) {
      squares[i][j].cell = tr.appendChild(document.createElement("td"));
      //squares[i][j].cell.innerHTML = ++c; // this is temporary to test drawing

      // Add event listener for click
      squares[i][j].cell.addEventListener("click", function() {
        //Check squares at i,j to see if its already a wall/start/end
        if (squares[i][j].type === "Wall") {
          squares[i][j].type = "Empty";
          squares[i][j].cell.bgColor = DEFAULT_COLOR;
        } else if (squares[i][j].type === "Empty") {
          squares.type = "Wall";
          squares[i][j].cell.bgColor = WALL_COLOR;
        }
      });
    }
  }
  gridDiv.appendChild(grid);
  setStartAndEnd(squares);
}

$(function() {
  let squares = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    squares[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      squares[i][j] = new square();
    }
  }
  createGrid(squares);
  $("#randWalls").click(function() {
    createGrid(squares);
    randomWalls(squares);
  });
  $("#clear").click(function() {
    createGrid(squares);
  });
  $("#start").click(function() {
    //find algo
  });
});
