import { Coordinate, CellState, Board, BoardDim } from "./types"
import { range } from "./utils"

export function initBoard(dim: BoardDim) {
    const { h, w } = dim

    const state: Board = range(h).map(() => {
        return range(w).map(() => {
            return {
                state: CellState.UNREVEALED
            }
        })
    })

    return state
}

export function printBoard(
    board: Board,
    {
        toClick = [],
        toFlag = [],
        other = []
    }: {
        toClick?: Coordinate[]
        toFlag?: Coordinate[]
        other?: [number, number, string][]
    } = {}
) {
    const w = board[0].length

    const charBoard = [[" ", ...range(w).map((i) => (i % 10).toString())]]
    board.forEach((row, i) => {
        const charRow = row.map((cell) => {
            switch (cell.state) {
                case CellState.FLAGGED:
                    return "F"
                case CellState.UNREVEALED:
                    return " "
                case CellState.REVEALED:
                    return cell.number === null ? "?" : cell.number.toString()
            }
        })

        charBoard.push([(i % 10).toString(), ...charRow])
    })

    for (const [i, j] of toClick) {
        charBoard[i][j] = "x"
    }

    for (const [i, j] of toFlag) {
        charBoard[i][j] = "f"
    }

    for (const [i, j, s] of other) {
        charBoard[i][j] = s
    }

    const s = charBoardToString(charBoard)
    console.log(s)
}

export function getDim(board: any[][]): BoardDim {
    return {h: board.length, w: board[0].length}
}

export function boardCenter(dim: BoardDim): [number, number] {
    const { h, w } = dim
    return [Math.floor(h / 2), Math.floor(w / 2)]
}

export function charBoardToString(charBoard: string[][]) {
    return charBoard.map((charRow) => charRow.join("")).join("\n")
}
