import { Loop } from "@mui/icons-material"
import { Stack, InputAdornment, Button } from "@mui/material"
import SimpleInputField from "./SimpleInputField"
import { SolverConfig } from "../solver"
import { DifficultyInfo, DifficultyType, boardCenter } from "@mswp/solver"

const getDefaultConfig = (difficulty: DifficultyType): SolverConfig => {
    const { dim } = DifficultyInfo[difficulty]

    return {
        refreshRate: 20,
        startDelay: 0,
        solverDepth: 2,
        startSquares: [boardCenter(dim)]
    }
}

export default function () {
    return (
        <Stack direction="column" spacing={2}>
            <SimpleInputField
                id="refresh-rate"
                label="Refresh Rate"
                type="number"
                InputProps={{
                    inputProps: {
                        min: 0
                    },
                    endAdornment: (
                        <InputAdornment position="start">
                            &nbsp;ms
                        </InputAdornment>
                    )
                }}
            />

            <SimpleInputField
                id="poll-interval"
                label="Start Delay"
                type="number"
                InputProps={{
                    inputProps: {
                        min: 0
                    },
                    endAdornment: (
                        <InputAdornment position="start">
                            &nbsp;ms
                        </InputAdornment>
                    )
                }}
            />
            <SimpleInputField
                id="solver-depth"
                type="number"
                label="Solver Depth"
                InputProps={{
                    inputProps: {
                        min: 1
                    }
                }}
            />
            <SimpleInputField
                id="start-squares"
                type="text"
                label="Start Squares"
                defaultValue={JSON.stringify()}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">
                            &nbsp;(x,y)
                        </InputAdornment>
                    )
                }}
            />
            <Button size="small" startIcon={<Loop />} color="secondary">
                default
            </Button>
        </Stack>
    )
}
