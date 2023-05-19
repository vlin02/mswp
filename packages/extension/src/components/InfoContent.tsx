import { DialogContent, List, ListItem, Stack, Typography } from "@mui/material"
import { BasicSquareState } from "../solver"
import {
    AllInclusive,
    PlayArrow,
    Replay,
    SkipNext,
    Square
} from "@mui/icons-material"
import { stateToColor } from "../const"

export const InfoContent: React.FC = () => {
    return (
        <DialogContent>
            <Stack spacing={2}>
                <Typography variant="h6">TAS Player Buttons</Typography>
                <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Replay />
                        <Typography variant="body2">
                            Start from new game
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <PlayArrow />
                        <Typography variant="body2">
                            Resume current game
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <SkipNext />
                        <Typography variant="body2">
                            Take step on current game
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <AllInclusive />
                        <Typography variant="body2">
                            Solve games in loop
                        </Typography>
                    </Stack>
                </Stack>
                <Typography variant="h6">Board Legend</Typography>
                <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Square
                            style={{
                                color: stateToColor[BasicSquareState.UNREVEALED]
                            }}
                        />
                        <Typography variant="body2">
                            Unrevealed square
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Square
                            style={{
                                color: stateToColor[BasicSquareState.NUMBER]
                            }}
                        />
                        <Typography variant="body2">Safe square</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Square
                            style={{
                                color: stateToColor[BasicSquareState.NUMBER_NEW]
                            }}
                        />
                        <Typography variant="body2">New safe square</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Square
                            style={{
                                color: stateToColor[BasicSquareState.FLAGGED]
                            }}
                        />
                        <Typography variant="body2">Bomb square</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Square
                            style={{
                                color: stateToColor[
                                    BasicSquareState.NUMBER_UNKNOWN
                                ]
                            }}
                        />
                        <Typography variant="body2">
                            Safe square - unknown number
                        </Typography>
                    </Stack>
                </Stack>
                <Stack>
                    <Typography variant="h6">The TAS made a mistake</Typography>
                    <List sx={{ listStyleType: "disc", pl: 4 }}>
                        <ListItem sx={{ display: "list-item", padding: "3px" }}>
                            <Typography variant="body2">
                                You clicke squares / changed difficulty while
                                the TAS is running.
                            </Typography>
                        </ListItem>
                        <ListItem sx={{ display: "list-item", padding: "3px" }}>
                            <Typography variant="body2">
                                The TAS occassionally misreads a number. May be
                                fixed later.
                            </Typography>
                        </ListItem>
                    </List>
                </Stack>
            </Stack>
        </DialogContent>
    )
}
