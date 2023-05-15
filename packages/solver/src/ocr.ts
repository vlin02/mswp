import { CanvasImage } from "./canvas-image"
import { BoardDim, Board, SquareState, Coordinate, OcrDataset } from "./types"
import { range } from "./utils"

export class BoardOcr {
    board: Board
    ocrDataset: OcrDataset
    dim: BoardDim
    sqSize: number

    q!: Coordinate[]

    constructor(
        board: Board,
        dim: BoardDim,
        sqSize: number,
        ocrDataset: OcrDataset
    ) {
        this.board = board
        this.ocrDataset = ocrDataset
        this.dim = dim
        this.sqSize = sqSize

        const { h, w } = dim
        this.q = range(h).flatMap((i) =>
            range(w).map((j): Coordinate => [i, j])
        )
    }

    step(img: CanvasImage) {
        const qNext = []
        while (this.q.length > 0) {
            const cord = this.q.pop() as Coordinate
            const pushToQ = this.#transitionSq(img, cord)

            if (pushToQ == null) {
                continue
            }

            if (pushToQ) this.q.push(cord)
            else qNext.push(cord)
        }

        this.q = qNext
        return this.board
    }

    #transitionSq(img: CanvasImage, cord: Coordinate) {
        const [i, j] = cord
        const cell = this.board[i][j]

        switch (cell.state) {
            case SquareState.UNREVEALED:
                for (const offset of this.ocrDataset.revealedSearch) {
                    const indicator = this.#toIndicator(img, cord, offset)
                    const isRevealed =
                        this.ocrDataset.revealedIndicators[indicator]

                    if (isRevealed) {
                        this.board[i][j] = {
                            state: SquareState.REVEALED,
                            number: null
                        }
                        return true
                    }
                }
                return false
            case SquareState.REVEALED:
                const maybeN = range(7).map(() => true)
                let eliminatedCnt = 0
                for (const offset of this.ocrDataset.numberSearch) {
                    const indicator = this.#toIndicator(img, cord, offset)

                    if (indicator in this.ocrDataset.uniqueIndicators) {
                        cell.number =
                            this.ocrDataset.uniqueIndicators[indicator]
                        return null
                    }

                    if (indicator in this.ocrDataset.notNIndicators) {
                        for (const i of this.ocrDataset.notNIndicators[
                            indicator
                        ]) {
                            eliminatedCnt += Number(maybeN[i])
                            maybeN[i] = false
                        }
                        if (eliminatedCnt === 7) {
                            cell.number = 0
                            return null
                        }
                    }
                }
                return false
        }
    }

    #toIndicator = (
        img: CanvasImage,
        [i, j]: Coordinate,
        [dx, dy]: Coordinate
    ) => {
        const rgb = img.getRgb(i * this.sqSize + dx, j * this.sqSize + dy)
        return [dx, dy, ...rgb].join(",")
    }
}
