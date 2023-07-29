import { Board, Cell } from "./board.js";
import { Snake } from "./snake.js";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const context = canvas.getContext('2d') as CanvasRenderingContext2D;
const scoreLabel = document.getElementById('score') as HTMLElement;
const bestScoreLabel = document.getElementById('best-score') as HTMLElement;

canvas.width = 800;
canvas.height = 800;
context.font = '40px Times New Roman';

const cols = 16;
const rows = 16;
const colWidth = canvas.width / cols;
const rowHeight = canvas.height / rows;
const margin = 5;

const snakeColor = 'white';
const appleColor = 'red';

let board = new Board(16, 16);
let snake = new Snake(board, 0, 0, 'E');

board.addRandomApple();

let time = 0;
let moveInterval = 150;
let lastTimestamp = 0;

start();

function start() {
    board = new Board(16, 16);
    snake = new Snake(board, 0, 0, 'E');

    board.addRandomApple();

    time = 0;
    moveInterval = 150;
    lastTimestamp = 0;

    requestAnimationFrame(animate);
}

function animate(timestamp: number) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    let deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    time += deltaTime;
    if (time >= moveInterval) {
        time = 0;
        snake.update();
    }

    drawApples();
    drawSnake();
    scoreLabel.innerHTML = snake.score.toString();

    if (!snake.gameOver) requestAnimationFrame(animate);
    else {
        if (snake.score > parseInt(bestScoreLabel.innerHTML)) {
            bestScoreLabel.innerHTML = snake.score.toString();
        }
        drawGameOver();
    }
}

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp': snake.changeDirection('N'); break;
        case 'ArrowDown': snake.changeDirection('S'); break;
        case 'ArrowLeft': snake.changeDirection('W'); break;
        case 'ArrowRight': snake.changeDirection('E'); break;
        case ' ': if (snake.gameOver) start(); break;
    }
});

function drawGameOver() {
    context.fillStyle = 'red';
    context.textAlign = 'center';
    context.fillText('Game Over! Press space to continue.', canvas.width * 0.5, canvas.height * 0.5);
}

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

function drawBetweenSnakeSegments(x1: number, y1: number, x2: number, y2: number) {
    if (x1 == x2) {
        if (y1 > y2) [y1, y2] = [y2, y1];
        context.fillStyle = snakeColor;
        context.fillRect(x1 * colWidth + margin, y2 * rowHeight - margin, colWidth - 2 * margin, 2 * margin);
    }
    else if (y1 == y2) {
        if (x1 > x2) [x1, x2] = [x2, x1];
        context.fillStyle = snakeColor;
        context.fillRect(x2 * colWidth - margin, y1 * rowHeight + margin, 2 * margin, rowHeight - 2 * margin);
    }
}

function drawSnake() {
    snake.segments.forEach(({x, y}, i) => {
        context.fillStyle = snakeColor;
        context.fillRect(x * colWidth + margin, y * rowHeight + margin, colWidth - 2 * margin, rowHeight - 2 * margin);
        if (i > 0) drawBetweenSnakeSegments(x, y, snake.segments[i - 1].x, snake.segments[i - 1].y);
    });  
}