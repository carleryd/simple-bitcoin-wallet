import { useRouter } from "next/navigation";
import _ from "lodash";
import { useCallback, useState } from "react";
import { useWalletState } from "@/context/WalletState";
import { Button, Grid2 as Grid, TextField, Typography } from "@mui/material";
import { BITCOIN_DECIMAL_PRECISION } from "@/constants";
import { formatStringNumberWithDecimalPrecision } from "@/utils";

const generateBitcoinURI = (
  address: string,
  amount: number,
): URLSearchParams => {
  const params = new URLSearchParams();

  params.append("address", address);
  params.append("amount", amount.toString());

  return params;
};

export const PaymentRequest = () => {
  const [paymentAmountInput, setPaymentAmountInput] = useState<string>("");
  const router = useRouter();

  const { paymentAddress } = useWalletState();

  const handlePaymentDisplayAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;

    const numberAsString = value.replace(/[^0-9.]/g, "");

    if (_.isNumber(Number(numberAsString))) {
      const formatted = formatStringNumberWithDecimalPrecision(
        numberAsString,
        BITCOIN_DECIMAL_PRECISION,
      );

      setPaymentAmountInput(formatted);
    }
  };

  const onConfirmPaymentRequest = useCallback(() => {
    const paymentAmountBitcoin = parseFloat(paymentAmountInput);

    const bitcoinURI =
      paymentAddress && paymentAmountBitcoin
        ? generateBitcoinURI(paymentAddress, paymentAmountBitcoin)
        : null;

    if (bitcoinURI) {
      router.push(`/payment?${bitcoinURI.toString()}`);
    }
  }, [router, paymentAddress, paymentAmountInput]);

  return (
    <Grid container direction="column" spacing={3}>
      <Grid container spacing={1}>
        <Grid>
          <Typography variant="h4">Payment Request</Typography>
        </Grid>
        <Grid>
          <Typography>
            Enter an amount of tBTC which you would like to generate a QR code.
            You will then be able to share this with others.
          </Typography>
        </Grid>
      </Grid>
      <Grid container direction="row" alignItems="center" spacing={2}>
        <Grid>
          <TextField
            type="string"
            label="tBTC amount"
            size="medium"
            variant="standard"
            onChange={handlePaymentDisplayAmountChange}
            value={paymentAmountInput}
          />
        </Grid>
        <Grid>
          {paymentAddress ? (
            <Button
              variant="contained"
              size="large"
              onClick={() => onConfirmPaymentRequest()}
            >
              <Typography variant="button" color="white">
                generate
              </Typography>
            </Button>
          ) : (
            "No payment address available"
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
