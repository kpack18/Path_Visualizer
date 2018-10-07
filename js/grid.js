// Grid Class: Stores the 2 Dimensional Matrix of Tiles and functions to edit them
class Grid {
/*  Vars: length: Length of the Grid Tiles
          Width: Width of the Grid Tiles

        grid: 2 Dimensional Array Housing the Tile Classes for each tile
           - Initialized to a L x W matrix of null values till addTile is called

        size_L: Keeps track of the next available length in the grid
        size_W: Keeps track of the next available width index in the grid
            -Tile is added at grid[size_L][size_W] till grid is full */
  constructor(l,w){
    this.length = l;
    this.width = w;
    this.grid = [];

    var tile_index = 0;
    var tile_list = document.getElementsByClassName("tile");

    for(var i = 0; i < l; ++i){
      var temparray = [];
      for(var j = 0; j < w; ++j){
        var temp_tile = new Tile(tile_list[tile_index],i,j);
        temparray.push(temp_tile);
        ++tile_index;
      }
      this.grid.push(temparray);
    }

  }
  getLength(){
    return this.length;
  }
  getWidth(){
    return this.width;
  }
/*  getTile (PARAM) xcoor: x coordinate of tile in Grid
          (PARAM) ycoor: y coordinate of tile in Grid
      : returns the tile class at grid[xcoor][ycoor] */
  getTile(xcoor,ycoor){
    if(xcoor >= this.length || ycoor >= this.width || xcoor < 0 || ycoor < 0){ return null; }
    return this.grid[xcoor][ycoor];
  }
// printGrid: Return's a String Representation of each tiles weight in the grid.
  printGrid(){
    var output = "";
    for(var i = 0; i < this.length; ++i){
      output = output + "[";
      for(var j = 0; j < this.width; ++j){
        output = output + " " + this.getTile(i,j).getWeight() + ",";
      }
      output = output + "]\n";
    }

    return output;
  }
  printRow(row){
    var output = "[";
    for(var i = 0; i < this.width; ++i){
      output = output + " " + this.getTile(row,i).getWeight() + ",";
    }
    output = output + "]";
    return output;
  }
  setPath(path){
    for(var i = 0; i < path.length; ++i){
      path[i].setColor("rgb(0, 255, 128)");
    }
  }
  clearPaths(){
    for(var i = 0; i < this.length; ++i){
      for(var j = 0; j < this.width; ++j){
          if(this.getTile(i,j).getColor() == "rgb(0, 255, 128)"){
            this.getTile(i,j).setColor("rgb(255, 255, 255)");
          }
        }
      }
  }
  getWeights(){
    for(var i = 0; i < this.length; ++i){
      for(var j = 0; j < this.width; ++j){
        var tempweight = this.getTile(i,j).getWeight();
      }
    }
  }

}

//Tile Class: Houses the element of a tile, it's coordinates within the grid, and functions to edit it.
class Tile {
  constructor(elem,xcoor,ycoor){
/* Vars: element: The html element of the tile
         weight: weight associated with the tile. By Default: Black = 0;
                                                              White = 1;
                                                              Color's Will be Stored in Palette
         x, y: The x and y coordinates of the tile within the grid class */
    this.element = elem;
    this.weight = 1;
    this.x = xcoor;
    this.y = ycoor;
  }
/* getX returns the x coordinate of the tile in grid */
  getX(){
    return this.x;
  }
/* getY returns the y coordinate of the tile in grid */
  getY(){
    return this.y;
  }
  getWeight(){
    var new_weight = palette.get_Bound_Weight(this.getColor());
    if(new_weight != null && new_weight != this.weight){
      this.setWeight(new_weight);
    }

    return this.weight;
  }
  //For Testing Only
  getWeightNoColor(){
    return this.weight;
  }
  setWeight(value){
    var changed = (this.weight == value);
    this.weight = value;
    if(!changed){
      //console.log("Elem: ( " + this.x + ", " + this.y + ") set to: " + this.weight);
    }
  }
/* Set's the color of the html element to the current paint color */
  setColor(color){
    this.element.style.backgroundColor = color;
  }
  getColor(){
    return this.element.style.backgroundColor;
  }
  addFade(){
    if(this.weight == 0){ return; } //Walls Do Not Get Faded
    this.element.style.opacity = 0.5;
  }
  removeFade(){
    this.element.style.opacity = 1.0;
  }
  compare(tile){
    return this.getX() == tile.getX() && this.getY() == tile.getY();
  }
  getLeft(grid){
    return grid.getTile(this.x-1,this.y);
  }
  getRight(grid){
    return grid.getTile(this.x+1,this.y);
  }
  getUp(grid){
    return grid.getTile(this.x,this.y+1);
  }
  getDown(grid){
    return grid.getTile(this.x,this.y-1);
  }
}
