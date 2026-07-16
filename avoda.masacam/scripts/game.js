let boardSize = 0;
let board = [];
let ships = [];
let remaining = { 2: 0, 3: 0, 4: 0, 5: 0 };
let gameFinished = false;

document.getElementById("startGameBtn").addEventListener("click", startGame);
document.getElementById("newGameBtn").addEventListener("click", function () {
    location.reload();
});

function startGame() {
    boardSize = Number(document.getElementById("boardSize").value);
    let amounts = {
        2: Number(document.getElementById("ship2").value),
        3: Number(document.getElementById("ship3").value),
        4: Number(document.getElementById("ship4").value),
        5: Number(document.getElementById("ship5").value)
    };

    if (!boardSize) {
        alert("יש לבחור גודל לוח");
        return;
    }

    for (let size = 2; size <= 5; size++) {
        if (!Number.isInteger(amounts[size]) || amounts[size] < 0) {
            alert("כמות הספינות חייבת להיות מספר שלם שאינו שלילי");
            return;
        }
    }

    let totalShips = amounts[2] + amounts[3] + amounts[4] + amounts[5];
    if (totalShips <= 0) {
        alert("יש להזין לפחות ספינה אחת");
        return;
    }

    let success = placeFleetWithRetries(amounts);
    if (!success) {
        alert("אין מספיק מקום למקם את כל הספינות עם רווח ביניהן. נסה כמות קטנה יותר");
        return;
    }

    remaining = { ...amounts };
    gameFinished = false;
    drawBoard();
    drawShipsTable();
    document.getElementById("settingsBox").classList.add("hidden");
    document.getElementById("gameArea").classList.remove("hidden");
}
function createEmptyBoard() {
    board = [];
    ships = [];
    for (let r = 0; r < boardSize; r++) {
        board[r] = [];
        for (let c = 0; c < boardSize; c++) {
            board[r][c] = 0;
        }
    }
}
function placeFleetWithRetries(amounts) {
    // מנסים מחדש את כל סידור הספינות כדי שלא תתקבל שגיאה בגלל הגרלה לא מוצלחת.
    for (let attempt = 0; attempt < 100; attempt++) {
        createEmptyBoard();
        if (placeAllShips(amounts)) return true;
    }
    return false;
}
function placeAllShips(amounts) {
    for (let size = 5; size >= 2; size--) {
        for (let i = 0; i < amounts[size]; i++) {
            if (!placeOneShip(size)) return false;
        }
    }
    return true;
}
function placeOneShip(size) {
    for (let tries = 0; tries < 1000; tries++) {
        let direction = Math.random() < 0.5 ? "row" : "col";
        let row = Math.floor(Math.random() * boardSize);
        let col = Math.floor(Math.random() * boardSize);

        if (canPlaceShip(row, col, size, direction)) {
            let ship = { size: size, cells: [], hits: 0, sunk: false };
            for (let i = 0; i < size; i++) {
                let r = direction === "row" ? row : row + i;
                let c = direction === "row" ? col + i : col;
                board[r][c] = ships.length + 1;
                ship.cells.push({ row: r, col: c });
            }
            ships.push(ship);
            return true;
        }
    }
    return false;
}
function canPlaceShip(row, col, size, direction) {
    if (direction === "row" && col + size > boardSize) return false;
    if (direction === "col" && row + size > boardSize) return false;

    for (let i = 0; i < size; i++) {
        let r = direction === "row" ? row : row + i;
        let c = direction === "row" ? col + i : col;

        // בודקים את המשבצת ואת כל שמונה המשבצות שסביבה.
        // כך נשמרת לפחות משבצת ריקה אחת בין כל שתי ספינות, גם באלכסון.
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                let nr = r + dr;
                let nc = c + dc;
                if (nr >= 0 && nr < boardSize && nc >= 0 && nc < boardSize && board[nr][nc] !== 0) {
                    return false;
                }
            }
        }
    }
    return true;
}
function drawBoard() {
    let boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";
    boardDiv.style.gridTemplateColumns = `repeat(${boardSize}, 32px)`;

    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            let cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener("click", cellClick);
            boardDiv.appendChild(cell);
        }
    }
}
function cellClick() {
    if (gameFinished || this.classList.contains("hit") || this.classList.contains("miss")) return;

    let r = Number(this.dataset.row);
    let c = Number(this.dataset.col);
    let shipIndex = board[r][c] - 1;

    if (shipIndex >= 0) {
        this.classList.add("hit");
        ships[shipIndex].hits++;
        if (ships[shipIndex].hits === ships[shipIndex].size && !ships[shipIndex].sunk) {
            ships[shipIndex].sunk = true;
            remaining[ships[shipIndex].size]--;
            drawShipsTable();
            showBoom();
            checkWin();
        }
    } else {
        this.classList.add("miss");
    }
}
function drawShipsTable() {
    let tbody = document.getElementById("shipsTable");
    tbody.innerHTML = "";
    for (let size = 2; size <= 5; size++) {
        let tr = document.createElement("tr");
        tr.innerHTML = `<td>${size}</td><td>${remaining[size]}</td>`;
        tbody.appendChild(tr);
    }
}
function showBoom() {
    let boom = document.getElementById("boom");
    boom.classList.remove("hidden");
    playBoomSound();
    setTimeout(function () {
        boom.classList.add("hidden");
    }, 900);
}
function playBoomSound() {
    let AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    let audioContext = new AudioContextClass();
    let oscillator = audioContext.createOscillator();
    let gain = audioContext.createGain();
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.frequency.value = 80;
    gain.gain.value = 0.25;
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
}
function checkWin() {
    let left = remaining[2] + remaining[3] + remaining[4] + remaining[5];
    if (left === 0) {
        gameFinished = true;
        setTimeout(function () {
            alert("כל הכבוד! הטבעת את כל הספינות");
        }, 300);
    }
}
