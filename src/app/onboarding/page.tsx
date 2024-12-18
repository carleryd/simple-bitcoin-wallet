"use client";
import { ROUTES } from "@/constants";
import { useWalletState } from "@/context/WalletState";
import { Grid2 as Grid, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function Onboarding() {
  const { createNewWallet } = useWalletState();
  const router = useRouter();

  const onClick = useCallback(() => {
    createNewWallet();
    router.push(ROUTES.WALLET);
  }, [router, createNewWallet]);

  return (
    <Grid
      container
      spacing={2}
      padding={2}
      direction="column"
      alignItems="center"
    >
      <Grid>
        <Typography variant="h4" alignSelf="center">
          Welcome, blockchain enthusiast!
        </Typography>
      </Grid>
      <Grid>
        <Typography>
          To begin your journey in the world of Bitcoin, you must first create a
          wallet.
        </Typography>
      </Grid>
      <Grid marginTop={2}>
        <Button color="info" size="large" variant="contained" onClick={onClick}>
          Lets go!
        </Button>
      </Grid>
    </Grid>
  );
}
