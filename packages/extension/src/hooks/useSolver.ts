import { useEffect, useState } from "react"
import { GameCompletition, OnUpdate, RunMode, Solver, SolverConfig } from "../solver"
import { DifficultyType, Formats, pagePlatform } from "@mswp/solver"

export enum RunState {
    RUNNING,
    STEPPING,
    IDLE
}

type Props = {
    completion: GameCompletition
    looping: boolean
}


export default function useSolverController({ completion, looping }: Props) {
    const [runState, setRunState] = useState<RunState>(RunState.IDLE)
    const [active, setActive] = useState<Solver>()

    useEffect(() => {
        if (completion === undefined) return

        if (!active) {
            throw Error("must have active")
        }

        if (runState === RunState.STEPPING || !looping) {
            setRunState(RunState.IDLE)
            return
        }

        active.refresh()
        active.start(RunMode.RESET)
    }, [completion, active, runState, looping])

    const stop = () => {
        active?.stop()
        setRunState(RunState.IDLE)
    }

    return {
        createController: (
            config: SolverConfig,
            difficulty: DifficultyType,
            onUpdate: OnUpdate
        ) => {
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

            }

            const step = () => {
                setRunState(RunState.STEPPING)

                const solver = newSolver()
                solver.start(RunMode.STEP)
            }

            const start = () => {
                setRunState(RunState.RUNNING)

                const solver = newSolver()
                solver.start(RunMode.START)
            }

            const reset = async () => {
                setRunState(RunState.RUNNING)

                const solver = newSolver()
                solver.start(RunMode.RESET)
            }

            return {
                reset,
                start,
                step
            }
        },
        stop,
        runState
    }
}
