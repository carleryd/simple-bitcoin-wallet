"use client";
import { WalletInfo } from "@/components/WalletInfo";
import { PaymentRequest } from "@/components/PaymentRequest";
import { TransactionsMonitor } from "@/components/TransactionMonitorList";
import { useWalletState } from "@/context/WalletState";
import { Grid2 as Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROUTES } from "@/constants";

export default function Wallet() {
  const { paymentAddress } = useWalletState();
  const router = useRouter();

  useEffect(() => {
    if (!paymentAddress) {
      router.push(ROUTES.ONBOARDING);
    }
  }, [paymentAddress, router]);

  return (
    <Grid container spacing={4}>
      <Grid
        container
        spacing={4}
        flexDirection={{ xs: "column", sm: "column", md: "row" }}
      >
        <Grid flex={1} alignSelf="start" padding={2}>
          <WalletInfo />
        </Grid>
        <Grid flex={1} alignSelf="start" padding={2}>
          {paymentAddress ? <PaymentRequest /> : null}
        </Grid>
      </Grid>
      <Grid width="100%" padding={2}>
        <TransactionsMonitor />
      </Grid>
    </Grid>
  );
}
