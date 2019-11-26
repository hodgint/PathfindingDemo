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
