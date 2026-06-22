"use client";
import * as React from "react";
import "../app/globals.css";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
} from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Container
            maxWidth="md"
            style={{ paddingTop: 24, paddingBottom: 48 }}
          >
            {children}
          </Container>
        </ThemeProvider>
      </body>
    </html>
  );
}
