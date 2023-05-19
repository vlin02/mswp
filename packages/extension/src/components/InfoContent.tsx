import { DialogContent, Stack, Typography } from "@mui/material"
import { BasicSquareState } from "../solver"
import { Square } from "@mui/icons-material"
import { stateToColor } from "../const"

export const InfoContent: React.FC = () => {
    return (
        <DialogContent>
            <Stack spacing={2}>
                <Typography variant="h6">Board Legend</Typography>
                <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Square
                            style={{
                                color: stateToColor[BasicSquareState.UNREVEALED]
                            }}
                        />
                        <Typography>Unrevealed square</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Square
                            style={{
                                color: stateToColor[BasicSquareState.NUMBER]
                            }}
                        />
                        <Typography>Safe square</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Square
                            style={{
                                color: stateToColor[BasicSquareState.NUMBER_NEW]
                            }}
                        />
                        <Typography>New safe square</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Square
                            style={{
                                color: stateToColor[BasicSquareState.FLAGGED]
                            }}
                        />
                        <Typography>Bomb square</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Square
                            style={{
                                color: stateToColor[
                                    BasicSquareState.NUMBER_UNKNOWN
                                ]
                            }}
                        />
                        <Typography>Safe square - unknown number</Typography>
                    </Stack>
                </Stack>
            </Stack>
        </DialogContent>
    )
}
