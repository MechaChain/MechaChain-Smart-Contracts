# MechaChain Smart Contracts
All smart contracts for the play to earn [Mechachain project](https://mechachain.io/en/)


[![Ethereum Version][ethereum-image]][ethereum-url]
[![Solidity][solidity-image]][solidity-url]
[![Remix Version][remix-image]][remix-url]

<!-- Markdown link & img dfn's -->
[ethereum-image]: https://img.shields.io/badge/Ethereum-purple?logo=Ethereum
[ethereum-url]: https://ethereum.org/fr/
[remix-image]: https://img.shields.io/badge/Use_with_Remix_IDE-blue
[remix-url]: https://remix.ethereum.org/
[solidity-image]: https://img.shields.io/badge/Solidity_v0.8.7-gray?logo=Solidity
[solidity-url]: https://nodejs.org/uk/blog/release/v12.14.1/

- [MechaChain Smart Contracts](#mechachain-smart-contracts)
  - [Guidelines](#guidelines)
  - [HOW TO USE AND DEPLOY](#how-to-use-and-deploy)
    - [Use with Remix](#use-with-remix)
    - [Launch unit tests](#launch-unit-tests)
    - [Use on Testnets](#use-on-testnets)
    - [Generate doc](#generate-doc)
  - [SMART CONTRACTS](#smart-contracts)
    - [Mechanium.sol](#mechaniumsol)

## Guidelines

- Always keep the issues' status updated (in progress, testing, done)
- Reference at least one or more issues in every commit's message

## HOW TO USE AND DEPLOY 
### Use with Remix
  1. Install package : `npm install -g @remix-project/remixd`
  2. Provide a two-way connection between the local computer and Remix IDE :
  `remixd -s <absolute-path-to-the-shared-folder> --remix-ide https://remix.ethereum.org`
  3. Go to [Remix](https://remix.ethereum.org/) and select `localhost` Workspace

_For more informations : https://remix-ide.readthedocs.io/en/latest/remixd.html_

### Launch unit tests

For testing contract with [Truffle](https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript): 
  1. Install dependencies: `npm install -g truffle`
```
npm install -g truffle
npm install -g ganache-cli
npm install
```
  2. Run Ganache Ethereum simulator: `ganache-cli`
  3. Run test: `truffle test` or `truffle test ./test/<test_file_name>.js`
### Use on Testnets

Here are the different private keys of developer accounts on testnet

**Admin account**

Administrator of all smart contracts and keeps tokens
```
3851a32ae0f58665fcadb30cb9f66d96349b455554b8cd3a422c016888ae3e60
```

**Faucets for Goerli**

For get more eth on Goerli, use this link : https://app.mycrypto.com/faucet

**Faucets tokens for Mumbai or Goerli**

For get more tokens on Mumbai or Goerli, use this link : https://faucet.polygon.technology/

### Generate doc

To generate the markdown documentation, first install [solidity-docgen](https://github.com/OpenZeppelin/solidity-docgen) for solidity v0.8.2.

```
npm install -G solc-0.8@npm:solc@^0.8.2
```
Then, run : 

```
npx solidity-docgen --solc-module solc-0.8
```

## SMART CONTRACTS

### Mechanium.sol
A simple ERC20 inheritance of lib from [OpenZeppelin](https://docs.openzeppelin.com/contracts/4.x/erc20) 

**Features**
  - 100 000 000 premint tokens
  - No Burnable 
  - No mintable  

**Smart contract address**

Testnets
  - Goerli : [0x1Be3C27E55867d9Ccc55765BbA14F350F9323539](https://goerli.etherscan.io/address/0x1be3c27e55867d9ccc55765bba14f350f9323539)
  - Mumbal : ...

Mainnets
  - Polygon : ...
  - Etherium : ...