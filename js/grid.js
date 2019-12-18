/**************************************
 * File: grid.js
 * Name: Travis Hodgin
 * Desc: Calculates and displays
 *       several pathfinding algorithms
 **************************************/
/* Global Checks */
let SET = false; // Check for drawn table
let GRID_SIZE = 20; //size of the grid will be  GRID_SIZE * GRIDSIZE
let toggleStart = false;
let toggleEnd = false;

/* color definitions */
let DEFAULT_COLOR = "#ffffff";
let VISITED_COLOR = "#fff700";
let WALL_COLOR = "#777";
let START_COLOR = "17e300"; //gre
let END_COLOR = "#ff0000"; // red
let PATH_COLOR = "#0015ff"; //blue

/* Starting positions for important nodes */
let STARTI = GRID_SIZE / 2;
let STARTJ = 1;
let ENDI = 1;
let ENDJ = 2;

/* Object containing everything we need to know about a square in the grid */
class square {
  constructor(
    cellId = null,
    type = "Empty",
    visited = false,
    color = DEFAULT_COLOR,
    cell = null,
    cost = Infinity,
    parent = null
  ) {
    this.cellId = cellId;
    this.type = type; // Empty, Wall, Start, End. Default Empty
    this.visited = visited; // True/False wether it was visited;
    this.color = color; // Hex color code;
    this.cell = cell; // designated cell in the table
    this.cost = cost;
    this.parent = parent;
  }

  get cellId() {
    return this._cellId;
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

  get parent() {
    return this._parent;
  }

  set cellId(id) {
    this._cellId = id;
  }

  set type(t) {
    this._type = t;
    if (this._cell) {
      switch (t) {
        case "Empty":
          this._cell.bgColor = DEFAULT_COLOR;
          return;
        case "Wall":
          this._cell.bgColor = WALL_COLOR;
          return;
        case "Start":
          this._cell.bgColor = START_COLOR;
          return;
        case "End":
          this._cell.bgColor = END_COLOR;
          return;
        default:
          this._cell.bgColor = DEFAULT_COLOR;
          return;
      }
    }
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
  set parent(p) {
    this._parent = p;
  }
}

/*
 * Sets the start and end of the path to be middle row, on the ends of the column
 * Inputs:
 *      -squares: array of objects representing each square of the board
 */
function setStartAndEnd(squares) {
  squares[STARTI][STARTJ].type = "Start";
  squares[ENDI][ENDJ].type = "End";
}

/*
 * returns a random integer between the given numbers
 * Inputs:
 *     - high: high end of the range
 *     - low: low end of the range
 */
function randInt(high, low) {
  return Math.floor(Math.random() * (high - low) + low);
}

function randomWalls(squares) {
  let numWalls = randInt(GRID_SIZE / 2, GRID_SIZE - 1);
  while (numWalls > 0) {
    let randRow = randInt(0, GRID_SIZE - 1);
    let randCol = randInt(0, GRID_SIZE - 1);
    if (squares[randRow][randCol].type === "Empty") {
      squares[randRow][randCol].type = "Wall";
      numWalls--;
    }
  }
}

/*
 * Sets up the clickable grid and displays on the page
 * Inputs:
 *      - squares: array of objects representing each square of the board
 */
function createGrid(squares) {
  let grid = null;
  // prevent multiple tables from displaying
  if (SET === true) {
    $(".grid").remove();
  }
  $("#setStart").click(function() {
    if (toggleEnd === false) {
      toggleStart = !toggleStart;
    } else {
      toggleStart = false;
    }
  });

  $("#setEnd").click(function() {
    if (toggleStart === false) {
      toggleEnd = !toggleEnd;
    } else {
      toggleEnd = false;
    }
  });
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
      c++;
      squares[i][j].cellId = c;
      // Add event listener for click
      squares[i][j].cell.addEventListener(
        "click",
        function(event) {
          if (toggleStart) {
            if (squares[i][j].type !== "End") {
              squares[STARTI][STARTJ].type = "Empty";
              squares[i][j].type = "Start";
              STARTI = i;
              STARTJ = j;
              toggleStart = false;
            }
          } else if (squares[i][j].type === "Start") {
            toggleStart = true;
          }
          if (toggleEnd) {
            if (squares[i][j].type !== "Start") {
              squares[ENDI][ENDJ].type = "Empty";
              squares[i][j].type = "End";
              ENDI = i;
              ENDJ = j;
              toggleEnd = false;
            }
          } else if (squares[i][j].type === "End") {
            toggleEnd = true;
          }

          //Check squares at i,j to see if its already a wall/start/end
          if (squares[i][j].type === "Wall") {
            squares[i][j].type = "Empty";
          } else if (squares[i][j].type === "Empty") {
            squares[i][j].type = "Wall";
          }
        },
        false
      );
    }
  }
  gridDiv.appendChild(grid);
  setStartAndEnd(squares);
}
