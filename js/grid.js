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
let intervalId;

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
  squares[STARTI][STARTJ].cell.bgColor = START_COLOR;
  squares[ENDI][ENDJ].type = "End";
  squares[ENDI][ENDJ].cell.bgColor = END_COLOR;
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
      squares[randRow][randCol].cell.bgColor = WALL_COLOR;
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
          //Check squares at i,j to see if its already a wall/start/end
          if (toggleStart) {
            squares[STARTI][STARTJ].type = "Empty";
            squares[STARTI][STARTJ].cell.bgColor = DEFAULT_COLOR;
            squares[i][j].type = "Start";
            squares[i][j].cell.bgColor = START_COLOR;
            STARTI = i;
            STARTJ = j;
            toggleStart = false;
          }
          if (toggleEnd) {
            squares[ENDI][ENDJ].type = "Empty";
            squares[i][j].type = "End";
            squares[ENDI][ENDJ].cell.bgColor = DEFAULT_COLOR;
            squares[i][j].cell.bgColor = END_COLOR;
            ENDI = i;
            ENDJ = j;
            toggleEnd = false;
          }
          if (squares[i][j].type === "Wall") {
            squares[i][j].type = "Empty";
            squares[i][j].cell.bgColor = DEFAULT_COLOR;
          } else if (squares[i][j].type === "Empty") {
            squares[i][j].type = "Wall";
            squares[i][j].cell.bgColor = WALL_COLOR;
          }
        },
        false
      );
    }
  }
  gridDiv.appendChild(grid);
  setStartAndEnd(squares);
}

/*
 * Changes the squares of the board that represent the path
 * Inputs:
 *     - path: list of nodes that represent a path
 */
function displayPath(path) {
  for (let i = 0; i < path.length; i++) {
    if (path[i].type !== "End") {
      path[i].cell.bgColor = PATH_COLOR;
    }
  }
  //re-enable sets
  document.getElementById("setStart").disabled = false;
  document.getElementById("setEnd").disabled = false;
}

/*
 * Finds the i, j value for the current node in the squares array
 * Inputs:
 *     - cur: current tnode we are at
 *     - squares: array of objects representing each square of the board
 */
function findPlacement(cur, squares) {
  let placement = [2];
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (cur.cellId === squares[i][j].cellId) {
        placement[0] = i;
        placement[1] = j;
        return placement;
      }
    }
  }
}

/*
 * Checks the search array to see if the current node is already in it.
 * Inputs:
 *     -cur: current node we are at
 *     - search: array of nodes that we are searching on
 */
function checkSearch(cur, search) {
  for (let i = 0; i < search.length; i++) {
    if (cur.cellId === search[i].cellId) {
      return true;
    }
  }
  return false;
}

/*
 * Finds the neighbors around the current node. Will check above, right, left and below.
 * Inputs:
 *     - cur: current node we are at
 *     - squares: array of objects representing each square of the board
 *     - searhc: array of nodes that we will search on
 */
function findNeighbors(cur, squares, search) {
  // check i-1, i+1, j-1, j+1 and push onto search array
  let placement = findPlacement(cur, squares);
  let row = placement[0];
  let col = placement[1];
  // find where the current node is in the array
  let path = [];
  // check each of the neighbors to see if they are in search
  if (row - 1 >= 0) {
    if (checkSearch(squares[row - 1][col], search) === false) {
      if (
        squares[row - 1][col].visited === false &&
        squares[row - 1][col].type !== "Wall"
      ) {
        squares[row - 1][col].parent = squares[row][col];
        path.push(squares[row - 1][col]);
      }
    }
  }
  if (row + 1 < GRID_SIZE) {
    if (checkSearch(squares[row + 1][col], search) === false) {
      if (
        squares[row + 1][col].visited === false &&
        squares[row + 1][col].type != "Wall"
      ) {
        squares[row + 1][col].parent = squares[row][col];
        path.push(squares[row + 1][col]);
      }
    }
  }
  if (col - 1 >= 0) {
    if (checkSearch(squares[row][col - 1], search) === false) {
      if (
        squares[row][col - 1].visited === false &&
        squares[row][col - 1].type != "Wall"
      ) {
        squares[row][col - 1].parent = squares[row][col];
        path.push(squares[row][col - 1]);
      }
    }
  }
  if (col + 1 < GRID_SIZE) {
    if (checkSearch(squares[row][col + 1], search) === false) {
      if (
        squares[row][col + 1].visited === false &&
        squares[row][col + 1].type != "Wall"
      ) {
        squares[row][col + 1].parent = squares[row][col];
        path.push(squares[row][col + 1]);
      }
    } else {
    }
  }
  return path;
}

/*
 * Finds path by tracing from end to start.
 */
function backTrace(end) {
  let path = [];
  let cur = end;
  while (cur.type !== "Start") {
    path.push(cur);
    cur = cur.parent;
  }
  return path.reverse();
}

