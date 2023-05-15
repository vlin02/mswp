import { Stack, Typography } from "@mui/material"

type Props = {
    title: string
    value: string
}
export const StatText: React.FC<Props> = ({title, value}) => {
    return (
        <Stack direction="row" spacing={1} justifyContent="space-between">
            <Typography color="secondary">{title}</Typography>
            <Typography color="secondary">{value}</Typography>
        </Stack>
    )
}
