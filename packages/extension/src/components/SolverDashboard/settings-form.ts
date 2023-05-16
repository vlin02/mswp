import { DifficultyType, DifficultyInfo, boardCenter } from "@mswp/solver"
import { SolverConfig } from "../../solver"

export type SettingsForm = {
    refreshRate: string
    startDelay: string
    solverDepth: string
    startSquares: string
}

export const getDefaultForm = (difficulty: DifficultyType): SettingsForm => {
    const { dim } = DifficultyInfo[difficulty]

    return {
        refreshRate: String(20),
        startDelay: String(1000),
        solverDepth: String(2),
        startSquares: JSON.stringify([boardCenter(dim)])
    }
}

const cordListRgx = /^\[\[\d+,\d+\](,\[\d+,\d+\])*\]$/

export const verifyStartSquares = (s: string): boolean => {
    return s.match(cordListRgx) !== null
}

export const formToConfig = ({
    refreshRate,
    startDelay,
    solverDepth,
    startSquares
}: SettingsForm): SolverConfig => {
    return {
        refreshRate: Number(refreshRate),
        startDelay: Number(startDelay),
        solverDepth: Number(solverDepth),
        startSquares: JSON.parse(startSquares)
    }
}
