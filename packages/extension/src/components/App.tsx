import { ThemeProvider } from "@emotion/react"
import { Box, Button, Stack, Typography } from "@mui/material"
import { useState } from "react"
import theme from "../theme"
import SolverInterface from "./SolverInterface"

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
                    {/* <Box position="absolute" top={12} left={12}>
                        <Typography
                            variant="h5"
                            fontWeight={700}
                            fontStyle="italic"
                            style={{color: "white"}}
                        >
                            MSWP
                        </Typography>
                    </Box> */}
                    <SolverInterface />
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
