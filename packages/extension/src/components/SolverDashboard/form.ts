import { DifficultyType, DifficultyInfo, boardCenter } from "@mswp/solver"
import { SolverConfig } from "../../solver"

export type ConfigInput = {
    refreshRate: string
    startDelay: string
    solverDepth: string
    startSquares: string
}

export const getConfigInputDefault = (difficulty: DifficultyType): ConfigInput => {
    const { dim } = DifficultyInfo[difficulty]

    return {
        refreshRate: String(40),
        startDelay: String(1000),
        solverDepth: String(2),
        startSquares: JSON.stringify([boardCenter(dim)])
    }
}

const cordListRgx = /^\[\[\d+,\d+\](,\[\d+,\d+\])*\]$/

export const verifyStartSquares = (s: string): boolean => {
    return s.match(cordListRgx) !== null
}

export const inputToConfig = ({
    refreshRate,
    startDelay,
    solverDepth,
    startSquares
}: ConfigInput): SolverConfig => {
    return {
        refreshRate: Number(refreshRate),
        startDelay: Number(startDelay),
        solverDepth: Number(solverDepth),
        startSquares: JSON.parse(startSquares)
    }
}

export type ConfigForm = {
    input: ConfigInput
    validStartSquares: boolean
    valid: boolean
}

export const getConfigFormDefault = (difficulty: DifficultyType): ConfigForm => {
    return {
        input: getConfigInputDefault(difficulty),
        validStartSquares: true,
        valid: true
    }
}
