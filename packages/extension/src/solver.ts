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
    gameOverOverlayVisible,
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

export enum RunLevel {
    STEP = 0,
    START = 1,
    RESET = 2
}

export enum GameCompletition {
    STEP = "stepped",
    GAME_OVER = "game over",
    UNSOLVABLE = "stuck",
    SOLVED = "solved",
    IN_PROGRESS = "-",
    STOPPED = "stopped"
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
    boardState?: BasicBoardState
    completion: GameCompletition
}

export type OnUpdate = (update: SolverUpdate) => void

export class Solver {
    cfg!: SolverConfig
    active!: boolean
    board!: Board
    ocr!: BoardOcr
    difficulty!: Difficulty
    state!: SolverState
    onUpdate!: OnUpdate
    refresh: () => void

    constructor(format: Format, cfg: SolverConfig, onUpdate: OnUpdate) {
        this.refresh = () => {
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

        this.refresh()
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

    async start(runLevel: RunLevel) {
        let t
        const { dim, sqSize } = this.difficulty

        let guaranteedReveal = false
        if (runLevel >= RunLevel.RESET) {
            guaranteedReveal = true
            await this.resetBoard()
            await sleep(this.cfg.startDelay)

            if (!this.active) return
        }

        while (true) {
            const img = getCanvasImage()
            t = performance.now()
            this.ocr.step(img)
            this.state.time.ocr += performance.now() - t

            t = performance.now()
            const conds = boardToConditions(this.board)
            const resolved = satisfy(conds)
            this.state.time.csp += performance.now() - t

            let [safe, unsafe] = resolvedToCoordinates(resolved, dim)

            const {
                nBombs,
                dim: { h, w }
            } = this.difficulty
            const nSafe = h * w - nBombs

            const { nFlagged, nRevealed, unrevealed, hasUnknown } =
                getSolvedStatus(this.board)

            let solved: boolean | null = null
            if (nFlagged + unsafe.length === nBombs) {
                safe = unrevealed.filter(
                    ([i, j]) => !unsafe.some(([i1, j1]) => i === i1 && j === j1)
                )
                solved = true
            } else if (nRevealed + safe.length === nSafe) {
                unsafe = unrevealed.filter(
                    ([i, j]) => !safe.some(([i1, j1]) => i === i1 && j === j1)
                )
                solved = true
            } else if (!hasUnknown && safe.length === 0) {
                solved = false
            }

            guaranteedReveal = guaranteedReveal && nRevealed === 0

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

            t = performance.now()
            await sleep(this.cfg.refreshRate)
            this.state.time.waiting += performance.now() - t

            if (!this.active) return

            const getCompletion = () => {
                if (solved === true) return GameCompletition.SOLVED
                if (solved === false && !guaranteedReveal)
                    return GameCompletition.UNSOLVABLE
                if (gameOverOverlayVisible()) return GameCompletition.GAME_OVER
                if (runLevel < RunLevel.START) return GameCompletition.STEP
                return GameCompletition.IN_PROGRESS
            }
            const completion = getCompletion()

            this.state.iteration += 1

            this.onUpdate({
                ...this.state,
                boardState,
                completion
            })

            if (completion !== GameCompletition.IN_PROGRESS) return
        }
    }
}
