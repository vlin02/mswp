import { getDim } from "./board"
import { BaseCondition, Resolved } from "./csp"
import { shash } from "./seq-ops"
import { Board, BoardDim, Coordinate, SquareState } from "./types"
import { range, checkBoundary } from "./utils"

const NEIGHBOR_OFFSETS = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1]
]

export function boardToConditions(board: Board) {
    const { h, w } = getDim(board)

    const conds: Record<string, BaseCondition> = {}

    let foundCnt = 0
    for (const i of range(h)) {
        for (const j of range(w)) {
            const cell = board[i][j]

            switch (cell.state) {
                case SquareState.UNREVEALED:
                    break
                case SquareState.FLAGGED:
                    foundCnt += 1
                    break
                case SquareState.REVEALED:
                    if (cell.number === null) break

                    const s = []
                    let cnt = cell.number

                    for (const [di, dj] of NEIGHBOR_OFFSETS) {
                        const [i1, j1] = [i + di, j + dj]
                        if (!checkBoundary(h, w, i1, j1)) {
                            continue
                        }

                        const nbrCell = board[i1][j1]
                        switch (nbrCell.state) {
                            case SquareState.FLAGGED:
                                cnt -= 1
                                break
                            case SquareState.UNREVEALED:
                                const idx = i1 * w + j1
                                s.push(idx.toString())
                                break
                        }
                    }

                    if (s.length > 0) {
                        s.sort((a, b) => (a > b ? 1 : -1))
                        conds[shash(s)] = {
                            seq: s,
                            cnt
                        }
                    }
                    break
            }
        }
    }

    return Object.values(conds)
}

export function resolvedToCoordinates(resolved: Resolved, dim: BoardDim): [Coordinate[], Coordinate[]] {
    const { w } = dim
    const posCords: Coordinate[] = []
    const negCords: Coordinate[] = []

    Object.entries(resolved).forEach(([el, pos]) => {
        const idx = Number(el)
        const cord: Coordinate = [Math.floor(idx / w), idx % w]
        const arr = pos ? posCords: negCords
        arr.push(cord)
    })

    return [negCords, posCords]
}

export function getSolvedStatus(board: Board) {
    let unrevealed: Coordinate[] = []
    let nFlagged = 0
    let nRevealed = 0
    let hasUnknown = false

    board.forEach((row, i) =>
        row.forEach((sq, j) => {
            switch (sq.state) {
                case SquareState.UNREVEALED:
                    unrevealed.push([i, j])
                    break
                case SquareState.FLAGGED:
                    nFlagged += 1
                    break
                case SquareState.REVEALED:
                    nRevealed += 1
                    hasUnknown =
                        hasUnknown || sq.number === null
                    break
            }
        })
    )
    
    return {
        unrevealed,
        nFlagged,
        nRevealed,
        hasUnknown
    }
}