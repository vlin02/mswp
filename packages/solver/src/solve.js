import { getDim } from "./board";
import { shash } from "./seq-ops";
import { CellState } from "./types";
import { range, checkBoundary } from "./utils";
const NEIGHBOR_OFFSETS = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1]
];
export function getBoardConditions(board) {
    const { h, w } = getDim(board);
    const conds = {};
    let foundCnt = 0;
    for (const i of range(h)) {
        for (const j of range(w)) {
            const cell = board[i][j];
            switch (cell.state) {
                case CellState.UNREVEALED:
                    break;
                case CellState.FLAGGED:
                    foundCnt += 1;
                    break;
                case CellState.REVEALED:
                    if (cell.number === null)
                        break;
                    const s = [];
                    let cnt = cell.number;
                    for (const [di, dj] of NEIGHBOR_OFFSETS) {
                        const [i1, j1] = [i + di, j + dj];
                        if (!checkBoundary(h, w, i1, j1)) {
                            continue;
                        }
                        const nbrCell = board[i1][j1];
                        switch (nbrCell.state) {
                            case CellState.FLAGGED:
                                cnt -= 1;
                                break;
                            case CellState.UNREVEALED:
                                const idx = i1 * w + j1;
                                s.push(idx.toString());
                                break;
                        }
                    }
                    if (s.length > 0) {
                        s.sort((a, b) => (a > b ? 1 : -1));
                        conds[shash(s)] = {
                            seq: s,
                            cnt
                        };
                    }
                    break;
            }
        }
    }
    return Object.values(conds);
}
