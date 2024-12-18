import { useCallback, useEffect, useRef, useState } from "react";

import { BlockStreamTxStatusResponse, getTxStatus } from "@/app/actions";
import { Button, TableCell, TableRow } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { getTestnetExplorerTransactionUrl } from "@/utils";
import { remoteData, RemoteData } from "@/types";

const TX_STATUS_POLLING_INTERVAL = 10_000;

const TransactionStatus = ({
  txStatus,
}: {
  txStatus: RemoteData<BlockStreamTxStatusResponse>;
}) => {
  switch (txStatus.type) {
    case "NOT_ASKED":
      return "Waiting";
    case "PENDING":
      return "Fetching";
    case "SUCCESS":
      return "Confirmed";
    case "ERROR":
      return `Error: ${txStatus.error.message}`;
  }
};

export const TransactionMonitor = ({ txId }: { txId: string }) => {
  const [txStatus, setTxStatus] = useState<
    RemoteData<BlockStreamTxStatusResponse>
  >(remoteData.notAsked);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchTransactionStatus = useCallback(async () => {
    setTxStatus(remoteData.pending);

    try {
      const blockchainTxStatus = await getTxStatus(txId);

      setTxStatus(remoteData.success(blockchainTxStatus));
    } catch (requestError) {
      const error =
        requestError instanceof Error
          ? requestError
          : new Error("Unknown failure fetching transaction status");

      setTxStatus(remoteData.error(error));
    }
  }, [txId]);

  /**
   * Fetch status immediately on mount, and then start polling.
   */
  useEffect(() => {
    fetchTransactionStatus();

    intervalRef.current = setInterval(() => {
      fetchTransactionStatus();
    }, TX_STATUS_POLLING_INTERVAL);
  }, [fetchTransactionStatus]);

  useEffect(() => {
    /**
     * If transaction is successful, we see no reason to continue polling,
     * so we stop it by clearing the interval.
     */
    if (intervalRef.current && txStatus.type === "SUCCESS") {
      clearInterval(intervalRef.current);
    }
  }, [txStatus]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const openExplorer = useCallback(() => {
    window.open(getTestnetExplorerTransactionUrl(txId), "_blank");
  }, [txId]);

  return (
    <TableRow>
      <TableCell
        sx={{
          maxWidth: {
            xs: 40,
            sm: 60,
            md: 200,
          },
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {txId}
      </TableCell>
      {/**
        For some reason, these cells are taking up more space than needed when
        the component width shrinks, causing transaction id to be truncated at
        lower widths than necessary.
        Setting these widths to something tiny does not interfere with their
        complete rendering, and it does resolve the issue described.
      */}
      <TableCell align="right" width="1%" sx={{ whiteSpace: "nowrap" }}>
        <TransactionStatus txStatus={txStatus} />
      </TableCell>
      <TableCell align="right" width="1%">
        <Button onClick={openExplorer} sx={{ minWidth: "auto" }}>
          <OpenInNewIcon />
        </Button>
      </TableCell>
    </TableRow>
  );
};
