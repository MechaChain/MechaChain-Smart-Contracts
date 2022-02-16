# `MechaniumVestingWallet`
MechaniumVestingWallet - Hold $MECHA allocated for different operations with a vesting schedule




**Table of Contents**
- [EVENTS](#events)
    - [`TransferredTokens`](#MechaniumVestingWallet-TransferredTokens-address-address-uint256-)
    - [`SoldOut`](#MechaniumVestingWallet-SoldOut-uint256-)

- [PUBLIC FUNCTIONS](#public-functions)
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

- [PRIVATE FUNCTIONS](#private-functions)





## EVENTS

### `TransferredTokens(address caller, address to, uint256 amount)` <span id="MechaniumVestingWallet-TransferredTokens-address-address-uint256-"></span>
Event emitted when `caller` transferred `amount` unlock tokens for `to` address


### `SoldOut(uint256 totalAllocated)` <span id="MechaniumVestingWallet-SoldOut-uint256-"></span>
Event emitted when all tokens have been transferred



## PUBLIC FUNCTIONS

### `constructor(contract IERC20 token_, uint256 initialVesting_, uint256 vestingPerClock_, uint256 vestingClockTime_)` (public) <span id="MechaniumVestingWallet-constructor-contract-IERC20-uint256-uint256-uint256-"></span>

Contract constructor sets the configuration of the vesting schedule

- `token_`: Address of the ERC20 token contract, this address cannot be changed later

- `initialVesting_`: Percentage of unlocked tokens at the beginning of the vesting schedule

- `vestingPerClock_`: Percentage of unlocked tokens per _vestingClockTime once the vesting schedule has started

- `vestingClockTime_`: Number of seconds between two _vestingPerClock

### `transfer(address to, uint256 amount) → bool` (public) <span id="MechaniumVestingWallet-transfer-address-uint256-"></span>
Transfer `amount` unlocked tokens `to` address


### `unlockableTokens() → uint256` (public) <span id="MechaniumVestingWallet-unlockableTokens--"></span>

Return the number of tokens that can be unlock

### `token() → address` (public) <span id="MechaniumVestingWallet-token--"></span>

Return the token IERC20

### `tokenBalance() → uint256` (public) <span id="MechaniumVestingWallet-tokenBalance--"></span>

Return the total token hold by the contract

### `totalSupply() → uint256` (public) <span id="MechaniumVestingWallet-totalSupply--"></span>

Return the total supply of tokens

### `totalReleasedTokens() → uint256` (public) <span id="MechaniumVestingWallet-totalReleasedTokens--"></span>

Return the total tokens that have been transferred

### `vestingPerClock() → uint256` (public) <span id="MechaniumVestingWallet-vestingPerClock--"></span>

Return the percentage of unlocked tokens per `vestingClockTime()` once the vesting schedule has started

### `vestingClockTime() → uint256` (public) <span id="MechaniumVestingWallet-vestingClockTime--"></span>

Return the number of seconds between two `vestingPerClock()`

### `initialVesting() → uint256` (public) <span id="MechaniumVestingWallet-initialVesting--"></span>

Return the percentage of unlocked tokens at the beginning of the vesting schedule

### `startTime() → uint256` (public) <span id="MechaniumVestingWallet-startTime--"></span>

Return vesting schedule start time

## PRIVATE FUNCTIONS



