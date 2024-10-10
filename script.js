const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");
const scoreboard = document.getElementById("scoreboard");
const boardSizeSlider = document.getElementById("boardSizeSlider");

const paddleWidth = 10, paddleHeight = 100;
const ballRadius = 10;
let paddle1Y = paddle2Y = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSpeedX = 4, ballSpeedY = 4;
let score1 = 0, score2 = 0;

let keys = {}; // Track pressed keys

document.addEventListener("keydown", (event) => {
    keys[event.key] = true;
});

document.addEventListener("keyup", (event) => {
    keys[event.key] = false;
});

boardSizeSlider.addEventListener("input", (event) => {
    canvas.width = event.target.value;
    canvas.height = (event.target.value / 2); // Maintain aspect ratio
    paddle1Y = (canvas.height - paddleHeight) / 2; // Reset paddle positions
    paddle2Y = (canvas.height - paddleHeight) / 2;
    resetBall();
});

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

function draw() {
    drawRect(0, 0, canvas.width, canvas.height, "#222");
    drawRect(0, paddle1Y, paddleWidth, paddleHeight, "#fff");
    drawRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight, "#fff");
    drawCircle(ballX, ballY, ballRadius, "#fff");

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY + ballRadius >= canvas.height || ballY - ballRadius <= 0) {
        ballSpeedY = -ballSpeedY;
    }

    if (ballX - ballRadius <= paddleWidth) {
        if (ballY >= paddle1Y && ballY <= paddle1Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        } else {
            score2++;
            updateScore();
            resetBall();
        }
    }

    if (ballX + ballRadius >= canvas.width - paddleWidth) {
        if (ballY >= paddle2Y && ballY <= paddle2Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        } else {
            score1++;
            updateScore();
            resetBall();
        }
    }

    if (keys["ArrowUp"]) {
        paddle2Y = Math.max(paddle2Y - 5, 0);
    }

    if (keys["ArrowDown"]) {
        paddle2Y = Math.min(paddle2Y + 5, canvas.height - paddleHeight);
    }

    if (keys["w"]) {
        paddle1Y = Math.max(paddle1Y - 5, 0);
    }

    if (keys["s"]) {
        paddle1Y = Math.min(paddle1Y + 5, canvas.height - paddleHeight);
    }
}

function updateScore() {
    scoreboard.innerText = `Player 1: ${score1} | Player 2: ${score2}`;
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
}

function returnToWelcome() {
    document.querySelector('.game-page').style.display = 'none';
    document.querySelector('.opening-page').style.display = 'flex';

    // Reset scores
    score1 = 0;
    score2 = 0;
    updateScore();

    // Stop the game loop
    cancelAnimationFrame(gameLoopId);
}

let gameLoopId;

function gameLoop() {
    draw();
    gameLoopId = requestAnimationFrame(gameLoop);
}

function startGame() {
    document.querySelector('.opening-page').style.display = 'none';
    document.querySelector('.game-page').style.display = 'block';
    gameLoop();
}
