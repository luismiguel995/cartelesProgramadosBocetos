
const GRID_SIZE = 2000,
      RECT_SIZE = 10,
      ARRAY_ELEMENTS = GRID_SIZE / RECT_SIZE;

var mainGridArray, updatedGridArray,
    population, generation,
    lastCellX, lastCellY,
    textoInfo, textoCartel, isPaused,
	timer;

let Light,Regular,Medium,Bold; //Tipografías

	
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}


function setup() {
	createCanvas(windowWidth, windowHeight);
	createArrays();
	initializeVariables(true);
}

function draw() {
	if (!isPaused) {
		if (timer == 1.5) {
			checkGrid();
			updateGrid();
			displayGrid();
			cartel();

			generation++;
			timer = 0;
		}
		timer += 0.25;
	}
	else {
		displayGrid();
		displayGUI();
	}
}

function preload() {
	Light = loadFont('fonts/AkzidenzGrotesk-LightOsF.otf');
	Regular = loadFont('fonts/AkzidenzGrotesk-Regular.otf');
	Medium = loadFont('fonts/AkzidenzGrotesk-Medium.otf');
	Bold = loadFont('fonts/AkzidenzGrotesk-Super.otf');

  } //Declara tipos

function createArrays() {
	mainGridArray    = new Array(ARRAY_ELEMENTS);
	updatedGridArray = new Array(ARRAY_ELEMENTS);

	for (var i = 0; i < ARRAY_ELEMENTS; i++) {
		mainGridArray[i]    = new Array(ARRAY_ELEMENTS);
		updatedGridArray[i] = new Array(ARRAY_ELEMENTS);
	}
}

function initializeVariables(flagHelp) {
	// The initial state of every index has a 10% chance of being a live cell.

	generation       = 4;
	textoInfo = flagHelp;
	isPaused         = true;
	lastCellX        = -1;
	lastCellY        = -1;
	population       = 0;
	timer 	         = 1.5;
}

function displayGrid() {
	noStroke(); // stroke de las celdas
	fill(255); // color del fondo
	rect(0, 0, GRID_SIZE, GRID_SIZE, 50); // tamaño rectangulo
	//fill(121, 222, 255); // color de los cuadrados
	fill(255, 139, 190); // color de los cuadrados


	for (var y = 0, i = 0; y < GRID_SIZE; y += RECT_SIZE, i++) {
		for (var x = 0, j = 0; x < GRID_SIZE; x += RECT_SIZE, j++) {
			if (mainGridArray[i][j]) rect(x, y, RECT_SIZE, RECT_SIZE);
		}
	}
}

function displayGUI() {
	textSize(16);
	textFont(Regular);

	if (textoInfo) {
		stroke(255);
		fill(0);
		noStroke();

		fill(5);
		textSize(16);
		//text("Del (while paused): Clears the grid.", 30, 70);
		text("Mouse click and Drag (while paused) = Paint", 30, 90);
		text("Enter = Motion", 30, 110);
	}

	stroke(255);
	fill(0);
	rect(0, 945, 320, 55);
	noStroke();
}


function cartel() {
	//Título
	textFont(Medium);
	textSize(60);
	fill(5);
	let s = 'Cell Biology Workshop';
	text(s, 150, 100, 200, 300); // Posicion texto + caja

	//Fecha
	textFont(Regular);
	textSize(30);
	fill(5);
	let i = 'Días 26, 27 y 28 de abril';
	text(i, 150, 350, 800, 300); 
	



}


function convertCoordinates() {
	var x = mouseX,
		y = mouseY;

	// Rounding down the canvas coordinates to nearest grid coordinates.
	while (x % RECT_SIZE != 0) x--;
	while (y % RECT_SIZE != 0) y--;

	// Converting the grid coordinates to array coordinates.
	x /= RECT_SIZE;
	y /= RECT_SIZE;

	// Applying the changes to the grid array.
	if (lastCellX != x || lastCellY != y) {
		if (updatedGridArray[y][x]) updatedGridArray[y][x] = 0;
		else updatedGridArray[y][x] = 1;
	}

	// Cannot trigger the same cell to change on the same mouse click/drag.
	lastCellX = x;
	lastCellY = y;

	updateGrid();
}

// Event handling.
function mousePressed() {
	if (isPaused) convertCoordinates();

	return false;
}

function mouseDragged() {
	if (isPaused) convertCoordinates();

	return false;
}

function mouseReleased() {
	lastCellX = -1;
	lastCellY = -1;

	return false;
}

function keyPressed() {
	// Pause.
	if (keyCode === RETURN) {
		if (isPaused) isPaused = false;
		else isPaused = true;
	}
	// Reset.
	else if (keyCode === ESCAPE && !isPaused) {
		 initializeVariables(textoCartel);
	}
	else if (keyCode === BACKSPACE && isPaused) {
		emptyGrid();
	}
	//Informacion
	else if (keyCode === TAB) {
		if (textoInfo) textoInfo = false;
		else textoInfo = true;
	}

	return false;
}

