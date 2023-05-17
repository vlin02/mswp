import { Stack, Typography } from "@mui/material"
import React from "react"

type Props = {
    title: string
    value: string
}

type Props1 = {
    children: string
}
export const StatText = React.memo(({ children }: Props1) => {
    return (
        <Typography color="secondary" fontSize="small">
            {children}
        </Typography>
    )
})

export const StatLine: React.FC<Props> = ({ title, value }) => {
    return (
        <Stack direction="row" spacing={0.5} justifyContent="space-between">
            <StatText>
                {title}
            </StatText>
            <StatText>
                {value}
            </StatText>
        </Stack>
    )
}
