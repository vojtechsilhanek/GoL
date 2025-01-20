let rows = 15;
let cols = 15;
let playing = false;

let timer;
let reproductionTime = 100;

let grid = new Array(rows);
let nextGrid = new Array(rows);



document.addEventListener('DOMContentLoaded', () => {
    createTable();
    initializeGrids();
    resetGrids();
    setupControlButtons();
});

function resetGrids() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = 0;
            nextGrid[i][j] = 0;
        }
    }
}

function initializeGrids() {
    for (let i = 0; i < rows; i++) {
        grid[i] = new Array(cols);
        nextGrid[i] = new Array(cols);
    }
}

// lay out the board
function createTable() {
    let gridContainer = document.getElementById("gridContainer");
    if (!gridContainer) {
        // throw error
        console.error("Problem: no div for the grid table!");
    }
    let table = document.createElement("table");

    for (let i = 0; i < rows; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement("td");
            cell.setAttribute("id", i + "_" + j);
            cell.setAttribute("class", "dead");
            cell.onclick = cellClickHandler;
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    gridContainer.appendChild(table);
}

function cellClickHandler() {
    let rowcol = this.id.split("_");
    let row = rowcol[0];
    let col = rowcol[1];
    let classes = this.getAttribute('class');
    if (classes.indexOf('live') > -1) {
        this.setAttribute('class', 'dead');
        grid[row][col] = 0;
    } else {
        this.setAttribute('class', 'live');
        grid[row][col] = 1;
    }
}

function setupControlButtons() {

    let startButton = document.querySelector('#start');
    let clearButton = document.querySelector('#clear');
    let rButton = document.querySelector('#random');

    startButton.onclick = () => {
        if (playing) {
            console.log('Pause the Game');
            playing = false;
            startButton.innerHTML = 'Continue';
        } else {
            console.log('Cont the game');
            playing = true;
            startButton.innerHTML = 'Pause';
            play();
        };
    };

    clearButton.onclick = () => {
        playing = false;
        startButton.innerHTML = "Start";
        resetGrids();
        updateView();
    };

    rButton.onclick = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                grid[i][j] = Math.floor(Math.random() * 2);
                var cell = document.getElementById(i + '_' + j);
                if (grid[i][j] == 1) cell.setAttribute('class', 'live');
                else cell.setAttribute('class', 'dead');
            }
        }
    }

}

function play() {
    console.log("Play the game");
    computeNextGen();

    if (playing) {
        timer = setTimeout(play, reproductionTime);
    }

};

function computeNextGen() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            applyRules(i, j);
        }
    }
    copyAndResetGrid();
    updateView();
}

function copyAndResetGrid() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = nextGrid[i][j];
            nextGrid[i][j] = 0;
        }
    }
}

function updateView() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.getElementById(i + '_' + j);
            if (grid[i][j] == 0) {
                cell.setAttribute('class', 'dead');
            } else {
                cell.setAttribute('class', 'live');
            }
        }
    }
}

function applyRules(row, col) {
    let numNeighbors = countNeighbors(row, col);

    if (grid[row][col] == 1) { // pokud je ziva
        if (numNeighbors < 2 || numNeighbors > 3) {
            nextGrid[row][col] = 0; // zemre
        } else {
            nextGrid[row][col] = 1; // zustane zit
        }
    } else if (grid[row][col] == 0) { // pokud je mrtva
        if (numNeighbors == 3) {
            nextGrid[row][col] = 1; // Bunka se zmeni na 1, a tak se z ni stane ziva
        }
    }
}



function countNeighbors(row, col) {
    let count = 0;

    if (row - 1 >= 0) {
        if (grid[row - 1][col] == 1) count++;
    }
    if (row - 1 >= 0 && col - 1 >= 0) {
        if (grid[row - 1][col - 1] == 1) count++;    
        if (grid[row - 1][col + 1] == 1) count++;
    }
    if (col - 1 >= 0) {
        if (grid[row][col - 1] == 1) count++;
    }
    if (col + 1 < cols) { 
        if (grid[row][col + 1] == 1) count++;
    }
    if (row + 1 < rows) {
        if (grid[row + 1][col] == 1) count++;
    }
    if (row + 1 < rows && col - 1 >= 0) {
        if (grid[row + 1][col - 1] == 1) count++;
    }
    if (row + 1 < rows && col + 1 < cols) {
        if (grid[row + 1][col + 1] == 1) count++;
    }
    return count;
}


function reloadGridBasedOnRes() {
    
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // bunka bude mit 25 na 25 px
    const cellSize = 25;
    rows = Math.floor(screenHeight / cellSize) - 8; 
    // -8 radku, aby to nezasahovalo, table by presahoval pres buttony
    cols = Math.floor(screenWidth / cellSize);

    
    grid = new Array(rows);
    nextGrid = new Array(rows);
    initializeGrids();
    

    
    const gridContainer = document.getElementById('gridContainer');
    gridContainer.innerHTML = '';
    createTable();

    
    
}


document.addEventListener('DOMContentLoaded', () => {
    const reloadButton = document.getElementById('reload');
    reloadButton.addEventListener('click', reloadGridBasedOnRes);
});



document.addEventListener('DOMContentLoaded', () => {
    const applySizeButton = document.getElementById('applySize');
    applySizeButton.onclick = updateCellSize;
});

function updateCellSize() {
    const newSize = document.getElementById('cellSizeInput').value;
    document.querySelectorAll('td').forEach(cell => {
        cell.style.width = `${newSize}px`;
        cell.style.height = `${newSize}px`;
    });
}