function emptyGrid() {
	generation = 0;

	for (var i = 0; i < ARRAY_ELEMENTS; i++) {
		for (var j = 0; j < ARRAY_ELEMENTS; j++) {
			updatedGridArray[i][j] = 0;
		}
	}

	updateGrid();
}

function checkGrid() {
	for (var i = 0; i < ARRAY_ELEMENTS; i++) {
		for (var j = 0; j < ARRAY_ELEMENTS; j++) {
			var neighbours = 0

			// Corners.
			if (i == 0 && j == 0) {
				if (mainGridArray[i][j + 1]) neighbours++;
				if (mainGridArray[i + 1][j]) neighbours++;
				if (mainGridArray[i + 1][j + 1]) neighbours++;
			}
			else if (i == 0 && j == (ARRAY_ELEMENTS - 1)) {
				if (mainGridArray[i][j - 1]) neighbours++;
				if (mainGridArray[i + 1][j]) neighbours++;
				if (mainGridArray[i + 1][j - 1]) neighbours++;
			}
			else if (i == (ARRAY_ELEMENTS - 1) && j == 0) {
				if (mainGridArray[i][j + 1]) neighbours++;
				if (mainGridArray[i - 1][j]) neighbours++;
				if (mainGridArray[i - 1][j + 1]) neighbours++;
			}
			else if (i == (ARRAY_ELEMENTS - 1) && j == (ARRAY_ELEMENTS - 1)) {
				if (mainGridArray[i][j - 1]) neighbours++;
				if (mainGridArray[i - 1][j]) neighbours++;
				if (mainGridArray[i - 1][j - 1]) neighbours++;
			}
			// Borders.
			else if (i == 0 && (j > 0 && j < (ARRAY_ELEMENTS - 1))) {
				if (mainGridArray[i][j - 1]) neighbours++;
				if (mainGridArray[i][j + 1]) neighbours++;
				if (mainGridArray[i + 1][j - 1]) neighbours++;
				if (mainGridArray[i + 1][j]) neighbours++;
				if (mainGridArray[i + 1][j + 1]) neighbours++;
			}
			else if (i == (ARRAY_ELEMENTS - 1) && (j > 0 && j < (ARRAY_ELEMENTS - 1))) {
				if (mainGridArray[i][j - 1]) neighbours++;
				if (mainGridArray[i][j + 1]) neighbours++;
				if (mainGridArray[i - 1][j - 1]) neighbours++;
				if (mainGridArray[i - 1][j]) neighbours++;
				if (mainGridArray[i - 1][j + 1]) neighbours++;
			}
			else if ((i > 0 && i < (ARRAY_ELEMENTS - 1)) && j == 0) {
				if (mainGridArray[i - 1][j]) neighbours++;
				if (mainGridArray[i + 1][j]) neighbours++;
				if (mainGridArray[i - 1][j + 1]) neighbours++;
				if (mainGridArray[i][j + 1]) neighbours++;
				if (mainGridArray[i + 1][j + 1]) neighbours++;
			}
			else if ((i > 0 && i < (ARRAY_ELEMENTS - 1)) && j == (ARRAY_ELEMENTS - 1)) {
				if (mainGridArray[i - 1][j]) neighbours++;
				if (mainGridArray[i + 1][j]) neighbours++;
				if (mainGridArray[i - 1][j - 1]) neighbours++;
				if (mainGridArray[i][j - 1]) neighbours++;
				if (mainGridArray[i + 1][j - 1]) neighbours++;
			}
			// General rules.
			else {
				if (mainGridArray[i - 1][j - 1]) neighbours++;
				if (mainGridArray[i - 1][j]) neighbours++;
				if (mainGridArray[i - 1][j + 1]) neighbours++;
				if (mainGridArray[i][j - 1]) neighbours++;
				if (mainGridArray[i][j + 1]) neighbours++;
				if (mainGridArray[i + 1][j - 1]) neighbours++;
				if (mainGridArray[i + 1][j]) neighbours++;
				if (mainGridArray[i + 1][j + 1]) neighbours++;
			}

			// Applying changes to a secondary array.
			if (mainGridArray[i][j]) {
				if (neighbours < 2) updatedGridArray[i][j] = 0;
				else if (neighbours > 3) updatedGridArray[i][j] = 0;
			}
			else {
				if (neighbours == 3) updatedGridArray[i][j] = 1;
			}
		}
	}
}

function updateGrid() {
	for (var i = 0; i < ARRAY_ELEMENTS; i++) {
		for (var j = 0; j < ARRAY_ELEMENTS; j++) {
			mainGridArray[i][j] = updatedGridArray[i][j];
		}
	}
}

function countPopulation() {
	population = 0;

	for (var i = 0; i < ARRAY_ELEMENTS; i++) {
		for (var j = 0; j < ARRAY_ELEMENTS; j++) {
			if (mainGridArray[i][j]) population++;
		}
	}
}
