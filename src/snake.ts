import { Cell, Board } from './board.js';

interface Segment {
    x: number;
    y: number;
}

type Direction = 'N' | 'E' | 'S' | 'W';
const dx = { 'N': 0, 'E': 1, 'S': 0, 'W': -1 };
const dy = { 'N': -1, 'E': 0, 'S': 1, 'W': 0 };
const oppositeDirecction = { 'N': 'S', 'E': 'W', 'S': 'N', 'W': 'E' };

export class Snake {
    board: Board;
    segments: Segment[];
    tail: Segment;
    nextDirections: Direction[] = []
    gameOver = false;
    score = 0;
    moveInterval: number;
    time = 0;

    constructor(board: Board, x: number, y: number, direction: Direction, moveInterval: number) {
        this.board = board;
        this.segments = [{x, y}];
        this.tail = this.segments[0];
        this.nextDirections = [direction];
        this.board.grid[x][y] = Cell.Snake;
        this.moveInterval = moveInterval;
    }

    changeDirection(direction: Direction) {
        let lastDirection = this.nextDirections[this.nextDirections.length - 1];
        if (direction != lastDirection && direction != oppositeDirecction[lastDirection]) {
            this.nextDirections.push(direction);
        }
    }

    update(deltaTime: number) {
        this.time += deltaTime;
        if (this.time >= this.moveInterval) {
            this.time = 0;

            let head = this.segments[0];

            if (this.board.grid[head.x][head.y] == Cell.Apple) {
                this.board.grid[head.x][head.y] = Cell.Snake;   
            }

            if (this.nextDirections.length > 1) this.nextDirections.splice(0, 1);
            let direction = this.nextDirections[0];

            let newX = head.x + dx[direction];
            let newY = head.y + dy[direction];
            if (newX < 0 || newY < 0 || newX >= this.board.cols || newY >= this.board.rows || this.board.grid[newX][newY] == Cell.Snake) {
                this.gameOver = true;
                return;
            }

            let lastSegment = this.segments[this.segments.length - 1];
            this.tail = {x: lastSegment.x, y: lastSegment.y};
            this.board.grid[lastSegment.x][lastSegment.y] = Cell.Free;

            if (this.board.grid[newX][newY] == Cell.Apple) {
                this.segments.push({x: lastSegment.x, y: lastSegment.y});
                this.board.grid[lastSegment.x][lastSegment.y] = Cell.Snake;
                this.board.addRandomApple();
                this.score++;
            }

            for (let i = this.segments.length - 1; i > 0; i--) {
                this.segments[i].x = this.segments[i - 1].x;
                this.segments[i].y = this.segments[i - 1].y;
            }
            
            this.segments[0] = {x: newX, y: newY};
            if (this.board.grid[newX][newY] != Cell.Apple) {
                this.board.grid[newX][newY] = Cell.Snake;
            }
        }
    }
}