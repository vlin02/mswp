import { Square } from "@mui/icons-material"
import { Stack } from "@mui/material"
import { BasicBoardState, BasicSquareState } from "../solver"

type Props = {
    boardState: BasicBoardState
    width: number
}

const stateToColor: { [key in BasicSquareState]: string } = {
    [BasicSquareState.UNREVEALED]: "white",
    [BasicSquareState.FLAGGED]: "#E24C1F",
    [BasicSquareState.NUMBER]: "#E0C3A2",
    [BasicSquareState.NUMBER_UNKNOWN]: "grey",
    [BasicSquareState.NUMBER_NEW]: "#B3D45F"
}

const BoardState: React.FC<Props> = ({ boardState, width }) => {
    return (
        <Stack direction="column" spacing={0}>
            {boardState.map((row, i) => {
                return (
                    <Stack direction="row" spacing={0} key={i}>
                        {row.map((state, j) => {
                            return (
                                <Square
                                    key={j}
                                    style={{
                                        color: stateToColor[state],
                                        fontSize: Math.floor(
                                            width / boardState[0].length
                                        )
                                    }}
                                />
                            )
                        })}
                    </Stack>
                )
            })}
        </Stack>
    )
}

export default BoardState
