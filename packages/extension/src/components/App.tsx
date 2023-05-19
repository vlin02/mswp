import { ThemeProvider } from "@emotion/react"
import { Box, Button, Dialog, IconButton, Stack } from "@mui/material"
import { forwardRef, useEffect, useRef, useState } from "react"
import theme from "../theme"
import { Help } from "@mui/icons-material"
import { InfoContent } from "./InfoContent"
import SolverDashboard from "./SolverDashboard"

function App() {
    const [show, setShow] = useState(true)
    const [showHelp, setShowHelp] = useState(false)
    return (
        <ThemeProvider theme={theme}>
            {show ? (
                <Stack
                    direction="column"
                    style={{ backgroundColor: "#1e293b" }}
                    justifyContent="center"
                    position="relative"
                >
                    <Box position="absolute" right={8} top={8}>
                        <IconButton
                            size="medium"
                            color="secondary"
                            onClick={() => setShowHelp(true)}
                        >
                            <Help />
                        </IconButton>
                    </Box>
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
            <Dialog
                open={showHelp}
                onClose={() => setShowHelp(false)}
                fullWidth={true}
                maxWidth="sm"
            >
                <InfoContent />
            </Dialog>
        </ThemeProvider>
    )
}

export default App
