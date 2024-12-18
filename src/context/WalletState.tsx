"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import * as bip39 from "bip39";
import BIP32Factory, { BIP32Interface } from "bip32";
import * as ecc from "@bitcoin-js/tiny-secp256k1-asmjs";
import * as bitcoin from "bitcoinjs-lib";

const bip32 = BIP32Factory(ecc);

type WalletStateType = {
  createNewWallet: () => void;
  paymentAddress: string | null;
  mnemonic: string | null;
};

const WalletStateContext = createContext<WalletStateType | undefined>(
  undefined,
);

export const WalletStateProvider = ({ children }: { children: ReactNode }) => {
  const [paymentAddress, setPaymentAddress] = useState<string | null>(null);
  const [mnemonic, setMnemonic] = useState<string | null>(null);

  const createNewWallet = useCallback(() => {
    const mnemonic = bip39.generateMnemonic();

    const seed = bip39.mnemonicToSeedSync(mnemonic);

    const root: BIP32Interface = bip32.fromSeed(seed);

    // BIP-44 path: m / purpose' / coin_type' / account' / change / address_index
    // For Bitcoin Testnet: m/44'/1'/0'/0/0
    // For Bitcoin Mainnet: m/44'/0'/0'/0/0
    const path = "m/44'/1'/0'/0/0";
    const child: BIP32Interface = root.derivePath(path);

    const { address } = bitcoin.payments.p2wpkh({
      pubkey: Buffer.from(child.publicKey),
      network: bitcoin.networks.testnet,
    });

    setMnemonic(mnemonic);
    setPaymentAddress(address || null);
  }, [setPaymentAddress]);

  return (
    <WalletStateContext.Provider
      value={{ paymentAddress, mnemonic, createNewWallet }}
    >
      {children}
    </WalletStateContext.Provider>
  );
};

export const useWalletState = () => {
  const context = useContext(WalletStateContext);

  if (!context)
    throw new Error("useWalletState must be used within WalletStateProvider");

  return context;
};
