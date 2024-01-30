const canvas = document.getElementById("pongCanvas");
const context = canvas.getContext("2d");

// Responsive canvas size
canvas.width = window.innerWidth > 800 ? 800 : window.innerWidth;
canvas.height = (canvas.width / 2) + 60; // Extra space for score

let paddleWidth = 10, paddleHeight = (canvas.height - 60) / 4; // Adjust height for score area
let ballRadius = 7;
let playerPaddleY = (canvas.height / 2 - paddleHeight / 2) + 30; // Adjust position for score area
let aiPaddleY = (canvas.height / 2 - paddleHeight / 2) + 30; // Adjust position for score area
let ballX = canvas.width / 2, ballY = (canvas.height / 2) + 30; // Adjust position for score area
let ballSpeedX = 2, ballSpeedY = 2;
let aiSpeed = 2;

// Scoring
let playerScore = 0;
let aiScore = 0;

// Touch Movement for Player Paddle
canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();
    let touchY = e.touches[0].clientY - canvas.getBoundingClientRect().top - 30; // Adjust for score area
    playerPaddleY = touchY - paddleHeight / 2;
    if (playerPaddleY < 30) playerPaddleY = 30;
    if (playerPaddleY + paddleHeight > canvas.height) playerPaddleY = canvas.height - paddleHeight;
});

function resetBall() {
    ballX = canvas.width / 2;
    ballY = (canvas.height / 2) + 30; // Adjust for score area
    ballSpeedX = -ballSpeedX;
    ballSpeedY = 2;
}

function update() {
    // Update Ball Position
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // AI Paddle Movement
    if ((ballY > aiPaddleY + paddleHeight / 2) && (aiPaddleY + paddleHeight < canvas.height)) {
        aiPaddleY += aiSpeed;
    } else if (ballY < aiPaddleY + paddleHeight / 2 && aiPaddleY > 30) {
        aiPaddleY -= aiSpeed;
    }

    // Collision Detection with Top and Bottom Walls
    if (ballY - ballRadius < 30 || ballY + ballRadius > canvas.height) { // Adjust for score area
        ballSpeedY = -ballSpeedY;
    }

    // Collision Detection with Paddles
    // Player Paddle
    if (ballX - ballRadius < paddleWidth && ballY > playerPaddleY && ballY < playerPaddleY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
        let deltaY = ballY - (playerPaddleY + paddleHeight / 2);
        ballSpeedY = deltaY * 0.35;
    }

    // AI Paddle
    if (ballX + ballRadius > canvas.width - paddleWidth && ballY > aiPaddleY && ballY < aiPaddleY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
        let deltaY = ballY - (aiPaddleY + paddleHeight / 2);
        ballSpeedY = deltaY * 0.35;
    }

    // Scoring
    if (ballX + ballRadius < 0) {
        aiScore++;
        resetBall();
    } else if (ballX - ballRadius > canvas.width) {
        playerScore++;
        resetBall();
    }

    draw();
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Score
    context.fillStyle = 'white';
    context.font = '35px Arial';
    context.fillText(playerScore, canvas.width / 4, 30);
    context.fillText(aiScore, 3 * canvas.width / 4, 30);

    // Draw Player Paddle
    context.fillRect(0, playerPaddleY, paddleWidth, paddleHeight);

    // Draw AI Paddle
    context.fillRect(canvas.width - paddleWidth, aiPaddleY, paddleWidth, paddleHeight);

    // Draw Ball
    context.beginPath();
    context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2, false);
    context.fill();
    context.closePath();

    requestAnimationFrame(update);
}

update();
