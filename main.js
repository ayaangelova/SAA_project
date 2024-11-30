// Select canvas and initialize JSConfetti
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const TILESIZE = 100;
const GAME_SIZE = 7;

canvas.width = GAME_SIZE * TILESIZE;
canvas.height = GAME_SIZE * TILESIZE;

let grid = Array.from({ length: GAME_SIZE * GAME_SIZE }, (_, i) => i);
let images = [];

for (let i = 1; i <= GAME_SIZE * GAME_SIZE; i++) {
	let img = new Image();
	img.src = `imgs/image_part_${i.toString().padStart(3, '0')}.jpg`;
	images.push(img);
}

function shufflePuzzle() {
	grid = grid.sort(() => Math.random() - 0.5);
	drawTiles();
}

function drawTiles() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (let i = 0; i < grid.length; i++) {
		let x = (i % GAME_SIZE) * TILESIZE;
		let y = Math.floor(i / GAME_SIZE) * TILESIZE;
		let img = images[grid[i]];

		if (img.complete) {
			ctx.drawImage(img, x, y, TILESIZE, TILESIZE);
		} else {
			img.onload = () => ctx.drawImage(img, x, y, TILESIZE, TILESIZE);
		}
	}
}

const slider = document.getElementById("myRange");
const demo = document.getElementById("demo");

// Update the demo value whenever the slider value changes
slider.oninput = function () {
	demo.innerHTML = this.value;
};

// Confetti trigger

const jsConfetti = new JSConfetti({ canvas: document.getElementById('confetti') });

// Add confetti to the right canvas during the celebration
function celebrateConfetti() {
	jsConfetti.addConfetti({ emojis: [, '🎉', '✨', '🌟', '🎊'], confettiNumber: 50, });

	// Optionally clear confetti after a duration
	setTimeout(() => {
		jsConfetti.clearConfetti();
	}, 7000); // 3 seconds
}


async function insertionSortWithAnimation() {
	disableButtons();
	for (let i = 1; i < grid.length; i++) {
		let key = grid[i];
		let j = i - 1;

		while (j >= 0 && grid[j] > key) {
			grid[j + 1] = grid[j];
			j--;

			drawTiles(); // Redraw the puzzle tiles
			highlightTile(j + 1); // Highlight the tile

			const speed = slider.value;
			const delay = 200 - speed;

			await sleep(delay); // Wait for the specified delay
		}

		grid[j + 1] = key;
		drawTiles();  // Redraw the tiles when the key is placed
		removeHighlight(j + 1); // Remove highlight

		const speed = slider.value;
		const delay = 200 - speed;

		await sleep(delay);
	}

	celebrateConfetti();

	enableButtons();
}

// Helper function for sleep
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to highlight the current tile
function highlightTile(index) {
	const x = (index % GAME_SIZE) * TILESIZE;
	const y = Math.floor(index / GAME_SIZE) * TILESIZE;

	ctx.strokeStyle = '#e55347'; // Highlight color
	ctx.lineWidth = 5;
	ctx.strokeRect(x, y, TILESIZE, TILESIZE); // Draw a border around the tile
}

// Function to remove the highlight from a tile
function removeHighlight(index) {
	const x = (index % GAME_SIZE) * TILESIZE;
	const y = Math.floor(index / GAME_SIZE) * TILESIZE;

	// Clear the previous highlight
	ctx.clearRect(x, y, TILESIZE, TILESIZE);

	// Redraw the tile without the highlight
	let img = images[grid[index]];
	if (img.complete) {
		ctx.drawImage(img, x, y, TILESIZE, TILESIZE);
	} else {
		img.onload = () => ctx.drawImage(img, x, y, TILESIZE, TILESIZE);
	}
}

// Function to disable buttons during sorting
function disableButtons() {
	const buttons = document.querySelectorAll('.button');
	buttons.forEach(button => button.disabled = true); // Disables buttons only
}

function enableButtons() {
	const buttons = document.querySelectorAll('.button');
	buttons.forEach(button => button.disabled = false); // Enables buttons only
}


document.getElementById('shuffleBtn').addEventListener('click', shufflePuzzle);

document.getElementById('startBtn').addEventListener('click', insertionSortWithAnimation);

drawTiles();
