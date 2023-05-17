import React from "react"
type Props = {
    size: number
    color: string
    i: number
    j: number
}

export const BoardSquare: React.FC<Props> = React.memo(({ color, size, i,j }) => {
    const s = Math.floor(size * 0.8)
    const m = Math.floor(size * 0.1)
    return (
        <div
            style={{
                position: "absolute",
                top: i* size,
                left: j* size,
                height: s,
                width: s,
                margin: m,
                backgroundColor: color
            }}
        />
    )
})
