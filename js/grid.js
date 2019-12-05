let GRID_SIZE = 20;
let DEFAULT_COLOR = "#ffffff"; // white
let VISITED_COLOR = "#fff700"; //yellow
let WALL_COLOR = "#777"; // gray
let START_COLOR = "17e300"; //green
let END_COLOR = "#ff0000"; // red
let PATH_COLOR = "#0015ff"; //blue
let SET = false; // Check for drawn table
let STARTI = GRID_SIZE / 2;
let STARTJ = 0;
let ENDI = GRID_SIZE / 2;
let ENDJ = GRID_SIZE - 1;

/* Object containing everything we need to know about a square in the grid */
class square {
  constructor(
    cellId = null,
    type = "Empty",
    visited = false,
    color = DEFAULT_COLOR,
    cell = null,
    cost = Infinity
  ) {
    this.cellId = cellId;
    this.type = type; // Empty, Wall, Start, End. Default Empty
    this.visited = visited; // True/False wether it was visited;
    this.color = color; // Hex color code;
    this.cell = cell; // designated cell in the table
    this.cost = cost;
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

  set cellId(id) {
    this._cellId = id;
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
  squares[STARTI][STARTJ].type = "Start";
  squares[STARTI][STARTJ].cell.bgColor = START_COLOR;
  squares[ENDI][ENDJ].type = "End";
  squares[ENDI][ENDJ].cell.bgColor = END_COLOR;
}

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
      squares[i][j].cell.innerHTML = ++c; // this is temporary to test drawing
      squares[i][j].cellId = c;
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
function displayPath(path) {
  for (let i = 0; i < path.length; i++) {
    path[i].cell.bgColor = PATH_COLOR;
  }
}

function findNeighbors(cur, squares, search) {
  // check i-1, i+1, j-1, j+1 and push onto search array
  let row = 0;
  let col = 0;
  // find where the current node is in the array
  for (i = 0; i < GRID_SIZE; i++) {
    for (j = 0; j < GRID_SIZE; j++) {
      if (squares[i][j].cellId === cur.cellId) {
        row = i;
        col = j;
      }
    }
  }
  let found = [4]; // bool for if any of the neighbors are found in search
  found[0] = false;
  found[1] = false;
  found[2] = false;
  found[3] = false;
  let path = search;
  // check each of the neighbors to see if they are in search
  for (let j = 0; j < search.length; j++) {
    if (row - 1 >= 0) {
      if (squares[row - 1][col].cellId === search[j].cellId) {
        found[0] = true;
      }
    }
    if (row + 1 < GRID_SIZE) {
      if (squares[row + 1][col].cellId === search[j].cellId) {
        found[1] = true;
      }
    }
    if (col - 1 >= 0) {
      if (squares[row][col - 1].cellId === search[j].cellId) {
        found[2] = true;
      }
    }
    if (col + 1 < GRID_SIZE) {
      if (squares[row][col + 1].cellId === search[j].cellId) {
        found[3] = true;
      }
    }
  }
  if (found[0] === false && row - 1 >= 0) {
    if (
      squares[row - 1][col].visited === false &&
      squares[row - 1][col].type != "Wall"
    ) {
      path.push(squares[row - 1][col]);
    }
  }
  if (found[1] === false && row + 1 < GRID_SIZE) {
    if (
      squares[row + 1][col].visited === false &&
      squares[row + 1][col].type != "Wall"
    ) {
      path.push(squares[row + 1][col]);
    }
  }
  if (found[2] === false && col - 1 >= 0) {
    if (
      squares[row][col - 1].visited === false &&
      squares[row][col - 1].type != "Wall"
    ) {
      path.push(squares[row][col - 1]);
    }
  }
  if (found[3] === false && col + 1 < GRID_SIZE) {
    if (
      squares[row][col + 1].visited === false &&
      squares[row][col + 1].type != "Wall"
    ) {
      path.push(squares[row][col + 1]);
    }
  }
  return path;
}

function breadthFirst(squares) {
  let search = [];
  let path = [];
  search.push(squares[STARTI][STARTJ]);
  //while (search.length > 0) {
  let step = window.setInterval(function() {
    let node = search.shift(); // get first node;
    path.push(node);
    console.log("Path: " + path);
    node.visited = true; // visit node
    if (node.type === "Empty") {
      node.cell.bgColor = VISITED_COLOR;
    }
    if (node.type === "End") {
      //found the node, send path
      displayPath(path);
      clearInterval(step);
    } else {
      console.log("Searching");
      let neighbors = findNeighbors(node, squares, search);
      search = search.concat(neighbors); // add neighbors to list if not wall, or already visited
    }
  }, 25);
}

function depthFirst(squares, starti, startj) {
  let search = [];
  let path = [];
  search.push(squares[STARTI][STARTJ]);
  //while (search.length > 0) {
  let step = window.setInterval(function() {
    let node = search.pop(0); // get first node;
    path.push(node);
    console.log("Path: " + path);
    node.visited = true; // visit node
    if (node.type === "Empty") {
      node.cell.bgColor = VISITED_COLOR;
    }
    if (node.type === "End") {
      //found the node, send path
      displayPath(path);
      clearInterval(step);
    } else {
      console.log("Searching");
      let neighbors = findNeighbors(node, squares, search);
      search = search.concat(neighbors); // add neighbors to list if not wall, or already visited
    }
  }, 25);
}

let algorithms = {
  breadth: breadthFirst,
  depth: depthFirst
};

function getAlgorithms(alg) {
  return algorithms[alg];
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
    clearInterval();
    createGrid(squares);
  });

  $("#start").click(function() {
    let alg = $("#algoSelect").val();
    let pathFunction = getAlgorithms(alg);
    pathFunction(squares);
  });
});
