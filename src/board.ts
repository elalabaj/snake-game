export enum Cell { Free, Snake, Apple };

export class Board {
    rows: number;
    cols: number;
    grid: Cell[][];

    constructor(rows: number, cols: number) {
        this.rows = rows;
        this.cols = cols;
        this.grid = Array.from({ length: cols }, () => new Array(rows).fill(Cell.Free));
    }

    addRandomApple() {
        let freeCells: {content: Cell, x: number, y: number}[] = [];
        this.grid.forEach((col, x) => {
            col.forEach((cell, y) => {
                if (cell == Cell.Free) freeCells.push({content: cell, x, y});
            });
        });
        let randomCell = freeCells[Math.floor(Math.random() * freeCells.length)];
        this.grid[randomCell.x][randomCell.y] = Cell.Apple;
    }

    countApples(): number {
        let apples = 0;
        this.grid.forEach(col => {
            col.forEach(cell => {
                if (cell == Cell.Apple) apples++;
            });
        });
        return apples;
    }
}