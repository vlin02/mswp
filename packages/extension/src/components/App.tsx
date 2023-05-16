import { ThemeProvider } from "@emotion/react"
import { Box, Button, Stack } from "@mui/material"
import { useState } from "react"
import theme from "../theme"
import SolverDashboard from "./SolverDashboard"

function App() {
    const [show, setShow] = useState(true)
    return (
        <ThemeProvider theme={theme}>
            {show ? (
                <Stack
                    direction="column"
                    style={{ backgroundColor: "#1e293b" }}
                    justifyContent="center"
                    position="relative"
                >
                    <SolverDashboard />
                    <Box
                        position="absolute"
                        bottom={8}
                        right={8}
                        onClick={() => setShow(false)}
                    >
                        <Button>hide</Button>
                    </Box>
                </Stack>
            ) : (
                <Button style={{ zIndex: 1000 }} onClick={() => setShow(true)}>
                    show
                </Button>
            )}
        </ThemeProvider>
    )
}

export default App
