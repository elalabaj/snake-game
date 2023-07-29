import { Board, Cell } from "./board.js";
import { Snake } from "./snake.js";
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 800;
const cols = 16;
const rows = 16;
const colWidth = canvas.width / cols;
const rowHeight = canvas.height / rows;
const margin = 5;
const snakeColor = 'white';
const appleColor = 'red';
const board = new Board(16, 16);
const snake = new Snake(board, 0, 0, 'E');
board.addRandomApple();
let time = 0;
let moveInterval = 150;
let lastTimestamp = 0;
function animate(timestamp) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    let deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    time += deltaTime;
    if (time >= moveInterval) {
        time -= moveInterval;
        snake.update();
    }
    drawApples();
    drawSnake();
    if (!snake.gameOver)
        requestAnimationFrame(animate);
}
animate(0);
window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            snake.changeDirection('N');
            break;
        case 'ArrowDown':
            snake.changeDirection('S');
            break;
        case 'ArrowLeft':
            snake.changeDirection('W');
            break;
        case 'ArrowRight':
            snake.changeDirection('E');
            break;
    }
});
function drawApples() {
    board.grid.forEach((col, x) => col.forEach((cell, y) => {
        if (cell == Cell.Apple) {
            const centerX = x * colWidth + colWidth * 0.5;
            const centerY = y * rowHeight + rowHeight * 0.5;
            const radius = colWidth / 2 - margin;
            context.beginPath();
            context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            context.fillStyle = appleColor;
            context.fill();
            context.stroke();
        }
    }));
}
function drawBetweenSnakeSegments(x1, y1, x2, y2) {
    if (x1 == x2) {
        if (y1 > y2)
            [y1, y2] = [y2, y1];
        context.fillStyle = snakeColor;
        context.fillRect(x1 * colWidth + margin, y2 * rowHeight - margin, colWidth - 2 * margin, 2 * margin);
    }
    else if (y1 == y2) {
        if (x1 > x2)
            [x1, x2] = [x2, x1];
        context.fillStyle = snakeColor;
        context.fillRect(x2 * colWidth - margin, y1 * rowHeight + margin, 2 * margin, rowHeight - 2 * margin);
    }
}
function drawSnake() {
    snake.segments.forEach(({ x, y }, i) => {
        context.fillStyle = snakeColor;
        context.fillRect(x * colWidth + margin, y * rowHeight + margin, colWidth - 2 * margin, rowHeight - 2 * margin);
        if (i > 0)
            drawBetweenSnakeSegments(x, y, snake.segments[i - 1].x, snake.segments[i - 1].y);
    });
}
