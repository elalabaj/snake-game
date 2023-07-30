import { Board, Cell } from "./board.js";
import { Snake } from "./snake.js";
import { drawApples, drawGameOver, drawSnake } from "./draw.js";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const context = canvas.getContext('2d') as CanvasRenderingContext2D;
const scoreLabel = document.getElementById('score') as HTMLElement;
const bestScoreLabel = document.getElementById('best-score') as HTMLElement;

canvas.width = 800;
canvas.height = 800;
context.font = '40px Times New Roman';

const moveInterval = 150;

let board: Board;
let snake: Snake;

let lastTimestamp: number;

start();

function start() {
    lastTimestamp = 0;

    board = new Board(16, 16);
    snake = new Snake(board, 0, 0, 'E', moveInterval);

    board.addRandomApple();

    requestAnimationFrame(animate);
}

function animate(timestamp: number) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    let deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    snake.update(deltaTime);

    drawApples(context, board);
    drawSnake(context, snake);
    scoreLabel.innerHTML = snake.score.toString();

    if (!snake.gameOver) requestAnimationFrame(animate);
    else {
        if (snake.score > parseInt(bestScoreLabel.innerHTML)) {
            bestScoreLabel.innerHTML = snake.score.toString();
        }
        drawGameOver(context);
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
