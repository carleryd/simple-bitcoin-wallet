"use client";
import { createTheme } from "@mui/material/styles";

const BITCOIN_ORANGE = "#ffa319";

const theme = createTheme({
  palette: {
    primary: {
      main: BITCOIN_ORANGE,
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#000000",
    },
    info: {
      main: BITCOIN_ORANGE,
      contrastText: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: "var(--font-roboto)",
  },
});

export default theme;
