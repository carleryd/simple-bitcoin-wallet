import { useCallback, useEffect, useRef, useState } from "react";

import { getAddressTxs } from "@/app/actions";
import { useWalletState } from "@/context/WalletState";
import {
  Box,
  CircularProgress,
  Grid2 as Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { TransactionMonitor } from "./components/TransactionMonitor";

const ADDRESS_TXS_POLLING_INTERVAL = 10_000;

export const TransactionsMonitor = () => {
  const { paymentAddress } = useWalletState();
  const [txIdsToMonitor, setTxIdsToMonitor] = useState<string[]>([]);
  const [isFetchingAddressTxs, setIsFetchingAddressTxs] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchAddressTxs = useCallback(async () => {
    if (paymentAddress) {
      setIsFetchingAddressTxs(true);

      const txs = await getAddressTxs(paymentAddress);
      const txIds = txs.map((x) => x.txid);

      setIsFetchingAddressTxs(false);
      setTxIdsToMonitor(txIds);
    }
  }, [paymentAddress]);

  /**
   * Fetch transactions immediately on mount, and then start polling.
   */
  useEffect(() => {
    fetchAddressTxs();

    intervalRef.current = setInterval(() => {
      fetchAddressTxs();
    }, ADDRESS_TXS_POLLING_INTERVAL);
  }, [paymentAddress, fetchAddressTxs]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <Box>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid container>
          <Grid>
            <Typography variant="h4">Incoming Transactions</Typography>
          </Grid>
          <Grid>
            <Tooltip title="Transactions associated with your wallet address are fetched periodically. Incoming transactions will be displayed below as they are discovered on-chain.">
              <IconButton>
                <InfoOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container paddingRight={1}>
          <CircularProgress
            size={25}
            sx={{
              visibility: isFetchingAddressTxs ? "visible" : "hidden",
            }}
          />
        </Grid>
      </Grid>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Tx id
              </TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Explorer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {txIdsToMonitor.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              txIdsToMonitor.map((txId, index) => (
                <TransactionMonitor txId={txId} key={index} />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
