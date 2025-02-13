"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    // Define a fonte padrão para o MUI
    // fontFamily: '"Teko", sans-serif',
    fontFamily: '"Orbitron", sans-serif',
  },
});

export default function ThemeProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
