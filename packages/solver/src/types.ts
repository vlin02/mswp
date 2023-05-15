export type Coordinate = [number, number]

export enum SquareState {
    UNREVEALED = "UNREVEALED",
    FLAGGED = "FLAGGED",
    REVEALED = "REVEALED"
}

export type UnrevealedCell = {
    state: SquareState.UNREVEALED
}

export type FlaggedCell = {
    state: SquareState.FLAGGED
}

export type RevealedCell = {
    state: SquareState.REVEALED
    number: number | null
}

export type Square = UnrevealedCell | FlaggedCell | RevealedCell

export type Board = Square[][]

export enum DifficultyType {
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD"
}

export type BoardDim = {
    h: number
    w: number
}

export type Difficulty = {
    type: DifficultyType
    dim: BoardDim
    nBombs: number
    sqSize: number // cell side length
}

export enum FormatType {
    SEARCH_HARD = "SEARCH_HARD",
    SEARCH_MEDIUM = "SEARCH_MEDIUM",
    SEARCH_EASY = "SEARCH_EASY",
    FBX_HARD = "FBX_HARD",
    FBX_MEDIUM = "FBX_MEDIUM",
    FBX_EASY = "FBX_EASY"
}

export enum GamePlatform {
    SEARCH = "SEARCH",
    FBX = "FBX"
}

export type OcrDataset = {
    revealedSearch: Coordinate[]
    numberSearch: Coordinate[]
    revealedIndicators: { [key: string]: boolean }
    uniqueIndicators: { [key: string]: number }
    notNIndicators: { [key: string]: number[] }
}

export type Format = {
    platform: GamePlatform
    difficulty: DifficultyType
    ocrDataset: OcrDataset
}
