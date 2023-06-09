import Box from "@mui/material/Box"
import { Stack } from "@mui/material"
import { StatLine } from "./StatLine"
import {
    DifficultyInfo,
    DifficultyType,
    Formats,
    pagePlatform,
    range
} from "@mswp/solver"
import { useCallback, useMemo, useState } from "react"
import {
    BasicSquareState,
    GameCompletition,
    Solver,
    SolverUpdate
} from "../solver"

import {
    validateStartSquares,
    inputToConfig,
    ConfigInput,
    ConfigForm,
    getConfigFormDefault
} from "./ConfigForm/form"
import useDifficultyListener from "../hooks/useDifficulty"
import { ConfigFormView } from "./ConfigForm"
import { ControllerButtons } from "./ControllerButtons"
import { BoardState } from "./BoardState"
import { INITIAL_DIFFICULTY } from "../const"

const toMsFormat = (ms: number) => {
    return `${ms.toFixed(3)} ms`
}

export default function SolverDashboard() {
    const [difficulty, setDifficulty] = useState<DifficultyType>(
        INITIAL_DIFFICULTY
    )
    const [form, setForm] = useState<ConfigForm>(
        getConfigFormDefault(DifficultyType.HARD)
    )

    const [update, setUpdate] = useState<SolverUpdate>()
    const [completionAck, setCompletionAck] = useState<() => void>()

    useDifficultyListener(
        (difficulty) => {
            setUpdate(undefined)
            setDifficulty(difficulty)
            setForm(getConfigFormDefault(difficulty))
        },
        [setDifficulty, setForm, setUpdate]
    )

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
    
    const onFormChange = useCallback(
        (key: keyof ConfigInput) => {
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
                    ![refreshRate, startDelay, solverDepth].some(
                        (v) => v === ""
                    )

                setForm({
                    input: values,
                    validStartSquares,
                    valid
                })
            }
        },
        [setForm]
    )

    const onDefaultForm = useCallback(
        () => setForm(getConfigFormDefault(difficulty)),
        [setForm, difficulty]
    )

    const createSolver = useMemo(() => {
        if (!form.valid) return undefined

        return () => {
            const format = Object.values(Formats).find((format) => {
                return (
                    format.difficulty === difficulty &&
                    format.platform === pagePlatform
                )
            })

            if (!format)
                throw Error(
                    `format not found for ${difficulty} + ${pagePlatform}`
                )

            return new Solver(format, inputToConfig(form.input), (update) => {
                setUpdate(update)

                if (update.completion !== GameCompletition.IN_PROGRESS) {
                    setCompletionAck(() => {
                        return () => setCompletionAck(undefined)
                    })
                }
            })
        }
    }, [difficulty, form])

    return (
        <Stack padding={3} direction="column" alignItems="center">
            <Stack
                direction="column"
                spacing={4}
                display="flex"
                alignItems="center"
            >
                <Stack direction="row" spacing={2}>
                    <ControllerButtons
                        createSolver={createSolver}
                        completionAck={completionAck}
                    />
                </Stack>
                <Stack direction="row" spacing={4}>
                    <Stack direction="column" spacing={4} width={250}>
                        <Box alignSelf="center">
                            <BoardState
                                difficulty={difficulty}
                                boardState={boardState}
                                maxHeight={
                                    difficulty === DifficultyType.EASY
                                        ? 150
                                        : 250
                                }
                                maxWidth={250}
                            />
                        </Box>
                        <Stack>
                            <StatLine
                                title="Iterations"
                                value={update ? String(update.iteration) : "-"}
                            />
                            <StatLine
                                title="OCR Time"
                                value={
                                    update ? toMsFormat(update.time.ocr) : "-"
                                }
                            />
                            <StatLine
                                title="Solver Time"
                                value={
                                    update ? toMsFormat(update.time.csp) : "-"
                                }
                            />
                            <StatLine
                                title="Wait Time"
                                value={
                                    update
                                        ? toMsFormat(update.time.waiting)
                                        : "-"
                                }
                            />
                            <StatLine
                                title="Status"
                                value={update?.completion ?? "-"}
                            />
                        </Stack>
                    </Stack>
                    <ConfigFormView
                        form={form}
                        onFormChange={onFormChange}
                        onDefault={onDefaultForm}
                    />
                </Stack>
            </Stack>
        </Stack>
    )
}
