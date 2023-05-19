import {
    RestartAlt,
    Pause,
    PlayArrow,
    Redo,
    AllInclusive
} from "@mui/icons-material"
import { Stack, ButtonGroup } from "@mui/material"
import ControllerButton from "./ControllerButton"
import React, { useCallback, useEffect, useState } from "react"
import {
    RunMode,
    Solver,
} from "../solver"

enum RunState {
    RUNNING,
    STEPPING,
    IDLE
}

type Props = {
    completionAck?: () => void
    createSolver?: () => Solver
}

type Session =
    | {
          state: RunState.RUNNING | RunState.STEPPING
          solver: Solver
      }
    | {
          state: RunState.IDLE
      }

export const ControllerButtons: React.FC<Props> = React.memo(
    ({ createSolver, completionAck }: Props) => {
        const [looping, setLooping] = useState(false)
        const [session, setSession] = useState<Session>({
            state: RunState.IDLE
        })

        useEffect(() => {
            if (!completionAck || session.state === RunState.IDLE) return
            completionAck()

            if (session.state === RunState.STEPPING || !looping) {
                setSession({state: RunState.IDLE})
                return
            }
    
            session.solver.refresh()
            session.solver.start(RunMode.RESET)
        }, [completionAck, session])

        const onStop = useCallback(() => {
            session.state !== RunState.IDLE && session.solver.stop()
            setSession({state: RunState.IDLE})
        }, [session])

        const onStart = useCallback((mode: RunMode) => {
            if (!createSolver) return

            session.state !== RunState.IDLE && session.solver.stop()
            const solver = createSolver()

            setSession({
                state:
                    mode === RunMode.STEP
                        ? RunState.STEPPING
                        : RunState.RUNNING,
                solver
            })

            solver.start(mode)
        }, [createSolver, session, setSession])

        return (
            <Stack direction="row" spacing={2}>
                <ButtonGroup variant="outlined">
                    <ControllerButton
                        title="Reset"
                        icon={<RestartAlt />}
                        onClick={() => onStart(RunMode.RESET)}
                        disabled={!createSolver}
                    />
                    {session.state === RunState.RUNNING ? (
                        <ControllerButton
                            title="Pause"
                            icon={<Pause />}
                            onClick={onStop}
                        />
                    ) : (
                        <ControllerButton
                            title="Resume"
                            icon={<PlayArrow />}
                            onClick={() => onStart(RunMode.START)}
                            disabled={
                                !createSolver || session.state !== RunState.IDLE
                            }
                        />
                    )}
                    <ControllerButton
                        title="Step"
                        icon={<Redo />}
                        onClick={() => onStart(RunMode.STEP)}
                        disabled={
                            !createSolver || session.state !== RunState.IDLE
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
        )
    }
)
