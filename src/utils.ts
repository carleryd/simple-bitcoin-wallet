export const shortenString = (
  address: string,
  takeStart: number,
  takeEnd: number,
): string => `${address.slice(0, takeStart)}...${address.slice(-takeEnd)}`;

export const getTestnetExplorerTransactionUrl = (transaction: string) =>
  `https://blockstream.info/testnet/tx/${transaction}`;

export const constructBitcoinURI = (
  address: string,
  amount: string | number,
  label?: string,
  message?: string,
) =>
  `bitcoin:${address}?amount=${amount}${label ? `&label=${label}` : ""}${
    message ? `&message=${message}` : ""
  }`;

export const formatStringNumberWithDecimalPrecision = (
  stringNumber: string,
  maxDecimals: number,
): string => {
  if (stringNumber.includes(".")) {
    const [integerPart, decimalPart] = stringNumber.split(".");

    const truncatedDecimal = decimalPart.slice(0, maxDecimals);

    return `${integerPart}.${truncatedDecimal}`;
  } else {
    return stringNumber;
  }
};
