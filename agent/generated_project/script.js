
// Game State Variables
let board = ["", "", "", "", "", "", "", "", ""]; // Represents the 9 cells of the Tic Tac Toe board
let currentPlayer = "X"; // The current player, starts with 'X'
let gameActive = true; // Flag to indicate if the game is currently active
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]; // All possible winning combinations

// Score variables
let scores = {
    X: 0,
    O: 0,
    draw: 0
};

// DOM Elements
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('statusDisplay');
const playAgainBtn = document.getElementById('playAgainBtn');
const resetScoresBtn = document.getElementById('resetScoresBtn');
const themeToggleBtn = document.getElementById('themeToggle');
const sunIcon = document.querySelector('.icon-sun');
const moonIcon = document.querySelector('.icon-moon');
const body = document.body;
const modeSelect = document.getElementById('modeSelect');
const difficultySelect = document.getElementById('difficultySelect');
const scoreXVal = document.getElementById('scoreXVal');
const scoreOVal = document.getElementById('scoreOVal');
const scoreDrawVal = document.getElementById('scoreDrawVal');
const labelX = document.getElementById('labelX');
const labelO = document.getElementById('labelO');
const winningLine = document.getElementById('winningLine'); // For line animation

// --- Game Logic Functions ---

// Function to handle a player's turn
function handleTurn(clickedCellIndex) {
    if (!gameActive || board[clickedCellIndex] !== "") {
        return; // Do nothing if game is not active or cell is already taken
    }

    // Update board and display
    board[clickedCellIndex] = currentPlayer;
    const clickedCell = cells[clickedCellIndex];
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase()); // Add class for styling (x or o)
    clickedCell.setAttribute('aria-label', `Cell ${clickedCellIndex + 1}, ${currentPlayer}`);
    clickedCell.disabled = true; // Disable cell after it's played

    // Check for win or draw
    if (checkWin(currentPlayer)) {
        statusDisplay.textContent = `Player ${currentPlayer} has won!`;
        gameActive = false;
        updateScore(currentPlayer);
        drawWinningLine(clickedCellIndex);
        return;
    }

    if (checkDraw()) {
        statusDisplay.textContent = "It's a draw!";
        gameActive = false;
        updateScore('draw');
        return;
    }

    // Switch player
    switchPlayer();
    updateStatusDisplay();
}

// Function to check if a move is valid (cell is empty)
function isValidMove(index) {
    return board[index] === "";
}

// Function to check for a win
function checkWin(player) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] === player && board[b] === player && board[c] === player) {
            // Store winning line indices for animation
            winningLine.dataset.winCondition = i;
            return true;
        }
    }
    return false;
}

// Function to check for a draw
function checkDraw() {
    return board.every(cell => cell !== "");
}

// Function to switch the current player
function switchPlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
}

// Function to reset the game state and board
function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('x', 'o');
        cell.disabled = false;
        cell.removeAttribute('aria-label');
    });
    winningLine.style.display = 'none'; // Hide winning line
    winningLine.style.transform = ''; // Reset transform
    winningLine.style.width = '';
    winningLine.style.height = '';
    winningLine.style.top = '';
    winningLine.style.left = '';
}

// Function to update scores and display
function updateScore(winner) {
    if (winner === 'draw') {
        scores.draw++;
        scoreDrawVal.textContent = scores.draw;
    } else {
        scores[winner]++;
        if (winner === 'X') {
            scoreXVal.textContent = scores.X;
            labelX.textContent = `Player X Wins`;
        } else {
            scoreOVal.textContent = scores.O;
            labelO.textContent = `Player O Wins`;
        }
    }
}

// Function to reset all scores
function resetScores() {
    scores = { X: 0, O: 0, draw: 0 };
    scoreXVal.textContent = '0';
    scoreOVal.textContent = '0';
    scoreDrawVal.textContent = '0';
    labelX.textContent = `Player X Wins`;
    labelO.textContent = `Player O Wins`;
}

// Function to update the status display
function updateStatusDisplay() {
    statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
    // Ensure the current turn indicator is styled correctly
    const turnIndicator = statusDisplay.querySelector('.current-turn');
    if (turnIndicator) {
        turnIndicator.textContent = currentPlayer;
        // Dynamically set background color for the turn indicator
        turnIndicator.style.backgroundColor = currentPlayer === 'X' ? '#ff6b6b' : '#4ecdc4'; // Example colors for X and O
    }
}

