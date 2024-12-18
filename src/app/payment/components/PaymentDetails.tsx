import { shortenString } from "@/utils";
import { Grid2 as Grid, Typography } from "@mui/material";

type Props = {
  onClickAddress: () => void;
  onClickBitcoinURI: () => void;
  address: string;
  amount: string;
  bitcoinURI: string;
};
export const PaymentDetails = ({
  onClickAddress,
  onClickBitcoinURI,
  address,
  amount,
  bitcoinURI,
}: Props) => (
  <Grid
    container
    padding={1.25}
    paddingTop={0}
    alignSelf="start"
    direction="column"
  >
    <Grid>
      <Typography variant="body1">
        <b>Amount:</b> {amount} tBTC
      </Typography>
    </Grid>
    <Grid>
      <Typography
        variant="body1"
        onClick={onClickAddress}
        sx={{ cursor: "pointer" }}
      >
        <b>Address:</b> {shortenString(address, 6, 6)}
      </Typography>
    </Grid>
    <Grid>
      <Typography
        variant="body1"
        onClick={onClickBitcoinURI}
        sx={{ cursor: "pointer" }}
      >
        <b>Bitcoin URI:</b> {shortenString(bitcoinURI, 10, 8)}
      </Typography>
    </Grid>
  </Grid>
);
