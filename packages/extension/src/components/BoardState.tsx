import { BasicBoardState } from "../solver"
import { useEffect, useMemo, useRef } from "react"
import { DifficultyInfo, DifficultyType, range } from "@mswp/solver"
import { Box } from "@mui/material"
import { stateToColor } from "../const"

type Props = {
    boardState: BasicBoardState
    difficulty: DifficultyType
    maxHeight: number
    maxWidth: number
}

export const BoardState: React.FC<Props> = ({
    difficulty,
    maxHeight,
    maxWidth,
    boardState
}) => {
    const ref = useRef<(HTMLDivElement | null)[][]>(
        range(20).map(() => range(24).map(() => null))
    )

    useEffect(() => {
        boardState.forEach((row, i) => {
            row.forEach((state, j) => {
                const cellRef = ref.current[i][j]
                if (cellRef == null) return
                const nxt = stateToColor[state]
                if (cellRef.style.backgroundColor === nxt) return
                cellRef.style.backgroundColor = nxt
            })
        })
    }, [boardState])

    const grid = useMemo(() => {
        const {
            dim: { h, w }
        } = DifficultyInfo[difficulty]

        const netSize = Math.min(
            Math.floor(maxHeight / h),
            Math.floor(maxWidth / w)
        )

        const size = Math.floor(netSize * 0.8)
        const margin = Math.floor(netSize * 0.1)

        const trueSize = size + margin * 2

        return (
            <Box position="relative" display="block" height={trueSize * h} width={trueSize * w}>
                {[...Array(h)].flatMap((_, i) => {
                    return [...Array(w)].map((_, j) => {
                        return (
                            <div
                                ref={(el) => {
                                    ref.current[i][j] = el
                                }}
                                key={i * w + j}
                                style={{
                                    height: size,
                                    width: size,
                                    margin,
                                    position: "absolute",
                                    top: trueSize * i,
                                    left: trueSize * j,
                                    backgroundColor: "white"
                                }}
                            />
                        )
                    })
                })}
            </Box>
        )
    }, [ref, difficulty])

    return grid
}
