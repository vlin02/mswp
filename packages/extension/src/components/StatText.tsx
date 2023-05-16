import { Stack, Typography } from "@mui/material"

type Props = {
    title: string
    value: string
}
export const StatText: React.FC<Props> = ({title, value}) => {
    return (
        <Stack direction="row" spacing={.5} justifyContent="space-between">
            <Typography color="secondary" fontSize="small">{title}</Typography>
            <Typography color="secondary" fontSize="small">{value}</Typography>
        </Stack>
    )
}
