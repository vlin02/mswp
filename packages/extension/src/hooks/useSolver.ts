import { useEffect, useState } from "react"
import { OnUpdate, Solver, SolverConfig, SolverUpdate } from "../solver"
import { DifficultyType, Formats, pagePlatform, sleep } from "@mswp/solver"

export enum RunState {
    RUNNING,
    STEPPING,
    IDLE
}

type Props = {
    difficulty: DifficultyType
    config: SolverConfig
    onUpdate: OnUpdate
    looping: boolean
}
export default function useSolver({
    difficulty,
    config,
    onUpdate,
    looping
}: Props) {
    const [runState, setRunState] = useState<RunState>(RunState.IDLE)
    const [active, setActive] = useState<Solver | null>()

    const newSolver = () => {
        const format = Object.values(Formats).find((format) => {
            return (
                format.difficulty === difficulty &&
                format.platform === pagePlatform
            )
        })

        if (!format) {
            throw Error("format not found")
        }

        active?.stop()

        const solver = new Solver(format, config, (update) => {
            onUpdate(update)

            if (update.terminated) {
                setActive(null)
            }
        })

        setActive(solver)
        return solver
    }

    useEffect(() => {
        if (active !== null) return

        if (runState === RunState.STEPPING || !looping) {
            setRunState(RunState.IDLE)
            return
        }

        const solver = newSolver()
        solver.resetBoard()
        solver.start(false)

        setRunState(RunState.IDLE)
    }, [active, runState, looping])

    const step = () => {
        setRunState(RunState.STEPPING)

        const solver = newSolver()
        solver.start(true)
    }

    const start = () => {
        setRunState(RunState.RUNNING)

        const solver = newSolver()
        solver.start(false)
    }

    const stop = () => {
        active?.stop()
    }

    const reset = async () => {
        setRunState(RunState.RUNNING)

        const solver = newSolver()
        await solver.resetBoard()
        await sleep(100)
        solver.start(false)
    }

    return {
        reset,
        start,
        step,
        stop,
        runState
    }
}
