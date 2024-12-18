"use client";

import { useWalletState } from "@/context/WalletState";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Button,
  Grid2 as Grid,
  Snackbar,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";

const HIDDEN_MNEMONIC = "••••• ••••• ••••• ••••• ••••• ••••• ••••• •••••";

export const WalletInfo = () => {
  const { paymentAddress, mnemonic } = useWalletState();
  const [showMnemonic, setShowMnemonic] = useState(false);

  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);

  const openSnackbar = useCallback(
    () => setIsSnackbarOpen(true),
    [setIsSnackbarOpen],
  );

  const closeSnackbar = useCallback(
    () => setIsSnackbarOpen(false),
    [setIsSnackbarOpen],
  );

  const onClickAddress = useCallback(() => {
    if (paymentAddress) {
      navigator.clipboard.writeText(paymentAddress);
      openSnackbar();
    }
  }, [paymentAddress, openSnackbar]);

  return (
    <Grid
      container
      display="flex"
      flexDirection="column"
      justifyContent="start"
      spacing={3}
    >
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={closeSnackbar}
      >
        <Alert>Copied to clipboard</Alert>
      </Snackbar>
      <Grid container flexDirection="column" spacing={1}>
        <Grid>
          <Typography variant="h4">Receiving address</Typography>
        </Grid>
        <Grid>
          <Typography
            variant="body1"
            onClick={onClickAddress}
            sx={{
              cursor: "pointer",
              maxWidth: 200,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {paymentAddress}
          </Typography>
        </Grid>
      </Grid>
      <Grid container flexDirection="column" spacing={1}>
        <Grid container alignItems="center">
          <Grid>
            <Typography variant="h4">Seed phrase</Typography>
          </Grid>
          <Grid>
            <Button
              color="secondary"
              onClick={() => setShowMnemonic(!showMnemonic)}
              size="small"
              sx={{ minWidth: "auto" }}
            >
              {showMnemonic ? <VisibilityOff /> : <Visibility />}
            </Button>
          </Grid>
        </Grid>
        <Grid minHeight={60}>
          {showMnemonic ? (
            <Typography>{mnemonic}</Typography>
          ) : (
            <Typography fontWeight={800} fontSize={18}>
              {HIDDEN_MNEMONIC}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
