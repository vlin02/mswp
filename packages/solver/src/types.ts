export type Coordinate = [number, number]

export enum CellState {
    UNREVEALED = "UNREVEALED",
    FLAGGED = "FLAGGED",
    REVEALED = "REVEALED"
}

export type UnrevealedCell = {
    state: CellState.UNREVEALED
}

export type FlaggedCell = {
    state: CellState.FLAGGED
}

export type RevealedCell = {
    state: CellState.REVEALED
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

export type FormatData = {
    platform: GamePlatform
    difficulty: Difficulty
    ocrDset: OcrDataset
}
