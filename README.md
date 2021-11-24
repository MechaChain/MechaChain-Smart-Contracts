# MechaChain Smart Contracts
All smart contracts for the play to earn [MechaChain project](https://mechachain.io/en/)


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
>Official \$MECHA ERC20 for MechaChain play to earn project.
100 000 000 \$MECHA are preminted on deployment to the admin wallet.
Build with a simple ERC20 inheritance from [OpenZeppelin ERC20 lib](https://docs.openzeppelin.com/contracts/4.x/erc20).

[Mechanium.sol documentation](.\docs\Mechanium.md)

**Smart contract address**

Testnets
  - Goerli : [0x1Be3C27E55867d9Ccc55765BbA14F350F9323539](https://goerli.etherscan.io/address/0x1be3c27e55867d9ccc55765bba14f350f9323539)
  - Mumbal : ...

Mainnets
  - Polygon : ...
  - Etherium : ...

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
  - Mumbal : ...

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
  - Mumbal : ...

Mainnets
  - Polygon : ...

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
  - Mumbal : ...

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
  - Mumbal : ...

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
  - Mumbal : ...

Mainnets
  - Polygon : ...
