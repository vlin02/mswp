import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import {
    AllInclusive,
    Help,
    Loop,
    Pause,
    PlayArrow,
    Redo,
    RestartAlt
} from "@mui/icons-material"
import {
    Button,
    ButtonGroup,
    InputAdornment,
    Stack,
    Tooltip
} from "@mui/material"
import { StatText } from "../StatText"
import SimpleInputField from "../SimpleInputField"
import { DifficultyInfo, DifficultyType, range } from "@mswp/solver"
import BoardState from "../BoardState"
import { useState } from "react"
import { BasicSquareState, SolverUpdate } from "../../solver"
import useSolverController, { RunState } from "../../hooks/useSolver"

import SimpleNumberField from "../NumberField"
import {
    verifyStartSquares as validateStartSquares,
    formToConfig,
    SettingsForm,
    getDefaultForm
} from "./settings-form"
import useDifficultyListener from "../../hooks/useDifficulty"

const toMsFormat = (ms: number) => {
    return Number(ms).toFixed(3) + " ms"
}

type ValidatedSettingsForm = {
    values: SettingsForm
    validStartSquares: boolean
    valid: boolean
}

const getFormDefault = (difficulty: DifficultyType) => {
    return {
        values: getDefaultForm(difficulty),
        validStartSquares: true,
        valid: true
    }
}

export default function SolverDashboard() {
    const [difficulty, setDifficulty] = useState<DifficultyType>()
    const [form, setForm] = useState<ValidatedSettingsForm>()

    const [update, setUpdate] = useState<SolverUpdate>()
    const [looping, setLooping] = useState(false)

    useDifficultyListener(
        (difficulty) => {
            setDifficulty(difficulty)
            setForm(getFormDefault(difficulty))
            setUpdate(undefined)
        },
        [setDifficulty, setForm, setUpdate]
    )

    const { createController, runState, stop } = useSolverController({
        looping
    })

    if (!(difficulty && form)) return null

    const controller = form.valid
        ? createController(formToConfig(form.values), difficulty, setUpdate)
        : undefined

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

    const onFormChange = (key: keyof SettingsForm) => {
        return (e: any) => {
            const values = {
                ...form.values,
                [key]: e.target.value
            }

            const { refreshRate, startDelay, solverDepth, startSquares } =
                values
            const validStartSquares = validateStartSquares(startSquares)
            const valid =
                validStartSquares &&
                ![refreshRate, startDelay, solverDepth].some((v) => v === "")

            setForm({
                values,
                validStartSquares,
                valid
            })
        }
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
                            <Tooltip
                                title="Reset"
                                onClick={() => controller?.reset()}
                            >
                                <Button
                                    size="medium"
                                    color="secondary"
                                    disabled={!controller}
                                >
                                    <RestartAlt />
                                </Button>
                            </Tooltip>
                            {runState === RunState.RUNNING ? (
                                <Tooltip title="pause">
                                    <Button
                                        size="medium"
                                        color="secondary"
                                        onClick={stop}
                                    >
                                        <Pause />
                                    </Button>
                                </Tooltip>
                            ) : (
                                <Tooltip title="start">
                                    <Button
                                        size="medium"
                                        color="secondary"
                                        onClick={() => controller?.start()}
                                        disabled={
                                            !controller ||
                                            runState !== RunState.IDLE
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
                                    onClick={() => controller?.step()}
                                    disabled={
                                        !controller ||
                                        runState !== RunState.IDLE
                                    }
                                >
                                    <Redo />
                                </Button>
                            </Tooltip>
                            <Tooltip
                                title="Loop"
                                onClick={() => setLooping(!looping)}
                            >
                                <Button size="medium" variant={looping ? "contained": "outlined"} color="secondary">
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
                                value={
                                    update ? toMsFormat(update.time.ocr) : "- "
                                }
                            />
                            <StatText
                                title="Solver Time"
                                value={
                                    update ? toMsFormat(update.time.csp) : "- "
                                }
                            />
                            <StatText
                                title="Sleep Time"
                                value={
                                    update
                                        ? toMsFormat(update.time.waiting)
                                        : "- "
                                }
                            />
                        </Stack>
                    </Stack>
                    <Stack direction="column" spacing={2}>
                        <SimpleNumberField
                            label="Refresh Rate"
                            value={form.values.refreshRate}
                            onChange={onFormChange("refreshRate")}
                            helperText={
                                Number(form.values.refreshRate) < 5
                                    ? "<5 ms refresh rate defaults to 5"
                                    : null
                            }
                            InputProps={{
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
                            value={form.values.startDelay}
                            onChange={onFormChange("startDelay")}
                            helperText={
                                Number(form.values.startDelay) < 1000
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
                            value={form.values.solverDepth}
                            onChange={onFormChange("solverDepth")}
                            InputProps={{
                                inputProps: {
                                    min: 1
                                }
                            }}
                            helperText={
                                Number(form.values.solverDepth) > 2
                                    ? "solver depth >2 may run slowly"
                                    : null
                            }
                        />
                        <SimpleInputField
                            id="start-squares"
                            type="text"
                            label="Start Squares"
                            value={form.values.startSquares}
                            onChange={onFormChange("startSquares")}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="start">
                                        &nbsp;[x,y]
                                    </InputAdornment>
                                )
                            }}
                            helperText={
                                form.validStartSquares
                                    ? null
                                    : "*must be JSON format [[x,y]...]"
                            }
                        />
                        <Button
                            size="small"
                            startIcon={<Loop />}
                            color="secondary"
                            onClick={() => setForm(getFormDefault(difficulty))}
                        >
                            default
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}
