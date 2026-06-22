"use client";

import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#14324a" },
    background: { default: "#eef2f5", paper: "#ffffff" },
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  shape: { borderRadius: 8 },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
