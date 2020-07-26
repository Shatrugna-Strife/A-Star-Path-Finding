function heuristicEuclidean(f, s) {
  return dist(f.x, f.y, s.x, s.y);
}

function heuristicManhattan(f, s){
  return abs(f.x - s.x) + abs(f.y - s.y);
}

var rows = 25;
var cols = 50;
var grid = new Array(rows);
var openSet = [];
var closeSet = [];
var start;
var end;
var w;
var h;
var path = [];
var stop = false;

function Spot(x, y) {
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.x = x;
  this.y = y;
  this.neighbor = [];
  this.previous = null;
  this.wall = false;
  
  if(random(0,1)<0.4){
    this.wall = true;
  }

  this.show = function(col) {
    fill(col);
    if(this.wall){
      fill(0);
    }
    //stroke(0);
    noStroke();
    //rect(this.x * w, this.y * h, w - 1, h - 1);
    ellipse(this.x*w +w/2, this.y*h + h/2, w/2, h/2);
  };

  this.addNeighbor = function(grid) {
    let i = this.x;
    let j = this.y;
    if (j<rows -1) {
      if(!grid[j + 1][i].wall){
        this.neighbor.push(grid[j + 1][i]);
      }
    }
    if (i<cols - 1) {
      if(!grid[j][i+1].wall){
        this.neighbor.push(grid[j][i+1]);
      }
    }
    if (j>0) { 
      if(!grid[j - 1][i].wall){
        this.neighbor.push(grid[j - 1][i]);
      }
    }
    if (i>0) {
      if(!grid[j][i-1].wall){
        this.neighbor.push(grid[j][i - 1]);
      }
    }
    if (j<rows -1 && i>0) {
      if(!grid[j + 1][i-1].wall){
        this.neighbor.push(grid[j + 1][i-1]);
      }
    }
    if (i<cols - 1 && j<rows-1) {
      if(!grid[j + 1][i+1].wall){
        this.neighbor.push(grid[j+1][i+1]);
      }
    }
    if (j>0 && i<cols - 1) { 
      if(!grid[j - 1][i+1].wall){
        this.neighbor.push(grid[j - 1][i+1]);
      }
    }
    if (i>0 && j>0) {
      if(!grid[j - 1][i-1].wall){
        this.neighbor.push(grid[j-1][i - 1]);
      }
    }
  };
}

function setup() {
  createCanvas(600, 600);

  for (let i = 0; i<rows; i++) {
    grid[i] = new Array(cols);
  }

  for (let i = 0; i<rows; i++) {
    for (let j = 0; j<rows; j++) {
      grid[i][j] = new Spot(j, i );
    }
  }
  
  start = grid[0][0];
  end = grid[rows - 1][cols - 1];
  
  start.wall = false;
  end.wall = false;

  for (let i = 0; i<rows; i++) {
    for (let j = 0; j<cols; j++) {
      grid[i][j].addNeighbor(grid);
    }
  }

  
  

  w = width/cols;
  h = height/rows;

  openSet.push(grid[0][0]);

  console.log(grid);
}


function draw() {
  background(255);

  if (openSet.length>0 && !stop) {
    var head = 0;
    for (let i = 0; i<openSet.length; i++) {
      if (openSet[i].f < openSet[head].f) {
        head = i;
      }
    }

    var current = openSet[head];

    if (current == end) {
      stop = true;
      noLoop();
      //path = [];
      // var temp = current;
      //path.push(temp);
      //while(temp.previous){
      //  path.push(temp.previous);
      //temp = temp.previous;
      //}



      console.log("Done YEAAAAAA!!!!!!!!!");
    }

    openSet.splice(head, 1);
    closeSet.push(current);

    var neighbors = current.neighbor;
    //console.log(neighbors);
    for (let i = 0; i<neighbors.length; i++) {
      var neighbor = neighbors[i];

      if (!closeSet.includes(neighbor)) {
        var tempG = current.g + 1;
        
        var newPath = false;
        if (openSet.includes(neighbor)) {
          if (tempG<neighbor.g) {
            newPath = true;
            neighbor.g = tempG;
          }
        } else {
          newPath = true;
          neighbor.g = tempG;
          openSet.push(neighbor);
        }
        
        neighbor.h = heuristicEuclidean(neighbor, end);
        neighbor.f = neighbor.g + neighbor.h;
        if(newPath){
          neighbor.previous = current;
        }
      }
    }
  } else {
    console.log("NO path man");
    noLoop();
    return;
  }


  for (let i = 0; i<rows; i++) {
    for (let j = 0; j<cols; j++) {
      grid[i][j].show(color(255));
    }
  }

  for (let i = 0; i<openSet.length; i++) {
  //console.log(openSet);
  openSet[i].show(color(0, 255, 0));
  }

  for (let i = 0; i<closeSet.length; i++) {
    closeSet[i].show(color(255, 0, 0));
  }

  path = [];
  var temp = current;
  path.push(temp);
  while (temp.previous ) {
    path.push(temp.previous);
    temp = temp.previous;
  }

  //for (let i = 0; i<path.length; i++) {
  //  path[i].show(color(0, 0, 255));
  //}
  noFill();
  //fill(0);
  stroke(255,0,255);
  strokeWeight(w/2);
  smooth();
  beginShape();
  for (let i = 0; i<path.length; i++) {
    vertex(path[i].x*w + w/2, path[i].y*h + h/2);
  }
  endShape();

}
