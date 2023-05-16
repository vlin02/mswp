import { useEffect, useState } from "react"
import { GameCompletition, OnUpdate, RunLevel, Solver, SolverConfig } from "../solver"
import { DifficultyType, Formats, pagePlatform } from "@mswp/solver"

export enum RunState {
    RUNNING,
    STEPPING,
    IDLE
}

type Props = {
    looping: boolean
}

export default function useSolverController({ looping }: Props) {
    const [runState, setRunState] = useState<RunState>(RunState.IDLE)
    const [active, setActive] = useState<Solver>()
    const [completion, setCompletion] = useState<GameCompletition>()

    useEffect(() => {
        if (completion === undefined) return
        setCompletion(undefined)

        if (!active) {
            throw Error("must have active")
        }

        if (runState === RunState.STEPPING || !looping) {
            setRunState(RunState.IDLE)
            return
        }

        active.refresh()
        active.start(RunLevel.RESET)
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

                const solver = new Solver(format, config, (update) => {
                    
                    if (update.completion !== GameCompletition.IN_PROGRESS) {
                        setCompletion(update.completion)
                    }

                    onUpdate(update)
                })

                setActive(solver)
                return solver
            }

            const step = () => {
                setRunState(RunState.STEPPING)

                const solver = newSolver()
                solver.start(RunLevel.STEP)
            }

            const start = () => {
                setRunState(RunState.RUNNING)

                const solver = newSolver()
                solver.start(RunLevel.START)
            }

            const reset = async () => {
                setRunState(RunState.RUNNING)

                const solver = newSolver()
                solver.start(RunLevel.RESET)
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
