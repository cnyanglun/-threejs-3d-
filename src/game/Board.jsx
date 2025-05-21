export class Board{
    constructor(rows = 6, cols = 6){
        this.rows = rows;
        this.cols = cols;
        this.grid = Array.from({ length: rows }, () => Array(cols).fill(null))
    }

    setPiece(row, col, piece){
        if(this.isValidPosition(row, col)){
            this.grid[row][col] = piece
        }
    }

    getPiece(row, col) {
        if(this.isValidPosition(row, col)){
            return this.grid[row][col]
        }
        return null
    }

    isValidPosition(row, col){
        return row >= 0 && col >= 0 && row <=this.rows && col <= this.cols
    }

    clear() {
        this.grid = Array.from({ length: this.rows }, () => Array(this.cols).fill(null))
    }
}