import { Board, Cell } from "./board.js";
import { Snake } from "./snake.js"

type Context = CanvasRenderingContext2D;

const canvasWidth = 800;
const canvasHeight = 800;
const cols = 16;
const rows = 16;
const colWidth = canvasWidth / cols;
const rowHeight = canvasHeight / rows;
const margin = 5;

const snakeColor = 'white';
const appleColor = 'red';

export function drawGameOver(context: Context) {
    context.fillStyle = 'red';
    context.textAlign = 'center';
    context.fillText('Game Over! Press space to continue.', canvasWidth * 0.5, canvasHeight * 0.5);
}

export function drawApples(context: Context, board: Board) {
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

export function drawSnake(context: Context, snake: Snake) {
    snake.segments.forEach(({x, y}, i) => {
        if (i > 0) {        
            context.fillStyle = snakeColor;
            context.fillRect(x * colWidth + margin, y * rowHeight + margin, colWidth - 2 * margin, rowHeight - 2 * margin);
            if (i > 1) drawFromTo(context, {x, y}, {x: snake.segments[i - 1].x, y: snake.segments[i - 1].y}, 2 * margin / rowHeight);
        }
    });  
    drawEnds(context, snake);
}

function drawFromTo(context: Context, from: {x: number, y: number}, to: {x: number, y: number}, thicknessFactor: number, color: string = snakeColor) {
    let x: number, y: number, width: number, height: number;
    if (to.x == from.x) {
        height = rowHeight * thicknessFactor;
        width = colWidth - 2 * margin;
        x = to.x * colWidth + margin;
        y = to.y < from.y ? from.y * rowHeight + margin - height : to.y * rowHeight - margin;
    }
    else {
        width = colWidth * thicknessFactor;
        height = rowHeight - 2 * margin;
        y = to.y * rowHeight + margin;
        x = to.x < from.x ? from.x * colWidth + margin - width : to.x * colWidth - margin;
    }

    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function drawOneSegment(context: Context, from: {x: number, y: number}, to: {x: number, y: number}, progression: number) {
    let width = colWidth - 2 * margin;
    let height = rowHeight - 2 * margin;
    let x = from.x * colWidth + margin + (to.x - from.x) * colWidth * progression;
    let y = from.y * rowHeight + margin + (to.y - from.y) * rowHeight * progression;

    context.fillStyle = snakeColor;
    context.fillRect(x, y, width, height);

    console.log(x, y);
}

function drawEnds(context: Context, snake: Snake) {
    let head = snake.segments[0];
    let behindHead = snake.segments.length > 1 ? snake.segments[1] : snake.tail;

    let thicknessFactor = snake.gameOver ? 1 : snake.time / snake.moveInterval;

    if (snake.segments.length == 1) {
        drawOneSegment(context, behindHead, head, thicknessFactor);
    }
    else {
        drawFromTo(context, behindHead, head, thicknessFactor);
        let beforeTail = snake.segments[snake.segments.length - 1];
        if (beforeTail.x != snake.tail.x || beforeTail.y != snake.tail.y) {
            drawFromTo(context, beforeTail, snake.tail, 1 - thicknessFactor);
        }
    }
}