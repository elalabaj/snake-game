export var Cell;
(function (Cell) {
    Cell[Cell["Free"] = 0] = "Free";
    Cell[Cell["Snake"] = 1] = "Snake";
    Cell[Cell["Apple"] = 2] = "Apple";
})(Cell || (Cell = {}));
;
export class Board {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.grid = Array.from({ length: cols }, () => new Array(rows).fill(Cell.Free));
    }
    addRandomApple() {
        let freeCells = [];
        this.grid.forEach((col, x) => {
            col.forEach((cell, y) => {
                if (cell == Cell.Free)
                    freeCells.push({ content: cell, x, y });
            });
        });
        let randomCell = freeCells[Math.floor(Math.random() * freeCells.length)];
        this.grid[randomCell.x][randomCell.y] = Cell.Apple;
    }
    countApples() {
        let apples = 0;
        this.grid.forEach(col => {
            col.forEach(cell => {
                if (cell == Cell.Apple)
                    apples++;
            });
        });
        return apples;
    }
}
