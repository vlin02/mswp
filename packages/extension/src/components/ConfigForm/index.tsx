import { Loop } from "@mui/icons-material"
import { Stack, InputAdornment, Button } from "@mui/material"
import React from "react"
import SimpleNumberField from "../NumberField"
import SimpleInputField from "../SimpleInputField"
import { ConfigForm, ConfigInput, getConfigFormDefault } from "./form"


type Props = {
    form: ConfigForm
    onFormChange: (k: keyof ConfigInput) => (e: any) => void
    onDefault: () => void
}

export const ConfigFormView: React.FC<Props> = React.memo(({
    form,
    onFormChange,
    onDefault
}) => {
    return (
        <Stack direction="column" spacing={2}>
            <SimpleNumberField
                label="Refresh Rate"
                value={form.input.refreshRate}
                onChange={onFormChange("refreshRate")}
                helperText={
                    Number(form.input.refreshRate) < 5
                        ? "rate <5 ms defaults to 5 ms"
                        : null
                }
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">
                            &nbsp;ms
                        </InputAdornment>
                    )
                }}
            />
            <SimpleNumberField
                label="Start Delay"
                inputProps={{ type: "number" }}
                value={form.input.startDelay}
                onChange={onFormChange("startDelay")}
                helperText={
                    Number(form.input.startDelay) < 1000
                        ? "delay <1000 ms may be unstable"
                        : null
                }
                InputProps={{
                    inputProps: {
                        min: 0
                    },
                    endAdornment: (
                        <InputAdornment position="start">
                            &nbsp;ms
                        </InputAdornment>
                    )
                }}
            />
            <SimpleNumberField
                label="Solver Depth"
                value={form.input.solverDepth}
                onChange={onFormChange("solverDepth")}
                InputProps={{
                    inputProps: {
                        min: 1
                    }
                }}
                helperText={
                    Number(form.input.solverDepth) > 2
                        ? "depth 2 is usually sufficient"
                        : null
                }
            />
            <SimpleInputField
                id="start-squares"
                type="text"
                label="Start Squares"
                value={form.input.startSquares}
                onChange={onFormChange("startSquares")}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">
                            &nbsp;[x,y]
                        </InputAdornment>
                    )
                }}
                helperText={
                    form.validStartSquares
                        ? null
                        : "*must be JSON format [[x,y]...]"
                }
            />
            <Button
                size="small"
                startIcon={<Loop />}
                color="secondary"
                onClick={onDefault}
            >
                default
            </Button>
        </Stack>
    )
})
