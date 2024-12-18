"use server";

import { z } from "zod";

/**
 * Based on schema source for Blockstream API responses:
 * https://github.com/Blockstream/esplora/blob/master/API.md
 */
const blockStreamTxStatusSchema = z.object({
  confirmed: z.boolean(),
  block_height: z.optional(z.number()),
  block_hash: z.optional(z.string()),
});

export type BlockStreamTxStatusResponse = z.infer<
  typeof blockStreamTxStatusSchema
>;

const blockStreamAddressTxsSchema = z.array(
  z.object({
    txid: z.string(),
    status: blockStreamTxStatusSchema,
  }),
);

export type BlockStreamAddressTxsResponse = z.infer<
  typeof blockStreamAddressTxsSchema
>;

export async function getAddressTxs(
  address: string,
): Promise<BlockStreamAddressTxsResponse> {
  const url = `https://blockstream.info/testnet/api/address/${address}/txs`;
  console.log("Fetching address transactions:", url);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch transaction status: ${response.statusText}`,
    );
  }

  const data = await response.json();

  const parsedResponse = blockStreamAddressTxsSchema.safeParse(data);

  if (!parsedResponse.success) {
    throw new Error(
      `Failed to parse address transactions: ${parsedResponse.error.message}`,
    );
  }

  return parsedResponse.data;
}

export async function getTxStatus(
  txHash: string,
): Promise<BlockStreamTxStatusResponse> {
  const url = `https://blockstream.info/testnet/api/tx/${txHash}/status`;
  console.log("Fetching transaction status:", url);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch transaction status: ${response.statusText}`,
    );
  }

  const data = await response.json();

  const parsedResponse = blockStreamTxStatusSchema.safeParse(data);

  if (!parsedResponse.success) {
    throw new Error(
      `Failed to parse transaction status: ${parsedResponse.error.message}`,
    );
  }

  return parsedResponse.data;
}
