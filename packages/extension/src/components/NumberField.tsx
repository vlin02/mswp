import { TextFieldProps } from "@mui/material"
import SimpleInputField from "./SimpleInputField"

export default function SimpleNumberField(props: TextFieldProps) {
    return (
        <SimpleInputField
            onKeyDown={(e) => {
                if (
                    e.key === "e" ||
                    e.key === "E" ||
                    e.key === "-" ||
                    e.key === "+"
                ) {
                    e.preventDefault()
                }
            }}
            type="number"
            {...props}
        />
    )
}
