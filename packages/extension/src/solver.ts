import {
    Board,
    BoardOcr,
    Coordinate,
    Difficulty,
    DifficultyInfo,
    Format,
    SquareState,
    boardToConditions,
    clickSquare,
    gameOverVisible,
    getCanvasImage,
    getSolvedStatus,
    initBoard,
    pressKey,
    resolvedToCoordinates,
    sleep
} from "@mswp/solver"
import { satisfy } from "@mswp/solver/dist/csp"

export type SolverConfig = {
    startDelay: number
    solverDepth: number
    refreshRate: number
    startSquares: Coordinate[]
}

export enum BasicSquareState {
    UNREVEALED,
    FLAGGED,
    NUMBER,
    NUMBER_NEW,
    NUMBER_UNKNOWN
}

export type BasicBoardState = BasicSquareState[][]

export type SolverState = {
    time: {
        ocr: number
        csp: number
        waiting: number
    }
    iteration: number
}

export type SolverUpdate = SolverState & {
    boardState: BasicBoardState
    terminated: boolean
}

export type OnUpdate = (update: SolverUpdate) => void

export class Solver {
    cfg: SolverConfig
    active: boolean
    board: Board
    ocr: BoardOcr
    difficulty: Difficulty
    state: SolverState
    onUpdate: OnUpdate

    constructor(format: Format, cfg: SolverConfig, onUpdate: OnUpdate) {
        const { difficulty, ocrDataset } = format
        this.difficulty = DifficultyInfo[difficulty]
        const { dim, sqSize } = this.difficulty

        this.cfg = cfg
        this.active = true
        this.board = initBoard(dim)
        this.ocr = new BoardOcr(this.board, dim, sqSize, ocrDataset)
        this.onUpdate = onUpdate

        this.state = {
            time: {
                ocr: 0,
                csp: 0,
                waiting: 0
            },
            iteration: 0
        }
    }

    stop() {
        this.active = false
    }

    async resetBoard() {
        pressKey("R")
        await sleep(25)
        const { sqSize } = this.difficulty
        this.cfg.startSquares.forEach((cord) => clickSquare(sqSize, cord))
    }

    async start(step: boolean = false) {
        const { dim, sqSize } = this.difficulty

        while (true) {
            const img = getCanvasImage()
            this.state.time.ocr -= performance.now()
            this.ocr.step(img)
            this.state.time.ocr += performance.now()

            this.state.time.csp -= performance.now()
            const conds = boardToConditions(this.board)
            const resolved = satisfy(conds)
            this.state.time.csp += performance.now()

            let [safe, unsafe] = resolvedToCoordinates(resolved, dim)

            const {
                nBombs,
                dim: { h, w }
            } = this.difficulty
            const nSafe = h * w - nBombs

            const { nFlagged, nRevealed, unrevealed, hasUnknown } =
                getSolvedStatus(this.board)

            let solved = null
            if (nFlagged + unsafe.length === nBombs) {
                safe = unrevealed
                solved = true
            } else if (nRevealed + safe.length === nSafe) {
                unsafe = unrevealed
                solved = true
            } else if (!hasUnknown && safe.length === 0) {
                solved = false
            }

            unsafe.forEach(([i, j]) => {
                this.board[i][j] = {
                    state: SquareState.FLAGGED
                }
            })

            const safeIdxs = new Set(safe.map((cord) => JSON.stringify(cord)))

            const boardState = this.board.map((row, i) => {
                return row.map((sq, j) => {
                    if (safeIdxs.has(JSON.stringify([i, j]))) {
                        return BasicSquareState.NUMBER_NEW
                    }

                    switch (sq.state) {
                        case SquareState.FLAGGED:
                            return BasicSquareState.FLAGGED
                        case SquareState.UNREVEALED:
                            return BasicSquareState.UNREVEALED
                        case SquareState.REVEALED:
                            return sq.number === null
                                ? BasicSquareState.NUMBER_UNKNOWN
                                : BasicSquareState.NUMBER
                    }
                })
            })

            safe.forEach((cord) => clickSquare(sqSize, cord))

            await sleep(this.cfg.refreshRate)

            const terminated =
                !this.active || solved !== null || gameOverVisible() || step

            this.state.iteration += 1
            this.onUpdate({
                ...this.state,
                boardState,
                terminated
            })

            if (terminated) return
        }
    }
}
