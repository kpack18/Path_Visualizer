var TIME_INIT = 50;
var TIME_INC = 50;
var ITER = 0;

// printPath: Returns a String Representation of a tile list, for testing purposes
function printPath(path){
  var output = "[";
  for(var i = 0; i < path.length; ++i){
    output = output + " (" + path[i].getX() + "," + path[i].getY() + "),";
  }
  output = output + "]\n";
  return output;
}

function check_Iteration(current_iter){
  return current_iter == ITER;
}

// Algorithm Class: Houses the functions for running and calling algorithm's on the given grid.
class Algorithm{
  constructor(algo_type){
    this.algo = algo_type;
  }
  //Valid Types: "bfs = 0"
  set_Algo(algo_type,grid){
    this.algo = algo_type;
  }
  delay_Remove_Fade(tile,time,delay){
    time += TIME_INC;
    //fade_Array.push(tile);
    //setTimeout(function() { if(!running || fade_Array.isEmpty()){ return; } fade_Array.peak().removeFade(); fade_Array.pop(); },time);
    var current_iter = ITER;
    setTimeout(function() { var this_tile = tile; if(!check_Iteration(current_iter)){ return; }; this_tile.removeFade(); },time + delay);
    return time;
  }
  fail(start_tile,end_tile,time){
    var current_iter = ITER;
    setTimeout(function() { if(!check_Iteration(current_iter)){ return; } grid.blink_Fail(start_tile); },time + TIME_INC);
    setTimeout(function() { if(!check_Iteration(current_iter)){ return; } grid.blink_Fail(end_tile); },time + TIME_INC);
  }
  succeed(path,time){
    var current_iter = ITER;
    setTimeout(function() { if(!check_Iteration(current_iter)){ return; } grid.setPath(path); },time + TIME_INC);
  }
  bfs(start_tile,end_tile,grid){
    var time = TIME_INIT;

    var queue = new Queue();
    var visited_list = getMatrix(grid.getLength(),grid.getWidth(),false);
    var previous_list = getMatrix(grid.getLength(),grid.getWidth(),null);

    var weight_list = grid.getWeightList();
    var timing_list = getMatrix(grid.getLength(),grid.getWidth(),0);

    if(start_tile.compare(end_tile)){
      time = this.delay_Remove_Fade(start_tile,time,0);
      setTimeout(function() { grid.setPath([start_tile]); },time);
      return [start_tile];
    }
    if(start_tile.getWeight() == 0 || end_tile.getWeight() == 0){
      this.fail(start_tile,end_tile);
      return;
    }

    visited_list[start_tile.getX()][start_tile.getY()] = true;
    queue.push(start_tile);
    start_tile.removeFade();

    while(!queue.isEmpty()){
      var cur = queue.peak();
      queue.pop();

      if(weight_list[cur.getX()][cur.getY()] > 1){
        timing_list[cur.getX()][cur.getY()] = timing_list[cur.getX()][cur.getY()] + TIME_INC;
        --weight_list[cur.getX()][cur.getY()];
        queue.push(cur);
      }
      else{
        time = this.delay_Remove_Fade(cur,time,timing_list[cur.getX()][cur.getY()]);
        if(cur.compare(end_tile)){
          break;
        }
        var left = cur.getLeft(grid);
        if(left != null && left.getWeight() != 0 && visited_list[left.getX()][left.getY()] == false ){
          queue.push(left);
          visited_list[left.getX()][left.getY()] = true;
          previous_list[left.getX()][left.getY()] = cur;
        }
        var right = cur.getRight(grid);
        if(right != null && right.getWeight() != 0 && visited_list[right.getX()][right.getY()] == false){
          queue.push(right);
          visited_list[right.getX()][right.getY()] = true;
          previous_list[right.getX()][right.getY()] = cur;
        }
        var up = cur.getUp(grid);
        if(up != null && up.getWeight() != 0 && visited_list[up.getX()][up.getY()] == false){
          queue.push(up);
          visited_list[up.getX()][up.getY()] = true;
          previous_list[up.getX()][up.getY()] = cur;
        }
        var down = cur.getDown(grid);
        if(down != null && down.getWeight() != 0 && visited_list[down.getX()][down.getY()] == false){
          queue.push(down);
          visited_list[down.getX()][down.getY()] = true;
          previous_list[down.getX()][down.getY()] = cur;
        }
      }
    }

    var shortest_path = [];
    var tile_pointer = end_tile;

    shortest_path.push(tile_pointer);

    if(previous_list[tile_pointer.getX()][tile_pointer.getY()] == null){
      this.fail(start_tile,end_tile,time);
      return [];
    }

    while(previous_list[tile_pointer.getX()][tile_pointer.getY()] != null){
      tile_pointer = previous_list[tile_pointer.getX()][tile_pointer.getY()];
      shortest_path.push(tile_pointer);
    }

    var shortest_path = shortest_path.reverse();
    this.succeed(shortest_path,time);

    return shortest_path;
  }
  dfs(start_tile,end_tile){
    var time = TIME_INIT;

    var stack = new Stack();
    var visited_list = getMatrix(grid.getLength(),grid.getWidth(),false);
    var previous_list = getMatrix(grid.getLength(),grid.getWidth(),null);

    var weight_list = grid.getWeightList();

    var timing_list = getMatrix(grid.getLength(),grid.getWidth(),0);

    if(start_tile.compare(end_tile)){
      time = this.delay_Remove_Fade(start_tile,time,0);
      setTimeout(function() { grid.setPath([start_tile]); },time);
      return [start_tile];
    }
    if(start_tile.getWeight() == 0 || end_tile.getWeight() == 0){
      this.fail(start_tile,end_tile);
      return;
    }

    visited_list[start_tile.getX()][start_tile.getY()] = true;
    stack.push(start_tile);
    start_tile.removeFade();

    while(!stack.isEmpty()){
      var cur = stack.peak();
      stack.pop();

      if(weight_list[cur.getX()][cur.getY()] > 1){
        timing_list[cur.getX()][cur.getY()] = timing_list[cur.getX()][cur.getY()] + TIME_INC;
        --weight_list[cur.getX()][cur.getY()];
        stack.push(cur);
      }

      visited_list[cur.getX()][cur.getY()] = true;

      time = this.delay_Remove_Fade(cur,time,timing_list[cur.getX()][cur.getY()]);

      if(cur.compare(end_tile)){
        break;
      }
      var down = cur.getDown(grid);
      if(down != null && down.getWeight() != 0 && visited_list[down.getX()][down.getY()] == false){
        stack.push(down);
        previous_list[down.getX()][down.getY()] = cur;
      }
      var right = cur.getRight(grid);
      if(right != null && right.getWeight() != 0 && visited_list[right.getX()][right.getY()] == false){
        stack.push(right);
        previous_list[right.getX()][right.getY()] = cur;
      }
      var up = cur.getUp(grid);
      if(up != null && up.getWeight() != 0 && visited_list[up.getX()][up.getY()] == false){
        stack.push(up);
        previous_list[up.getX()][up.getY()] = cur;

      }
      var left = cur.getLeft(grid);
      if(left != null && left.getWeight() != 0 && visited_list[left.getX()][left.getY()] == false ){
        stack.push(left);
        previous_list[left.getX()][left.getY()] = cur;
      }
    }

    var shortest_path = [];
    var tile_pointer = end_tile;

    shortest_path.push(tile_pointer);

    if(previous_list[tile_pointer.getX()][tile_pointer.getY()] == null){
      this.fail(start_tile,end_tile,time);
      return [];
    }

    while(previous_list[tile_pointer.getX()][tile_pointer.getY()] != null){
      tile_pointer = previous_list[tile_pointer.getX()][tile_pointer.getY()];
      shortest_path.push(tile_pointer);
    }

    var shortest_path = shortest_path.reverse();
    this.succeed(shortest_path,time);

    return shortest_path;

  }
  run(start_tile,end_tile,grid){
    grid.dimTiles();
    switch(this.algo){
      case "bfs": return this.bfs(start_tile,end_tile,grid);
      case "dfs": return this.dfs(start_tile,end_tile,grid);
      default: return [];
    }
  }
}
