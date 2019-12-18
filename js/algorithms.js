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
  setButtonsOff();
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
  setButtonsOff();
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
      setButtonsOn();
    } else {
      let neighbors = findNeighbors(node, squares, search);
      search = search.concat(neighbors); // add neighbors to list if not wall, or already visited
    }
    if (search.length === 0) {
      alert("No path found");
      setButtonsOff();
      clearInterval(step);
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
  setButtonsOff();
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
      setButtonsOn();
    } else {
      let neighbors = findNeighbors(node, squares, search);
      search = search.concat(neighbors); // add neighbors to list if not wall, or already visited
    }
    if (search.length === 0) {
      alert("No path found");
      setButtonsOff();
      clearInterval(step);
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
