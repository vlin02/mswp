import { clickCanvas } from "./game-ui"
import { Coordinate, SquareState, Board, BoardDim } from "./types"
import { range } from "./utils"

export function initBoard(dim: BoardDim) {
    const { h, w } = dim

    const state: Board = range(h).map(() => {
        return range(w).map(() => {
            return {
                state: SquareState.UNREVEALED
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
                case SquareState.FLAGGED:
                    return "F"
                case SquareState.UNREVEALED:
                    return " "
                case SquareState.REVEALED:
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

export function clickSquare(sqSize: number, cord: Coordinate) {
    const [i,j] = cord
    clickCanvas([i * sqSize, j * sqSize])
}

export function charBoardToString(charBoard: string[][]) {
    return charBoard.map((charRow) => charRow.join("")).join("\n")
}
