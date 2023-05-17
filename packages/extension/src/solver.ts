import {
    Board,
    BoardOcr,
    Coordinate,
    Difficulty,
    DifficultyInfo,
    Format,
    SquareState,
    Timer,
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
import { setInterval } from "timers/promises"

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
        await sleep(0)
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
            await sleep(5)
            await this.resetBoard()
            await sleep(this.cfg.startDelay)
            if (!this.active) return
        }
        
        let done = false
        let id
        id = setInterval(() => {
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

            if (!this.active) return

            const getCompletion = () => {
                if (solved === true) return GameCompletition.SOLVED
                if (solved === false && !(this.state.iteration < 10))
                    return GameCompletition.UNSOLVABLE
                if (gameOverOverlayVisible()) return GameCompletition.GAME_OVER
                if (runLevel < RunLevel.START) return GameCompletition.STEP
                return GameCompletition.IN_PROGRESS
            }

            const completion = getCompletion()
            console.log(completion)

            if (completion === GameCompletition.SOLVED && Number(Timer.innerHTML) === 0)  {
                return
            }

            this.state.iteration += 1

            this.onUpdate({
                ...this.state,
                boardState,
                completion
            })

            if (completion !== GameCompletition.IN_PROGRESS) return
        }, this.)
    }
}

export const beep = () => {
    async function startBeeping() {
        var snd = new Audio(
            "data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU="
        )
        while (true) {
            await sleep(2000)
            snd.play()
        }
    }
    startBeeping()
}