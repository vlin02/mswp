import { Board, DifficultyType } from "@mswp/solver"
import { Square } from "@mui/icons-material"
import { Stack } from "@mui/material"

type Props = {
    board: Board
    difficulty: DifficultyType
}

const DifficultyToSize = {
    [DifficultyType.EASY]: 20,
    [DifficultyType.MEDIUM]: 15,
    [DifficultyType.HARD]: 10
}

const BoardState: React.FC<Props> = ({ board, difficulty }) => {
    const fontSize = DifficultyToSize[difficulty]

    return (
        <Stack direction="column" spacing={0}>
            {board.map((row) => {
                return (
                    <Stack direction="row" spacing={0}>
                        {row.map(() => (
                            <Square
                                style={{
                                    color: "white",
                                    fontSize
                                }}
                            />
                        ))}
                    </Stack>
                )
            })}
        </Stack>
    )
}

export default BoardState
