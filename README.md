# Pooled VELAS (pVLX) Frontend.

The newest UI for communicating with the pVLX smart contracts. 

To run the project against a local node you can use the [pvlx-contracts](https://github.com/symblox/pvlx-contracts). With those contracts you can bootstrap a local Buidler EVM instance with test data so that you can develop the app locally.

#### Setup

Install dependencies:

```bash
$ yarn
```

Make sure you have `direnv` installed and copy `.envrc.example` to `.envrc`:

```bash
$ cp .envrc.example .envrc
```

Fill in your own values for `.envrc`, then run:

```bash
$ direnv allow
```

To run the local server, run:

```
$ yarn dev
```
