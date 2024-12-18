"use client";

import Image from "next/image";
import * as QRCode from "qrcode";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { Alert, Grid2 as Grid, Snackbar, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants";
import { PaymentActions } from "./components/PaymentActions";
import { PaymentDetails } from "./components/PaymentDetails";
import { constructBitcoinURI } from "@/utils";

type Props = {
  onGetAddress: (address: string | null) => void;
  onGetAmount: (address: string | null) => void;
};
const SearchParamsGetter = ({ onGetAddress, onGetAmount }: Props) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const address = searchParams.get("address") || null;
    const amount = searchParams.get("amount") || null;

    onGetAddress(address);
    onGetAmount(amount);
  }, [searchParams, onGetAddress, onGetAmount]);

  return null;
};

export default function PaymentPage() {
  const [qrCodeSrc, setQrCodeSrc] = useState<string | null>(null);
  const router = useRouter();
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [address, setAddress] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | null>(null);

  const onSearchParamsGetAddress = useCallback(
    (address: string | null) => {
      setAddress(address);
    },
    [setAddress],
  );
  const onSearchParamsGetAmount = useCallback(
    (amount: string | null) => {
      setAmount(amount);
    },
    [setAmount],
  );

  const openSnackbar = useCallback(
    () => setIsSnackbarOpen(true),
    [setIsSnackbarOpen],
  );
  const closeSnackbar = useCallback(
    () => setIsSnackbarOpen(false),
    [setIsSnackbarOpen],
  );

  const onClickCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    openSnackbar();
  }, [openSnackbar]);

  const onClickViewStatus = useCallback(() => {
    router.push(ROUTES.WALLET);
  }, [router]);

  const bitcoinURI =
    address !== null && amount !== null
      ? constructBitcoinURI(address, amount)
      : null;

  useEffect(() => {
    if (bitcoinURI) {
      QRCode.toDataURL(bitcoinURI, (error, dataUrl) => {
        if (error) {
          console.error(error);
        } else {
          setQrCodeSrc(dataUrl);
        }
      });
    }
  }, [bitcoinURI]);

  const onClickAddress = useCallback(() => {
    if (address) {
      navigator.clipboard.writeText(address);
      openSnackbar();
    }
  }, [address, openSnackbar]);

  const onClickBitcoinURI = useCallback(() => {
    if (bitcoinURI) {
      navigator.clipboard.writeText(bitcoinURI);
      openSnackbar();
    }
  }, [bitcoinURI, openSnackbar]);

  return (
    <Grid container direction="column" padding={2}>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={closeSnackbar}
      >
        <Alert>Copied to clipboard</Alert>
      </Snackbar>

      <Suspense>
        <SearchParamsGetter
          onGetAddress={onSearchParamsGetAddress}
          onGetAmount={onSearchParamsGetAmount}
        />
      </Suspense>

      <Grid>
        <Typography variant="h4">Payment request</Typography>
      </Grid>
      {qrCodeSrc && (
        <Grid>
          <Image
            alt="QR code representing Bitcoin testnet receiving address"
            src={qrCodeSrc}
            width={256}
            height={256}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Grid>
      )}
      {address && amount && bitcoinURI && (
        <PaymentDetails
          address={address}
          amount={amount}
          bitcoinURI={bitcoinURI}
          onClickAddress={onClickAddress}
          onClickBitcoinURI={onClickBitcoinURI}
        />
      )}
      <PaymentActions
        onClickCopyLink={onClickCopyLink}
        onClickViewStatus={onClickViewStatus}
      />
    </Grid>
  );
}
