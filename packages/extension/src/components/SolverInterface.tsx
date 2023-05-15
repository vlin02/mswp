import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import {
    AllInclusive,
    Help,
    Loop,
    Pause,
    PlayArrow,
    Redo,
    RestartAlt,
    Start
} from "@mui/icons-material"
import {
    Button,
    ButtonGroup,
    InputAdornment,
    Stack,
    Tooltip
} from "@mui/material"
import { StatText } from "./StatText"
import SimpleInputField from "./SimpleInputField"
import {
    DifficultyInfo,
    DifficultyType,
    boardCenter,
    range
} from "@mswp/solver"
import BoardState from "./BoardState"
import { useState } from "react"
import { BasicSquareState, SolverConfig, SolverUpdate } from "../solver"
import useSolver, { RunState } from "../hooks/useSolver"
import useDifficulty from "../hooks/useDifficulty"

const cordListRgx = /^\[\[\d+,\d+\](,\[\d+,\d+\])*\]$/
import SimpleNumberField from "./NumberField"

type Form = { [key in keyof SolverConfig]: string }
type Config = { form: Form; config: SolverConfig }

const formToConfig = ({
    refreshRate,
    startDelay,
    solverDepth,
    startSquares
}: Form): SolverConfig => {
    return {
        refreshRate: Number(refreshRate),
        startDelay: Number(startDelay),
        solverDepth: Number(solverDepth),
        startSquares: JSON.parse(startSquares)
    }
}

const getDefaultConfig = (difficulty: DifficultyType): Config => {
    const { dim } = DifficultyInfo[difficulty]

    const form = {
        refreshRate: String(20),
        startDelay: String(1000),
        solverDepth: String(2),
        startSquares: JSON.stringify([boardCenter(dim)])
    }

    return {
        form,
        config: formToConfig(form)
    }
}

const verifyStartSquares = (s: string): boolean => {
    return s.match(cordListRgx) !== null
}
const toMsFormat = (ms: number) => {
    return Number(ms).toFixed(3) + " ms"
}

export default function SolverInterface() {
    const difficulty = useDifficulty()
    const [form, setForm] = useState<Config>(getDefaultConfig(difficulty))

    const [update, setUpdate] = useState<SolverUpdate>()
    const [looping, setLooping] = useState(false)

    const solver = useSolver({
        difficulty,
        config: form.config,
        looping,
        onUpdate: setUpdate
    })

    const {
        dim: { h, w }
    } = DifficultyInfo[difficulty]

    const boardState =
        update?.boardState ??
        range(h).map(() =>
            range(w).map(() => {
                return BasicSquareState.UNREVEALED
            })
        )

    const getOnChange = (key: keyof SolverConfig) => {
        return (e: any) =>
            setForm((state) => {
                const form = { ...state.form, [key]: e.target.value }
                return {
                    form,
                    config: verifyStartSquares(form.startSquares)
                        ? formToConfig(form)
                        : state.config
                }
            })
    }

    return (
        <Stack padding={3} direction="column" alignItems="center">
            <Stack
                direction="column"
                spacing={4}
                display="flex"
                alignItems="center"
            >
                <Stack direction="row" justifyContent="space-between">
                    <Stack direction="row" spacing={2}>
                        <ButtonGroup variant="outlined">
                            <Tooltip title="Reset" onClick={solver.reset}>
                                <Button size="medium" color="secondary">
                                    <RestartAlt />
                                </Button>
                            </Tooltip>
                            {solver.runState === RunState.RUNNING ? (
                                <Tooltip title="pause">
                                    <Button
                                        size="medium"
                                        color="secondary"
                                        onClick={solver.stop}
                                    >
                                        <Pause />
                                    </Button>
                                </Tooltip>
                            ) : (
                                <Tooltip title="start">
                                    <Button
                                        size="medium"
                                        color="secondary"
                                        onClick={solver.start}
                                        disabled={
                                            solver.runState !== RunState.IDLE
                                        }
                                    >
                                        <PlayArrow />
                                    </Button>
                                </Tooltip>
                            )}
                            <Tooltip title="Step">
                                <Button
                                    size="medium"
                                    color="secondary"
                                    onClick={solver.step}
                                    disabled={solver.runState !== RunState.IDLE}
                                >
                                    <Redo />
                                </Button>
                            </Tooltip>
                            <Tooltip
                                title="Loop"
                                onClick={() => setLooping(!looping)}
                            >
                                <Button size="medium" color="secondary">
                                    <AllInclusive />
                                </Button>
                            </Tooltip>
                        </ButtonGroup>
                        <Box position="absolute" right={8} top={8}>
                            <IconButton size="medium" color="secondary">
                                <Help />
                            </IconButton>
                        </Box>
                    </Stack>
                </Stack>
                <Stack direction="row" spacing={4}>
                    <Stack direction="column" spacing={4} width={250}>
                        <Box alignSelf="center">
                            <BoardState boardState={boardState} width={250} />
                        </Box>
                        <Stack>
                            <StatText
                                title="Iterations"
                                value={update ? String(update.iteration) : "- "}
                            />
                            <StatText
                                title="OCR Time"
                                value={update ? toMsFormat(update.time.ocr) : "- "}
                            />
                            <StatText
                                title="Solver Time"
                                value={update ? toMsFormat(update.time.csp) : "- "}
                            />
                            <StatText
                                title="Sleep Time"
                                value={
                                    update ? toMsFormat(update.time.waiting) : "- "
                                }
                            />
                        </Stack>
                    </Stack>
                    <Stack direction="column" spacing={2}>
                        <SimpleNumberField
                            label="Refresh Rate"
                            value={form.form.refreshRate}
                            onChange={getOnChange("refreshRate")}
                            helperText={
                                form.config.refreshRate < 5
                                    ? "<5 ms refresh rate defaults to 5"
                                    : null
                            }
                            InputProps={{
                                inputProps: {
                                    min: 5
                                },
                                endAdornment: (
                                    <InputAdornment position="start">
                                        &nbsp;ms
                                    </InputAdornment>
                                )
                            }}
                        />
                        <SimpleNumberField
                            label="Start Delay"
                            inputProps={{ type: "number" }}
                            value={form.form.startDelay}
                            onChange={getOnChange("startDelay")}
                            helperText={
                                form.config.startDelay < 1000
                                    ? "<1000 ms start delay can be inconsistent"
                                    : null
                            }
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
                        <SimpleNumberField
                            label="Solver Depth"
                            value={form.form.solverDepth}
                            onChange={getOnChange("solverDepth")}
                            InputProps={{
                                inputProps: {
                                    min: 1
                                }
                            }}
                            helperText={
                                form.config.solverDepth > 2
                                    ? "solver depth >2 may run slowly"
                                    : null
                            }
                        />
                        <SimpleInputField
                            id="start-squares"
                            type="text"
                            label="Start Squares"
                            value={form.form.startSquares}
                            onChange={getOnChange("startSquares")}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="start">
                                        &nbsp;[x,y]
                                    </InputAdornment>
                                )
                            }}
                            helperText={
                                verifyStartSquares(form.form.startSquares)
                                    ? null
                                    : "must be JSON format [[x,y]...]"
                            }
                        />
                        <Button
                            size="small"
                            startIcon={<Loop />}
                            color="secondary"
                        >
                            default
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}
