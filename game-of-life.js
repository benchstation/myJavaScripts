/*  Game Rules
    1. Any live cell with fewer than two live neighbors dies, as if by underpopulation.
    2. Any live cell with two or three live neighbors lives on to the next generation.
    3. Any live cell with more than three live neighbors dies, as if by overpopulation.
    4. Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
*/

const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
// Expanding to fit the screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight / 6;
const width = canvas.width;
const height = canvas.height;

const size = 4;

// Array of colors
const colors = [
    "brown",
    "white",
    "red",
    "blue",
    "purple",
    "green",
    "yellow",
    "orange"
];

// Default game grid that is drawn 
let grid = [];

// Grid used to update game state
let tempGrid = []; 

// ------------- Functions for game rules -------------

// Checking for neighbour presence
function cellValue(x, y) {
    try {
        return grid[x][y];
    } catch {
        return 0;
    }
}

function countNeighbours(x, y) {
    let count = 0;

    // Checking in all 8 directions (including diagonals)
    if (cellValue(x - 1, y - 1)) count++;   // top left
    if (cellValue(x - 1, y)) count++;       // top center
    if (cellValue(x - 1, y + 1)) count++;   // top right

    // The middle center -> cellValue(x, y) <- is the cell itself, so it should be ignored
    if (cellValue(x, y - 1)) count++;       // middle left
    if (cellValue(x, y + 1)) count++;       // middle right
    
    if (cellValue(x + 1, y - 1)) count++;   // bottom left
    if (cellValue(x + 1, y)) count++;       // bottom center
    if (cellValue(x + 1, y + 1)) count++;   // bottom right

    return count;
}

// Checks cell's neighbours
function updateCell(x, y) {
    neighbours = countNeighbours(x, y);

    // Game of life rules
    // default state = remains the same (i.e. if none of the 'IFs' run)
    // REALLY COOL EFFECT: 
    if (neighbours > 3 || neighbours < 2) return 0;
    //if (neighbours > 4 || neighbours < 3) return 0; // dead
    if (grid[x][y] == 0 && neighbours == 3) return 1; // alive
    return grid[x][y];
}

function update() {
    // Resetting the context
    canvasContext.clearRect(0, 0, width, height);

    // Drawing black canvas
    draw(0, 0, "black", width);
    
    // Updating every element on the grid
    for (let x = 0; x < width / size; x++) {
        for (let y = 0; y < height / size; y++) {
            tempGrid[x][y] = updateCell(x, y);
        }
    }

    // Update temporary grid and save to the actual grid
    grid = tempGrid;

    // Draw the cells and update count variable
    var cnt = drawCells();

    // Reinitializing the game if 96% of the cells are dead
    if ((cnt / ((width / size) * (height / size))) < 0.10) { // 0.04
        populateGrid(); // Start a new game only when necessary
        return; // Exit the current update loop to avoid multiple instances running simultaneously
    }

    // Adding a slight delay so it renders a bit slower
    // setTimeout(() => {
    //     requestAnimationFrame(update);
    // }, 30);
}

// Slowing down animation rate 
// (So it updates every half-second instead of each step)
var startTime = null, drawCount = 0;
var stepInMs = 500; // half-second

// 'timestamp' will receive the current time passed by requestAnimationFrame()
function start(timestamp) {
    var progress;
    if (startTime === null) { // Means this is the 1st frame of the animation
        startTime = timestamp; // 'startTime' becomes
    }
    progress = timestamp - startTime;
    if (progress > stepInMs) {
        drawCount++;
        document.getElementById('drawCount').innerHTML = drawCount;
        document.getElementById('timestamp').innerHTML = timestamp;
        document.getElementById('progress').innerHTML = progress;

        startTime = timestamp;
        update();
    }
    requestAnimationFrame(start); // start() is the callback function
}

function draw(x, y, context, size) {
    canvasContext.fillStyle = context; // The color of the pixel
    canvasContext.fillRect(x, y, size, size); // The shape of the pixel
}

function drawCells() {
    // Drawing the alive cells
    var cnt = 0;
    for (let x = 0; x < width / size; x++) {
        for (let y = 0; y < height / size; y++) {
            if (grid[x][y]) {
                // Random colors based on array selection
                // const color = colors[Math.floor(Math.random() * colors.length)];
                // draw(x * size, y * size, color, size);
                // Random colors based on position
                draw(x * size, y * size, `rgb(${x}, ${y}, 100)`, size);
                // Keep track of how many cells are dead and alive
                cnt += 1;
            }
        }
    }
    return cnt; // Return the count of alive cells
}


// Creates the 2d array used by the grid, an array of empty arrays
function initArray(w, h) {
    const arr = [];
    
    // Creating 2D Array (Grid)
    for (let x = 0; x < w; x++) {
        arr[x] = [];
        for (let y = 0; y < h; y++) {
            arr[x][y] = 0;
        }
    }
    return arr;
}

// First program call is this function
function populateGrid() {
    grid = initArray(width / size, height / size);
    tempGrid = initArray(width / size, height / size);

    //const spacing = 10; // Adjust the spacing between cells

    // Populating grid
    for (let x = 0; x < width / size; x++) { // Goes across the rows
        for (let y = 0; y < height / size; y++) { // Goes across the columns
            // Populating grid randomly
            if (Math.random() > 0.5) { // same as: grid[x][y] = Math.random() > 0.5 ? 1 : 0;
                grid[x][y] = 1;
            }
        }
    }

    // Start the animation loop only once (1st time)
    // Then, update() will keep updating itself by its own with requestAnimationFrame(update)
    update();
}

populateGrid();
requestAnimationFrame(start);


/*
    Visual Representation of the cells

    @   ---> Current Cell
    X   ---> Neighbors
   -1   ---> Moving left (horizontal axis) Moving down (vertical axis)
    1   ---> Moving right (horizontal axis) Moving up (vertical axis)
    2   ---> Out of bounds

 |       |       |       |       |       |
 |_______|_______|_______|_______|_______|
 |       |       |       |       |       |
 |       |-1, -1 | 0, -1 | 1, -1 |       |
 |       |   X   |   X   |   X   |       |
 |_______|_______|_______|_______|_______|
 |       |       |       |       |       |
 |       | -1, 0 | 0, 0  | 1, 0  |       |
 |       |   X   |   @   |   X   |       |
 |_______|_______|_______|_______|_______|
 |       |       |       |       |       |
 |       |-1, 1  | 0, 1  | 1, 1  |       |
 |       |   X   |   X   |   X   |       |
 |_______|_______|_______|_______|_______|
 |       |       |       |       |       |
 |       |       |       |       |       |

*/
