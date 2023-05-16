import { Tooltip, Button, ButtonProps } from "@mui/material"
import { ReactNode } from "react"

interface Props extends ButtonProps {
    title: string,
    icon: ReactNode
}
export default function ControllerButton({ title, icon, ...rest }: Props) {
    return (
        <Tooltip title={title} placement="top">
            <Button size="medium" color="secondary" {...rest}>
                {icon}
            </Button>
        </Tooltip>
    )
}
