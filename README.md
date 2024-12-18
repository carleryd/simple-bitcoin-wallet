## About

This project is a simple Bitcoin HD wallet built with [Next.js](https://nextjs.org), [TypeScript](https://www.typescriptlang.org/), [React](https://react.dev/), [MaterialUI](https://mui.com/material-ui/) and other smaller libraries such as [zod](https://zod.dev/) for validating request payloads.

The wallet utilises Bitcoin libraries [bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib) as well as libraries for the two Bitcoin Improvement Proposals (BIP) [bip39](https://github.com/bitcoinjs/bip39) for generating mnemonic phrases and addresses and [bip32](https://github.com/bitcoinjs/bip32) for deriving keys from the mnemonic phrases.

The future of this project is very unclear, but below are some improvements which should be made if it were to be developed further.

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

From there on the application should be pretty straight forward.

## Testing

Coming from the Cardano ecosystem, I was quite surprised by how difficult it was to get access to Testnet Bitcoin (tBTC) tokens. I've explored many faucet and found these to be the most reliable ones:

- https://bitcoinfaucet.uo1.net/send.php
- https://testnet.help/en/btcfaucet/testnet#log

However, neither give close to enough tBTC to perform transactions. Currently the Testnet require ~5,000 sats in transaction fee, and these faucet give out ~500 per hour. So the only feasible way I found to test was to enter the receiving address of the generated wallet address into the faucet and wait for the faucet to make the transaction.

You could attempt to run a node, however don't expect to get any rewards unless you have the correct hardware and configuration (I tried myself). Perhaps there are other ways, but it's clearly an issue in the ecosystem right now.

## Major caveats

- Only supports Bitcoin Testnet
- Wallet is not persisted between page reloads
- Can only receive tBTC, not send

## Future Improvements

### Feature improvements

#### Not generating a new wallet on each page refresh

We could go down two paths to solve this:

- Either we create a fully fledged wallet which would entail a user DB entity with login information. This would get quite complicated as we would also need to store the wallet private key in a way which is secure and not accessible by us. This means that it would have to be stored encrypted and only decrypted on the client side by a user's password.
- Look at options for integrating Bitcoin wallet extensions, and in that case this application no longer becomes a wallet but a wallet viewer.

#### Sending Bitcoin

Currently the wallet can only receive payments, a proper wallet should obviously be able to send payments as well.

#### Smaller improvements

- Displaying balance
- Importing wallet using seed phrase
- Access to more than one receiving address
- Mainnet support
- Don't make it so easy to view the seed phrase
- Support dark mode, which will probably require Theme to be a bit more structured

### Technical improvements

Some of the technical improvements that could be made are:

- Better handling of incoming transactions. Statuses for incoming transactions are fetched from the [Blockstream API](https://blockstream.info/), however no effort is done to check whether a transaction is only broadcasted to the network (i.e. unconfirmed) or whether it has been included in a block (and importantly how many blocks). This means:
  - The user must check the transaction status manually.
  - Transactions could fail to reach the network, and in such a case there is no retry logic in place to try to find it again.
- Explore request limitations on the Blockstream API.
- Fetching of historic transactions. This would not be feasible to do every time the user enters the wallet. We would need to consider some kind of caching mechanism on the backend.
- Better BTC amount validation. Currently only input fields are validated, but a request page can be created with invalid BTC amounts.
- Unit testing. Currently there are none, and some low hanging fruit is adding tests for functions validating BTC amounts.
- Make polling declarative. Currently the polling is done in a `useEffect` hook, but it would be better to have a custom hook for this.
- Structured logging on either the frontend or backend or both. Perhaps using [Sentry](https://sentry.io/welcome/) on the frontend is a good start.
