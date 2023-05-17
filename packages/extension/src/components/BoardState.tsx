import { Square } from "@mui/icons-material"
import { Box, Stack } from "@mui/material"
import { BasicBoardState, BasicSquareState } from "../solver"
import { BoardSquare } from "./BoardSquare"

type Props = {
    boardState: BasicBoardState
    width: number
    height?: number
}

export const stateToColor: { [key in BasicSquareState]: string } = {
    [BasicSquareState.UNREVEALED]: "white",
    [BasicSquareState.FLAGGED]: "#E24C1F",
    [BasicSquareState.NUMBER]: "#E0C3A2",
    [BasicSquareState.NUMBER_UNKNOWN]: "grey",
    [BasicSquareState.NUMBER_NEW]: "#B3D45F"
}

const BoardState: React.FC<Props> = ({ boardState, width, height = 10000 }) => {
    const totalSize = Math.min(
        Math.floor(width / boardState[0].length),
        Math.floor(height / boardState.length)
    )

    return (
        <Box
            position="relative"
            display="block"
            height={totalSize * boardState.length}
            width={totalSize * boardState[0].length}
        >
            {boardState.flatMap((row, i) => {
                return row.map((state, j) => {
                    return (
                        <BoardSquare
                            key={i * 24 + j}
                            i={i}
                            j={j}
                            size={totalSize}
                            color={stateToColor[state]}
                        />
                    )
                })
            })}
        </Box>
    )
}

export default BoardState
