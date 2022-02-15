# `MechaniumVestingWallet`
MechaniumVestingWallet - Hold $MECHA allocated for different operations with a vesting schedule




**Table of Contents**
- FUNCTIONS
    - [`constructor`](#MechaniumVestingWallet-constructor-contract-IERC20-uint256-uint256-uint256-)
    - [`transfer`](#MechaniumVestingWallet-transfer-address-uint256-)
    - [`unlockableTokens`](#MechaniumVestingWallet-unlockableTokens--)
    - [`token`](#MechaniumVestingWallet-token--)
    - [`tokenBalance`](#MechaniumVestingWallet-tokenBalance--)
    - [`totalSupply`](#MechaniumVestingWallet-totalSupply--)
    - [`totalReleasedTokens`](#MechaniumVestingWallet-totalReleasedTokens--)
    - [`vestingPerClock`](#MechaniumVestingWallet-vestingPerClock--)
    - [`vestingClockTime`](#MechaniumVestingWallet-vestingClockTime--)
    - [`initialVesting`](#MechaniumVestingWallet-initialVesting--)
    - [`startTime`](#MechaniumVestingWallet-startTime--)
- EVENTS
    - [`TransferredTokens`](#MechaniumVestingWallet-TransferredTokens-address-address-uint256-)
    - [`SoldOut`](#MechaniumVestingWallet-SoldOut-uint256-)


## FUNCTIONS
### `constructor(contract IERC20 token_, uint256 initialVesting_, uint256 vestingPerClock_, uint256 vestingClockTime_)` (public)

Contract constructor sets the configuration of the vesting schedule

- `token_`: Address of the ERC20 token contract, this address cannot be changed later

- `initialVesting_`: Percentage of unlocked tokens at the beginning of the vesting schedule

- `vestingPerClock_`: Percentage of unlocked tokens per _vestingClockTime once the vesting schedule has started

- `vestingClockTime_`: Number of seconds between two _vestingPerClock
### `transfer(address to, uint256 amount) → bool` (public)
Transfer `amount` unlocked tokens `to` address

### `unlockableTokens() → uint256` (public)

Return the number of tokens that can be unlock
### `token() → address` (public)

Return the token IERC20
### `tokenBalance() → uint256` (public)

Return the total token hold by the contract
### `totalSupply() → uint256` (public)

Return the total supply of tokens
### `totalReleasedTokens() → uint256` (public)

Return the total tokens that have been transferred
### `vestingPerClock() → uint256` (public)

Return the percentage of unlocked tokens per `vestingClockTime()` once the vesting schedule has started
### `vestingClockTime() → uint256` (public)

Return the number of seconds between two `vestingPerClock()`
### `initialVesting() → uint256` (public)

Return the percentage of unlocked tokens at the beginning of the vesting schedule
### `startTime() → uint256` (public)

Return vesting schedule start time

## EVENTS
### `TransferredTokens(address caller, address to, uint256 amount)`
Event emitted when `caller` transferred `amount` unlock tokens for `to` address

### `SoldOut(uint256 totalAllocated)`
Event emitted when all tokens have been transferred




