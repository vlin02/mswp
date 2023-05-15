import { DifficultyType } from "./types";
export const DifficultyInfo = {
    [DifficultyType.EASY]: {
        type: DifficultyType.EASY,
        dim: {
            h: 8,
            w: 10
        },
        sqSize: 45,
        nBombs: 10
    },
    [DifficultyType.MEDIUM]: {
        type: DifficultyType.MEDIUM,
        dim: {
            h: 14,
            w: 18
        },
        sqSize: 30,
        nBombs: 40
    },
    [DifficultyType.HARD]: {
        type: DifficultyType.HARD,
        dim: {
            h: 20,
            w: 24
        },
        sqSize: 25,
        nBombs: 99
    }
};
