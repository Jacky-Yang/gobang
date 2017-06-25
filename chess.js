var chess = document.getElementById('chess');
var reset = document.getElementById('reset');
var back = document.getElementById('back');
var ctx = chess.getContext('2d');

var CHESS_COUNT = 15;
var PADDING = 15;
var INTERVAL = 30;
var CHESS_SIZE = 13;
var chess_board_width = chess.width;
var chess_board_height = chess.height;
var isBlackTurn = true;
var gameOver = false;

var chessMap = [];
var setps = [];

function initChessMap() {
    chessMap = [];
    for (var i = 0; i < CHESS_COUNT; i++) {
        chessMap[i] = [];
        for(var j = 0; j < CHESS_COUNT; j++) {
            chessMap[i][j] = 0;
        }
    }
}

function updateChessMap(x, y, value) {
    chessMap[x][y] = value;
}

function hasChess(x, y) {
    return chessMap[x][y] !== 0;
}

function drawChessBoard() {
    ctx.clearRect(0, 0, chess_board_width, chess_board_height);
    ctx.strokeStyle = '#B9B9B9';
    for (var i = 0; i < CHESS_COUNT; i++) {
        var beginPoint = calculatePosition(0, i);
        var endPoint = calculatePosition(CHESS_COUNT - 1, i);
        ctx.beginPath();
        ctx.moveTo(beginPoint.x, beginPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(beginPoint.y, beginPoint.x);
        ctx.lineTo(endPoint.y, endPoint.x);
        ctx.stroke();
    }
}

function calculatePosition(x, y) {
    return {
        x: PADDING + x * INTERVAL,
        y: PADDING + y * INTERVAL
    }
}

function drawOneChess(x, y, isBlack) {
    var p = calculatePosition(x, y);

    if (isBlack) {
        ctx.fillStyle = 'black';
    } else {
        ctx.fillStyle = '#D1D1D1';
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, CHESS_SIZE, 0, 2 * Math.PI);
    // ctx.stroke();
    ctx.closePath();
    ctx.fill();
}

function clearOneChess(x, y) {
    updateChessMap(x, y, 0);
    var p = calculatePosition(x, y);
    ctx.save();
    ctx.clearRect(p.x - CHESS_SIZE, p.y - CHESS_SIZE, CHESS_SIZE * 2, CHESS_SIZE *2);
    ctx.strokeStyle = '#B9B9B9';
    ctx.beginPath();

    var beginX = p.x === PADDING ? p.x : p.x - CHESS_SIZE;
    var beginY = p.y === PADDING ? p.y : p.y - CHESS_SIZE;
    var endX = p.x === chess_board_width - PADDING ? p.x : p.x + CHESS_SIZE;
    var endY = p.y === chess_board_width - PADDING ? p.y : p.y + CHESS_SIZE;

    ctx.moveTo(beginX, p.y);
    ctx.lineTo(endX, p.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(p.x, beginY);
    ctx.lineTo(p.x, endY);
    ctx.stroke();

}

function resetGame() {
    drawChessBoard();
    initChessMap();
    isBlackTurn = true;
    gameOver = false;
    algorithm.reset();
}

function backOneChess() {
    if (setps.length > 0) {
        var lastStep = setps.splice(setps.length - 1)[0];
        console.log(lastStep);
        if (lastStep) {
            clearOneChess(lastStep.x, lastStep.y);
            changeTurn();
        }
    }
}

function changeTurn() {
    isBlackTurn = !isBlackTurn;
}

function computerOneStep() {
    var p = algorithm.nextStep();
    console.log(p);

    drawOneChess(p.x, p.y, false);
    updateChessMap(p.x, p.y, 2);
    setps.push({
        x: p.x,
        y: p.y,
        isBlack: false
    });

    gameOver = p.over;

    if (gameOver) {
        alert('Computer win!');
    }
}

function playerOneStep(i, j) {
    drawOneChess(i, j, isBlackTurn);
    updateChessMap(i, j, isBlackTurn ? 1 : 2);
    setps.push({
        x: i,
        y: j,
        isBlack: true
    });
    gameOver = algorithm.update(i, j);

    if (gameOver) {
        alert('You win!');
    }
}

function beginGame() {
    drawChessBoard();
    algorithm.init(CHESS_COUNT);

    chess.onclick = function(e) {
        if (gameOver || !isBlackTurn) {
            return;
        }

        var x = e.offsetX;
        var y = e.offsetY;

        var i = Math.floor(x / INTERVAL);
        var j = Math.floor(y / INTERVAL);

        if (!hasChess(i, j)) {
            playerOneStep(i, j);
            changeTurn();

            if (!gameOver) {
                computerOneStep();
                changeTurn();
            }
        }
    };

    reset.onclick = resetGame;
    back.onclick = backOneChess;

    initChessMap();
}

beginGame();