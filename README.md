# MechaChain Smart Contracts
All smart contracts for the play to earn [MechaChain project](https://mechachain.io/en/)


[![Ethereum Version][ethereum-image]][ethereum-url]
[![Solidity][solidity-image]][solidity-url]
[![Node Version][node-image]][node-url]

<!-- Markdown link & img dfn's -->
[ethereum-image]: https://img.shields.io/badge/Ethereum-purple?logo=Ethereum
[ethereum-url]: https://ethereum.org/fr/
[node-image]: https://img.shields.io/badge/node_v16-blue
[node-url]: https://nodejs.org/ko/blog/release/v16.13.0/
[solidity-image]: https://img.shields.io/badge/Solidity_v0.8.15-gray?logo=Solidity
[solidity-url]: https://nodejs.org/uk/blog/release/v12.14.1/

- [MechaChain Smart Contracts](#mechachain-smart-contracts)
  - [Guidelines](#guidelines)
  - [HOW TO USE AND DEPLOY](#how-to-use-and-deploy)
    - [Use with Remix](#use-with-remix)
    - [Deploy with Truffle](#deploy-with-truffle)
    - [Launch unit tests](#launch-unit-tests)
    - [Use on Testnets](#use-on-testnets)
    - [Generate docs](#generate-docs)
    - [Verify contract](#verify-contract)
    - [Generate typescript types definition](#generate-typescript-types-definition)
  - [SMART CONTRACTS](#smart-contracts)
    - [Mechanium.sol](#mechaniumsol)
    - [MechaniumVesting.sol](#mechaniumvestingsol)
    - [MechaniumPresaleDistribution.sol](#mechaniumpresaledistributionsol)
    - [MechaniumTeamDistribution.sol](#mechaniumteamdistributionsol)
    - [MechaniumFoundersDistribution.sol](#mechaniumfoundersdistributionsol)
    - [MechaniumAdvisorsDistribution.sol](#mechaniumadvisorsdistributionsol)
    - [MechaniumDevDistribution.sol](#mechaniumdevdistributionsol)
    - [MechaniumVestingWallet.sol](#mechaniumvestingwalletsol)
    - [MechaniumGrowthVestingWallet.sol](#mechaniumgrowthvestingwalletsol)

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

### Deploy with Truffle

- **With a private key or mnemonics**
First, please fill the `.env` file with `INFURA_PROJECT_ID` and, for testnets, `DEV_WALLET_PRIVATE_KEY`.

- **With a web3 browsers extension** _(Truffle >= v5.5)_
Run `truffle dashboard`, start the migration for `dashboard` network and go to _http://localhost:25012_. More informations [here](https://trufflesuite.com/blog/introducing-truffle-dashboard/).

```
truffle migrate --f <contractIndex> --to <contractIndex> --network <networkName>
```
- `--f <contractIndex>` is the first index of the migration file to run
- `--to <contractIndex>` is the last index of the migration file to run (can be the same as the previous one)
- `<networkName>` can be `development` _(local network)_, `matic`, `goerli`, `ropsten`, `mumbai`, `rinkeby` or `dashboard`.




### Launch unit tests

For testing contract with [Truffle](https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript): 
  1. Install dependencies:
```
npm install -g ganache-cli
npm install -g truffle
npm install
```
  2. Run Ganache Ethereum simulator: `npm run ganache`
  3. Run test: `truffle test` or `truffle test ./test/<test_file_name>.js`

For testing scaling on contract with [Truffle](https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript): 
  1. Run Ganache Ethereum simulator: `ganache-cli --accounts=502 -l 90000000000000`
  2. Run test: `truffle test ./scalingTest/<test_file_name>.js`
### Use on Testnets

Here are the different private keys of developer accounts on testnet

**Admin account**

Administrator of all smart contracts and keeps tokens - stored in internal tool

**Faucets for Goerli**

For get more eth on Goerli, use this link : https://app.mycrypto.com/faucet

**Faucets tokens for Mumbai or Goerli**

For get more tokens on Mumbai or Goerli, use this link : https://faucet.polygon.technology/

### Generate docs

To generate the markdown documentation, first install [solidity-docgen](https://github.com/OpenZeppelin/solidity-docgen) for solidity v0.8.2.

```
npm run generate-docs
```


### Verify contract

To verify contracts use either [Remix Etherscan Plugin](https://remix-etherscan-plugin.readthedocs.io/en/latest/) for Ethereum mainnet or [Truffle plugin verify](https://github.com/rkalis/truffle-plugin-verify) for other networks.


**Verify contract on polygonscan with Truffle**

  1. Configure `.env` with a `POLYGONSCAN_API_KEY` and `ETHERSCAN_API_KEY` which can be found here [found here](https://polygonscan.com/apis).
  2. Check that the compilers config used for the deployment is the same as registered in `truffle-config.js`
  3. Encode constructors arguments with a [ABI Encoding Service](https://abi.hashex.org/) if necessary
  4. Run the command
```
truffle run verify <contractName>@<contractAddress> --forceConstructorArgs string:<contractEncodedArguments > --network matic
```

### Generate typescript types definition
  1. `npm run build`
  2. `npm run generate-types`

## SMART CONTRACTS

### Mechanium.sol
>Official \$MECHA ERC20 for MechaChain play to earn project.
100 000 000 \$MECHA are preminted on deployment to the admin wallet.
Build with a simple ERC20 inheritance from [OpenZeppelin ERC20 lib](https://docs.openzeppelin.com/contracts/4.x/erc20).

[Mechanium.sol documentation](.\docs\Mechanium.md)

**Smart contract address**

Testnets
  - Goerli : [0x1Be3C27E55867d9Ccc55765BbA14F350F9323539](https://goerli.etherscan.io/address/0x1be3c27e55867d9ccc55765bba14f350f9323539)
  - Mumbai : [0x3dc6451e45dde42D3e376863F1ae4b24AFec5256](https://mumbai.polygonscan.com/address/0x3dc6451e45dde42D3e376863F1ae4b24AFec5256)

Mainnets
  - Polygon : [0xacd4e2d936be9b16c01848a3742a34b3d5a5bdfa](https://polygonscan.com/address/0xacd4e2d936be9b16c01848a3742a34b3d5a5bdfa)
  - Etherium : [0xc5bcc8ba3f33ab0d64f3473e861bdc0685b19ef5](https://etherscan.io/address/0xc5bcc8ba3f33ab0d64f3473e861bdc0685b19ef5)

### MechaniumVesting.sol
>Abstract class for vesting and distribution smart contract.
Set `vestingPerClock` and `vestingClockTime`

[MechaniumVesting.sol documentation](.\docs\MechaniumVesting\MechaniumVesting.md)

### MechaniumPresaleDistribution.sol
>Pre-sale distribution smart contract.
Distribute the tokens according to the lock & vesting schedule: 
>- Schedule start time determined by administrator or maximum 6 months _(180 days)_ after deployment
>- 20% once the schedule has started
>- then 20% every month _(30 days)_

_Inherit from [MechaniumVesting.sol](#MechaniumVesting)_

[MechaniumPresaleDistribution.sol documentation](.\docs\MechaniumVesting\MechaniumPresaleDistribution.md)

**Smart contract address**

Testnets
  - Mumbai : ...

Mainnets
  - Polygon : ...

### MechaniumTeamDistribution.sol
>Vesting and distribution smart contract for the MechaChain team.
Set `timeBeforeStarting`.

_Inherit from [MechaniumVesting.sol](#MechaniumVesting)_

[MechaniumTeamDistribution.sol documentation](.\docs\MechaniumVesting\MechaniumTeamDistribution.md)

### MechaniumFoundersDistribution.sol
>Vesting and distribution smart contract for the MechaChain founders.
Administrators have the right to whitdraw all tokens from the contract if the code fails the audit. If the contract is shifted secure, the whitdraw function is permanently blocked.
Distribute the tokens according to the lock & vesting schedule: 
>- 1 year after allocation _(360 days)_
>- unlock 20%
>- and repeat every 6 months _(180 days)_

_Inherit from [MechaniumTeamDistribution.sol](#MechaniumTeamDistribution)_

[MechaniumFoundersDistribution.sol documentation](.\docs\MechaniumVesting\MechaniumFoundersDistribution.md)

**Smart contract address**

Testnets
  - Mumbai : ...

Mainnets
  - Polygon : [0xc4e4154a56f8f7bf5fb783cde83d2d26f6b3cd87](https://polygonscan.com/address/0xc4e4154a56f8f7bf5fb783cde83d2d26f6b3cd87)

### MechaniumAdvisorsDistribution.sol
>Vesting and distribution smart contract for the MechaChain advisors.
Distribute the tokens according to the lock & vesting schedule: 
>- 6 months _(180 days)_ after allocation
>- unlock 20%
>- and repeat every 6 months _(180 days)_

_Inherit from [MechaniumTeamDistribution.sol](#MechaniumTeamDistribution)_

[MechaniumAdvisorsDistribution.sol documentation](.\docs\MechaniumVesting\MechaniumAdvisorsDistribution.md)

**Smart contract address**

Testnets
  - Mumbai : ...

Mainnets
  - Polygon : ...


### MechaniumDevDistribution.sol
>Vesting and distribution smart contract for the MechaChain development team.
Distribute the tokens according to the lock & vesting schedule: 
>- at the allocation
>- unlock 20%
>- and repeat every 3 months _(90 days)_

_Inherit from [MechaniumTeamDistribution.sol](#MechaniumTeamDistribution)_

[MechaniumDevDistribution.sol documentation](.\docs\MechaniumVesting\MechaniumDevDistribution.md)

**Smart contract address**

Testnets
  - Mumbai : ...

Mainnets
  - Polygon : ...


### MechaniumVestingWallet.sol
>Hold $MECHA allocated for different operations with a vesting schedule
Set `initialVesting`, `vestingPerClock` and `vestingClockTime`

[MechaniumVestingWallet.sol documentation](.\docs\MechaniumVestingWallet\MechaniumVestingWallet.md)

### MechaniumGrowthVestingWallet.sol
>Hold $MECHA allocated to the growth and marketing operations with the vesting schedule:
>- unlock 40% at deployment
>- then unlock 20% every 6 months _(180 days)_

_Inherit from [MechaniumVestingWallet.sol](#mechaniumvestingwalletsol)_

[MechaniumGrowthVestingWallet.sol documentation](.\docs\MechaniumVestingWallet\MechaniumGrowthVestingWallet.md)

**Smart contract address**

Testnets
  - Mumbai : ...

Mainnets
  - Polygon : ...
