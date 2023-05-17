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
import { BasicSquareState, GameCompletition, SolverUpdate } from "../../solver"
import useSolverController, { RunState } from "../../hooks/useSolver"

import SimpleNumberField from "../NumberField"
import {
    verifyStartSquares as validateStartSquares,
    inputToConfig,
    ConfigInput,
    ConfigForm,
    getConfigFormDefault
} from "./form"
import useDifficultyListener from "../../hooks/useDifficulty"
import ControllerButton from "../ControllerButton"

const toMsFormat = (ms: number) => {
    return `${ms.toFixed(3)} ms`
}

export default function SolverDashboard() {
    const [difficulty, setDifficulty] = useState<DifficultyType>()
    const [form, setForm] = useState<ConfigForm>()

    const [update, setUpdate] = useState<SolverUpdate>()
    const [looping, setLooping] = useState(false)

    useDifficultyListener(
        (difficulty) => {
            setDifficulty(difficulty)
            setForm(getConfigFormDefault(difficulty))
            setUpdate(undefined)
        },
        [setDifficulty, setForm, setUpdate]
    )

    const { createController, runState, stop } = useSolverController({
        looping
    })

    if (!(difficulty && form)) return null

    const controller = form.valid
        ? createController(inputToConfig(form.input), difficulty, setUpdate)
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

    const onFormChange = (key: keyof ConfigInput) => {
        return (e: any) => {
            const values = {
                ...form.input,
                [key]: e.target.value
            }

            const { refreshRate, startDelay, solverDepth, startSquares } =
                values
            const validStartSquares = validateStartSquares(startSquares)
            const valid =
                validStartSquares &&
                ![refreshRate, startDelay, solverDepth].some((v) => v === "")

            setForm({
                input: values,
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
                            <ControllerButton
                                title="Reset"
                                icon={<RestartAlt />}
                                onClick={() => controller?.reset()}
                            />
                            {runState === RunState.RUNNING ? (
                                <ControllerButton
                                    title="Pause"
                                    icon={<Pause />}
                                    onClick={() => {
                                        stop()
                                        setUpdate((update) => {
                                            return update
                                                ? {
                                                      ...update,
                                                      completion:
                                                          GameCompletition.STOPPED
                                                  }
                                                : undefined
                                        })
                                    }}
                                />
                            ) : (
                                <ControllerButton
                                    title="Resume"
                                    icon={<PlayArrow />}
                                    onClick={() => controller?.start()}
                                    disabled={
                                        !controller ||
                                        runState !== RunState.IDLE
                                    }
                                />
                            )}
                            <ControllerButton
                                title="Step"
                                icon={<Redo />}
                                onClick={() => controller?.step()}
                                disabled={
                                    !controller || runState !== RunState.IDLE
                                }
                            />
                            <ControllerButton
                                title="Loop"
                                icon={<AllInclusive />}
                                variant={looping ? "contained" : "outlined"}
                                onClick={() => setLooping(!looping)}
                            />
                        </ButtonGroup>
                    </Stack>
                </Stack>
                <Stack direction="row" spacing={4}>
                    <Stack direction="column" spacing={4} width={250}>
                        <Box alignSelf="center">
                            <BoardState
                                boardState={boardState}
                                width={250}
                                height={
                                    difficulty === DifficultyType.EASY
                                        ? 175
                                        : undefined
                                }
                            />
                        </Box>
                        <Stack>
                            <StatText
                                title="Iterations"
                                value={update ? String(update.iteration) : "-"}
                            />
                            <StatText
                                title="OCR Time"
                                value={
                                    update ? toMsFormat(update.time.ocr) : "-"
                                }
                            />
                            <StatText
                                title="Solver Time"
                                value={
                                    update ? toMsFormat(update.time.csp) : "-"
                                }
                            />
                            <StatText
                                title="Wait Time"
                                value={
                                    update
                                        ? toMsFormat(update.time.waiting)
                                        : "-"
                                }
                            />
                            <StatText
                                title="Status"
                                value={update?.completion ?? "-"}
                            />
                        </Stack>
                    </Stack>
                    <Stack direction="column" spacing={2}>
                        <SimpleNumberField
                            label="Refresh Rate"
                            value={form.input.refreshRate}
                            onChange={onFormChange("refreshRate")}
                            helperText={
                                Number(form.input.refreshRate) < 5
                                    ? "rate <5 ms defaults to 5 ms"
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
                            value={form.input.startDelay}
                            onChange={onFormChange("startDelay")}
                            helperText={
                                Number(form.input.startDelay) < 1000
                                    ? "delay <1000 ms may be unstable"
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
                            value={form.input.solverDepth}
                            onChange={onFormChange("solverDepth")}
                            InputProps={{
                                inputProps: {
                                    min: 1
                                }
                            }}
                            helperText={
                                Number(form.input.solverDepth) > 2
                                    ? "depth 2 is usually sufficient"
                                    : null
                            }
                        />
                        <SimpleInputField
                            id="start-squares"
                            type="text"
                            label="Start Squares"
                            value={form.input.startSquares}
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
                            onClick={() =>
                                setForm(getConfigFormDefault(difficulty))
                            }
                        >
                            default
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}
