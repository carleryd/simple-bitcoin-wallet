import { Button, Grid2 as Grid } from "@mui/material";

type Props = {
  onClickCopyLink: () => void;
  onClickViewStatus: () => void;
};
export const PaymentActions = ({
  onClickCopyLink,
  onClickViewStatus,
}: Props) => (
  <Grid
    container
    justifyContent="space-around"
    width="100%"
    paddingTop={0.5}
    spacing={1}
  >
    <Grid>
      <Button
        color="primary"
        variant="contained"
        onClick={onClickCopyLink}
        sx={{ whiteSpace: "nowrap" }}
      >
        Copy link
      </Button>
    </Grid>
    <Grid>
      <Button
        color="primary"
        variant="contained"
        onClick={onClickViewStatus}
        sx={{ whiteSpace: "nowrap" }}
      >
        View status
      </Button>
    </Grid>
  </Grid>
);
