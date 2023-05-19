import { Stack, Typography } from "@mui/material"
import React, { useEffect, useMemo, useRef } from "react"

type StatLineProps = {
    title: string
    value: string
}

export const StatLine = React.memo(({ title, value }: StatLineProps) => {
    const ref = useRef<HTMLSpanElement | null>()

    useEffect(() => {
        if (ref.current == null) return
        ref.current.innerHTML = value
    }, [value])

    const node = useMemo(() => {
        return (
            <Stack direction="row" spacing={0.5} justifyContent="space-between">
                <Typography
                    color="secondary"
                    fontSize="small"
                >
                    {title}
                </Typography>
                <Typography
                    color="secondary"
                    fontSize="small"
                    ref={(el) => (ref.current = el)}
                >
                    {value}
                </Typography>
            </Stack>
        )
    }, [ref])

    return node
})
