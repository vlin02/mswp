import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import {
    AllInclusive,
    Help,
    Loop,
    Pause,
    Redo,
    RestartAlt,
} from "@mui/icons-material"
import {
    Button,
    ButtonGroup,
    InputAdornment,
    Stack,
    Tooltip,
} from "@mui/material"
import { StatText } from "./StatText"
import SimpleTextField from "./SimpleTextField"
import { initBoard } from "@mswp/solver"
import { DifficultyInfo, DifficultyType } from "@mswp/solver"
import BoardState from "./BoardState"

export default function SolverInterface() {
    // const difficulty = useDifficulty()
    const {dim} = DifficultyInfo[DifficultyType.HARD]
    const board = initBoard(dim)

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
                            <Tooltip title="Reset">
                                <Button size="medium" color="secondary">
                                    <RestartAlt />
                                </Button>
                            </Tooltip>
                            <Tooltip title="Pause">
                                <Button size="medium" color="secondary">
                                    <Pause />
                                </Button>
                            </Tooltip>
                            <Tooltip title="Step">
                                <Button size="medium" color="secondary">
                                    <Redo />
                                </Button>
                            </Tooltip>
                            <Tooltip title="Loop">
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
                    <Stack direction="column" spacing={4} alignItems="center">
                        <Box width={250}>
                            <BoardState board={board} difficulty={DifficultyType.HARD} />
                            <StatText title="Iterations" value="27" />
                            <StatText title="OCR Time" value="23.764 ms" />
                            <StatText title="Solver Time" value="38.923 ms" />
                            <StatText title="Sleep Time" value="1234.56 ms" />
                        </Box>
                    </Stack>
                    <Stack direction="column" spacing={2}>
                        <SimpleTextField
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

                        <SimpleTextField
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
                        <SimpleTextField
                            id="solver-depth"
                            type="number"
                            label="Solver Depth"
                            InputProps={{
                                inputProps: {
                                    min: 1
                                }
                            }}
                        />
                        <SimpleTextField
                            id="start-squares"
                            type="text"
                            label="Start Squares"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="start">
                                        &nbsp;(x,y)
                                    </InputAdornment>
                                )
                            }}
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
