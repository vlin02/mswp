import { CellState } from "./types";
import { range } from "./utils";
export class StatefulOCR {
    board;
    ocrDataset;
    dim;
    sqSize;
    q;
    constructor(board, dim, sqSize, ocrDataset) {
        this.board = board;
        this.ocrDataset = ocrDataset;
        this.dim = dim;
        this.sqSize = sqSize;
        const { h, w } = dim;
        this.q = range(h).flatMap((i) => range(w).map((j) => [i, j]));
    }
    step(img) {
        const qNext = [];
        while (this.q.length > 0) {
            const cord = this.q.pop();
            const pushToQ = this.#transitionSq(img, cord);
            if (pushToQ == null) {
                continue;
            }
            if (pushToQ)
                this.q.push(cord);
            else
                qNext.push(cord);
        }
        this.q = qNext;
        return this.board;
    }
    #transitionSq(img, cord) {
        const [i, j] = cord;
        const cell = this.board[i][j];
        switch (cell.state) {
            case CellState.UNREVEALED:
                for (const offset of this.ocrDataset.revealedSearch) {
                    const indicator = this.#toIndicator(img, cord, offset);
                    const isRevealed = this.ocrDataset.revealedIndicators[indicator];
                    if (isRevealed) {
                        this.board[i][j] = {
                            state: CellState.REVEALED,
                            number: null
                        };
                        return true;
                    }
                }
                return false;
            case CellState.REVEALED:
                const maybeN = range(7).map(() => true);
                let eliminatedCnt = 0;
                for (const offset of this.ocrDataset.numberSearch) {
                    const indicator = this.#toIndicator(img, cord, offset);
                    if (indicator in this.ocrDataset.uniqueIndicators) {
                        cell.number =
                            this.ocrDataset.uniqueIndicators[indicator];
                        return null;
                    }
                    if (indicator in this.ocrDataset.notNIndicators) {
                        for (const i of this.ocrDataset.notNIndicators[indicator]) {
                            eliminatedCnt += Number(maybeN[i]);
                            maybeN[i] = false;
                        }
                        if (eliminatedCnt === 7) {
                            cell.number = 0;
                            return null;
                        }
                    }
                }
                return false;
        }
    }
    #toIndicator = (img, [i, j], [dx, dy]) => {
        const rgb = img.getRgb(i * this.sqSize + dx, j * this.sqSize + dy);
        return [dx, dy, ...rgb].join(",");
    };
}