/*
 * Breadth first algorithm to find path from start to end.
 * Input:
 *   -Squares: array of objects representing each square of the board.
 */
function breadthFirst(squares, interval) {
  // disable set start and end buttons so you can't do set them while alg is running
  document.getElementById("setStart").disabled = true;
  document.getElementById("setEnd").disabled = true;
  let search = [];
  let path = [];
  search.push(squares[STARTI][STARTJ]);
  let step = window.setInterval(function() {
    let node = search.shift(); // get first node;
    path.push(node);
    node.visited = true; // visit node
    if (node.type === "Empty") {
      node.cell.bgColor = VISITED_COLOR;
    }
    if (node.type === "End") {
      clearInterval(step);
      //found the node, send path
      let finalPath = backTrace(node);
      displayPath(finalPath);
    } else {
      let neighbors = findNeighbors(node, squares, search);
      search = search.concat(neighbors); // add neighbors to list if not wall, or already visited
    }
    if (search.length === 0) {
      alert("No path found");
    }
  }, interval);
}

/*
 * Depth first algorithm to find path from start to end.
 * Input:
 *   -Squares: array of objects represeting each square of the board.
 */
function depthFirst(squares, interval) {
  // disable set start and end buttons so you can't do set them while alg is running
  document.getElementById("setStart").disabled = true;
  document.getElementById("setEnd").disabled = true;
  let search = [];
  let path = [];
  search.push(squares[STARTI][STARTJ]);
  let step = window.setInterval(function() {
    let node = search.pop(0); // get first node;
    path.push(node);
    node.visited = true; // visit node
    if (node.type === "Empty") {
      node.cell.bgColor = VISITED_COLOR;
    }
    if (node.type === "End") {
      clearInterval(step);
      //found the node, send path
      let finalPath = backTrace(node);
      displayPath(finalPath);
    } else {
      let neighbors = findNeighbors(node, squares, search);
      search = search.concat(neighbors); // add neighbors to list if not wall, or already visited
    }
    if (search.length === 0) {
      alert("No path found");
    }
  }, interval);
}

/* references to each algorithm */
let algorithms = {
  breadth: breadthFirst,
  depth: depthFirst
};

/* descriptions for each algorithm */
let descriptions = {
  breadth:
    "Breadth first searches by looking at each nodes neighbors first. This algorithm will find the shortest path.",
  depth:
    "Depth first seaches by going down a row as far as it can, and then going moving over rows. This algorithm will not always find the shortest path as it checks the deepest node first."
};

/* pseudo code for each algorithm */
let code = {
  breadth: "code for breadth first",
  depth: "code for depth first"
};

/* retrives the algorithm to use. */
function getAlgorithms(alg) {
  return algorithms[alg];
}

/* Gets the description for the given algorithm */
function getDescriptions(alg) {
  return descriptions[alg];
}
/* Gets the pseudo code for given algorithm */
function getCode(alg) {
  return code[alg];
}

/*
 * resets the board by resetting color and visited.
 */
function reset(squares) {
  toggleStart = false;
  toggleEnd = false;
  if (squares) {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        squares[i][j].visited = false;
        if (squares[i][j].type === "Empty") {
          squares[i][j].cell.bgColor = DEFAULT_COLOR;
        }
      }
    }
  }
}

/* Button functionality */
$(function() {
  // open modal on page load
  $(window).on("load", function() {
    $("#instructions").modal("show");
  });
  let squares = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    squares[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      squares[i][j] = new square();
    }
  }
  createGrid(squares);
  //set the description and pseudo code for the default top value
  let alg = $("#algoSelect").val();
  $("#description").text(getDescriptions(alg));
  $("#code").text(getCode(alg));

  //add random walls
  $("#randWalls").click(function() {
    reset(squares);
    randomWalls(squares);
  });

  //changes description and pseudo code when user changes algorithms
  $("#algoSelect").change(function() {
    toggleStart = false;
    toggleStart = false;
    let alg = $("#algoSelect").val();
    $("#description").text(getDescriptions(alg));
    $("#code").text(getCode(alg));
  });

  //resets board and stops currently running algorithm
  $("#clear").click(function() {
    document.getElementById("setStart").disabled = false;
    document.getElementById("setEnd").disabled = false;
    toggleStart = false;
    toggleStart = false;
    if (intervalId) {
      clearInterval(intervalId);
    }
    squares = null;
    squares = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      squares[i] = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        squares[i][j] = new square();
      }
    }
    createGrid(squares);
  });

  //starts running algorithm and displays
  $("#start").click(function() {
    let interval = parseInt($("#interval").val());
    toggleStart = false;
    toggleStart = false;
    reset(squares);
    let alg = $("#algoSelect").val();
    let pathFunction = getAlgorithms(alg);
    pathFunction(squares, interval);
  });
});
