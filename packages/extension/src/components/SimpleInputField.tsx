import { TextField, TextFieldProps } from "@mui/material"

const SimpleInputField: React.FC<TextFieldProps> = (props) => {
    return (
        <TextField
            size="small"
            color="secondary"
            InputLabelProps={{
                shrink: true
            }}
            variant="standard"
            {...props}
        />
    )
}
export default SimpleInputField
