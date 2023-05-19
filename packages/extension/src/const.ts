import { DifficultyType } from "@mswp/solver/src/types";
import { BasicSquareState } from "./solver";

export const DEV_DIFFICULTY = DifficultyType.HARD

// ----

export const stateToColor: { [key in BasicSquareState]: string } = {
    [BasicSquareState.UNREVEALED]: "white",
    [BasicSquareState.FLAGGED]: "#E24C1F",
    [BasicSquareState.NUMBER]: "#E0C3A2",
    [BasicSquareState.NUMBER_UNKNOWN]: "grey",
    [BasicSquareState.NUMBER_NEW]: "#B3D45F"
}

export const IS_PRODUCTION = process.env.NODE_ENV === "production"
export const INITIAL_DIFFICULTY = IS_PRODUCTION ? DifficultyType.MEDIUM : DEV_DIFFICULTY