// Function to draw the winning line
function drawWinningLine(clickedCellIndex) {
    const winConditionIndex = parseInt(winningLine.dataset.winCondition);
    const [a, b, c] = winningConditions[winConditionIndex];
    const firstCell = cells[a];
    const secondCell = cells[b];
    const thirdCell = cells[c];

    const firstRect = firstCell.getBoundingClientRect();
    const secondRect = secondCell.getBoundingClientRect();
    const thirdRect = thirdCell.getBoundingClientRect();

    const boardRect = document.querySelector('.game-board').getBoundingClientRect();

    winningLine.style.display = 'block';

    // Calculate line properties based on winning condition
    if (winConditionIndex < 3) { // Horizontal win
        winningLine.style.height = '10px';
        winningLine.style.width = '300px'; // Full width of the board
        // Center vertically within the board, accounting for boardRect offset and line height
        winningLine.style.top = `${firstRect.top + firstRect.height / 2 - boardRect.top - 5}px`; 
        winningLine.style.left = '0px'; // Start from left edge of board
        winningLine.style.transformOrigin = 'left center';
        winningLine.style.transform = 'translateX(0)';
    } else if (winConditionIndex < 6) { // Vertical win
        winningLine.style.width = '10px';
        winningLine.style.height = '300px'; // Full height of the board
        // Center horizontally within the board, accounting for boardRect offset and line width
        winningLine.style.left = `${firstRect.left + firstRect.width / 2 - boardRect.left - 5}px`; 
        winningLine.style.top = '0px'; // Start from top edge of board
        winningLine.style.transformOrigin = 'top center';
        winningLine.style.transform = 'translateY(0)';
    } else { // Diagonal win
        winningLine.style.width = '10px';
        // Diagonal length should be sufficient to cover the board's diagonal
        // Using Pythagorean theorem: sqrt(300^2 + 300^2) = 300 * sqrt(2) approx 424.26
        winningLine.style.height = '425px'; 
        winningLine.style.top = '0px';
        winningLine.style.left = '0px';
        winningLine.style.transformOrigin = 'top left';

        if (winConditionIndex === 6) { // Diagonal top-left to bottom-right
            // Rotate 45 degrees and translate to align with the diagonal
            winningLine.style.transform = 'rotate(45deg) translate(0, 0)';
        } else { // Diagonal top-right to bottom-left
            winningLine.style.transformOrigin = 'top right';
            // Rotate -45 degrees and translate to align with the other diagonal
            winningLine.style.transform = 'rotate(-45deg) translate(0, 0)';
        }
    }
}

// --- Event Listeners ---

// Add event listeners to each cell
cells.forEach(cell => {
    cell.addEventListener('click', (event) => {
        const clickedCellIndex = parseInt(event.target.dataset.index);
        handleTurn(clickedCellIndex);
    });
});

// Add event listener for the "Play Again" button
playAgainBtn.addEventListener('click', resetGame);

// Add event listener for the "Reset Scores" button
resetScoresBtn.addEventListener('click', resetScores);

// Theme Toggle Logic
themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    body.classList.toggle('dark-theme');

    // Update sun/moon icon visibility
    if (sunIcon.style.display === 'none' || sunIcon.style.display === '') {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }
});

// Difficulty Selection Logic
modeSelect.addEventListener('change', () => {
    if (modeSelect.value === 'ai') {
        difficultySelect.disabled = false;
    } else {
        difficultySelect.disabled = true;
    }
});

// --- Initial Setup ---
updateStatusDisplay(); // Set initial status
resetScores(); // Initialize scores display
// Ensure initial theme classes are set if needed, or rely on default CSS
if (!body.classList.contains('dark-theme') && !body.classList.contains('light-theme')) {
    body.classList.add('dark-theme'); // Default to dark theme
}
// Set initial visibility of theme icons based on the default theme
if (body.classList.contains('light-theme')) {
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
} else {
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
}

// Initialize AI difficulty based on initial mode selection
if (modeSelect.value === 'ai') {
    difficultySelect.disabled = false;
} else {
    difficultySelect.disabled = true;
}
