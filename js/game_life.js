var canvas;
var ctx;    // context
var fps = 15;

var canvasX = 1000;  // width
var canvasY = 800;  // height
var tileX; 
var tileY;

// Game board
var board;
var rows = 250;
var columns = 250;

var black = '#FFFFFF';
var white = '#000000';

// Agent smith
// latitude and longitude are coordinates of position on board
// state are dead or alive -> 0 or 1
// next state are what is your next step?
// neighbours, all state agents depends on your neighbours
var Agent = function(longitude, latitude, state){
    
    this.latitude = latitude;
    this.longitude = longitude;
    this.state = state;

    this.nextState = this.state;

    this.neighbours = [];

    // method to add neighbours of actual agent
    this.addNeighbours = function(){
        var xNeighbour;
        var yNeighbour;

        for(var i=-1; i<2; i++){
            for(var j=-1; j<2; j++){
                xNeighbour = (j + this.latitude + columns) % columns;
                yNeighbour = (i + this.longitude + rows) % rows;

                // descart actual agent (agent smith is not a neighbour)
                if(i!=0 || j!=0){
                    this.neighbours.push(board[yNeighbour][xNeighbour])
                }
            }
        }
    }

    // conway laws
    this.newCycle = function(){
        var add = 0;

        // calculing neighbours are a alive
        for(var i=0; i<this.neighbours.length; i++){
            if(this.neighbours[i].state == 1){
                add ++;
            }
        }

        // add laws
        this.nextState = this.state; // default it's equal

        // state DEAD: less 2 or more 3 around
        if(add < 2 || add > 3){
            this.nextState = 0;
        }

        // state ALIVE or RESURRECT: has 3 neighbours
        if(add == 3){
            this.nextState = 1;
        }

    }

    // draw agents in board
    this.draw = function(){
        if(this.state == 1){
            color = white;
        }
        else{
            color = black;
        }

        ctx.fillStyle = color;
        ctx.fillRect(this.latitude*tileX, this.longitude*tileY, tileX, tileY )
    }

    // change new state
    this.mutation = function(){
        this.state = this.nextState;
    }

}

// add new neighbour
function addNeighbours(){
    var xNeighbour;
    var yNeighbour;

    for(var i=-1; i<2; i++){
        for(var j=-1; j<2; j++){
            xNeighbour = (j + this.latitude + columns) % columns;
            yNeighbour = (i + this.longitude + rows) % rows;

            // descart actual agent (agent smith is not a neighbour)
            if(i!=0 || j!=0){
                this.neighbours.push(board[yNeighbour][xNeighbour])
            }
        }
    }
}

/* 
 Create array 2D of 3x3 it's equvalent a matrix, 
 ex:
 In the center we have the main agent, 
 the rest are the neighbors and these are the coordinates of each one

 [(-1,-1),(0,-1),(1,-1)]
 [(-1, 0),(0, 0),(1, 0)]
 [(-1, 1),(0, 1),(1, 1)]

*/
function arreyAgents(row, cols){
    var obj = new Array(row);

    for(y=0; y<row; y++){
        obj[y] = new Array(cols);
    }

    return obj;
}

function initializeBoard(obj){
    var state;

    for(y=0; y<rows; y++){
        for(x=0; x<columns; x++){

            state = Math.floor(Math.random()*2);
            obj[y][x] = new Agent(y, x, state);
        }
    }

    for(y=0; y<rows; y++){
        for(x=0; x<columns; x++){
            obj[y][x].addNeighbours();
        }
    }
}

// refresh canvas (fps)
function refresh(){
    canvas.width = canvas.width;
    canvas.height = canvas.height;
}

// Initial
function initial(){
    console.log('initialize');

    // Prepare canvas
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    // dimensions
    canvas.width = canvasX;
    canvas.height = canvasY;

    // calculating tiles size
    tileX = Math.floor(canvasX/rows);
    tileY = Math.floor(canvasY/columns);

    // create board
    board = arreyAgents(rows, columns)

    // initilize board
    initializeBoard(board);

    console.log('tileX = '+tileX);
    console.log('tileY = '+tileY);

    // exec interval
    setInterval(function(){frames();},1000/fps);
}

// draw agents in board
function drawBoard(obj){

    // draw agents
    for(y=0; y<rows; y++){
        for(x=0; x<columns; x++){
            obj[x][y].draw();
        }
    }

    // compute the next loop
    for(y=0; y<rows; y++){
        for(x=0; x<columns; x++){
            obj[x][y].newCycle();
        }
    }

    // add mutation
    for(y=0; y<rows; y++){
        for(x=0; x<columns; x++){
            obj[x][y].mutation();
        }
    }
}

// Principal function refresh screen
function frames(){
    refresh();
    drawBoard(board);
}