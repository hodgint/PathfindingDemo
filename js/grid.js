let GRID_SIZE = 5;
let DEFAULT_COLOR = "#ffffff"; // white
let VISITED_COLOR = "#fff700"; //yellow
let WALL_COLOR = "#777"; // gray
let START_COLOR = "17e300"; //green
let END_COLOR = "#ff0000"; // red
let PATH_COLOR = "#0015ff"; //blue

/* Object containing everything we need to know about a square in the grid */
class square {
  constructor(type, visited, color) {
    this.type = type;
    this.visited = visited;
    this.color = color;
  }

  getType() {
    return this.type;
  }

  getVisited() {
    return this.visited;
  }

  getColor() {
    return this.color;
  }

  setType(type) {
    this.type = type;
  }

  setVisited(visited) {
    this.visited = visited;
  }

  setColor(color) {
    this.color = color;
  }
}

function createGrid(squares) {
  let c = 0;
  let gridDiv = document.getElementById("grid");
  let grid = document.createElement("table");
  grid.className = "grid";
  for (let i = 0; i < GRID_SIZE; ++i) {
    let tr = grid.appendChild(document.createElement("tr"));
    for (let j = 0; j < GRID_SIZE; ++j) {
      var cell = tr.appendChild(document.createElement("td"));
      cell.innerHTML = ++c; // this is temporary to test drawing
      // Add event listener for click
      cell.addEventListener("click", function() {
        //Check squares at i,j to see if its already a wall/start/end
        if (squares[i][j].getType() === "Wall") {
          squares[i][j].setType("Empty");
          cell.bgColor = DEFAULT_COLOR;
        } else if (squares[i][j].getType() === "Empty") {
          squares.setType("Wall");
          cell.bgColor = WALL_COLOR;
        }
      });
    }
  }
  gridDiv.appendChild(grid);
}

$(function() {
  $("#start").click(function() {
    let squares = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      squares[i] = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        squares[i][j] = new square("Empty", false, DEFAULT_COLOR);
      }
    }
    createGrid(squares);
  });
});
