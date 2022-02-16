# `IMechaniumVestingWallet`


Mechanim vesting wallet smart contract interface


**Table of Contents**

- [PUBLIC FUNCTIONS](#public-functions)
    - [`transfer`](#IMechaniumVestingWallet-transfer-address-uint256-)
    - [`unlockableTokens`](#IMechaniumVestingWallet-unlockableTokens--)
    - [`token`](#IMechaniumVestingWallet-token--)
    - [`tokenBalance`](#IMechaniumVestingWallet-tokenBalance--)
    - [`totalSupply`](#IMechaniumVestingWallet-totalSupply--)
    - [`totalReleasedTokens`](#IMechaniumVestingWallet-totalReleasedTokens--)
    - [`vestingPerClock`](#IMechaniumVestingWallet-vestingPerClock--)
    - [`vestingClockTime`](#IMechaniumVestingWallet-vestingClockTime--)
    - [`initialVesting`](#IMechaniumVestingWallet-initialVesting--)
    - [`startTime`](#IMechaniumVestingWallet-startTime--)

- [PRIVATE FUNCTIONS](#private-functions)







## PUBLIC FUNCTIONS

### `transfer(address to, uint256 amount) → bool` (external) <span id="IMechaniumVestingWallet-transfer-address-uint256-"></span>
Transfer `amount` unlocked tokens `to` address


### `unlockableTokens() → uint256` (external) <span id="IMechaniumVestingWallet-unlockableTokens--"></span>

Return the number of tokens that can be unlock

### `token() → address` (external) <span id="IMechaniumVestingWallet-token--"></span>

Return the token IERC20

### `tokenBalance() → uint256` (external) <span id="IMechaniumVestingWallet-tokenBalance--"></span>

Return the total token hold by the contract

### `totalSupply() → uint256` (external) <span id="IMechaniumVestingWallet-totalSupply--"></span>

Get total tokens supply

### `totalReleasedTokens() → uint256` (external) <span id="IMechaniumVestingWallet-totalReleasedTokens--"></span>

Return the total tokens that have been transferred

### `vestingPerClock() → uint256` (external) <span id="IMechaniumVestingWallet-vestingPerClock--"></span>

Return the percentage of unlocked tokens per `vestingClockTime()` once the vesting schedule has started

### `vestingClockTime() → uint256` (external) <span id="IMechaniumVestingWallet-vestingClockTime--"></span>

Return the number of seconds between two `vestingPerClock()`

### `initialVesting() → uint256` (external) <span id="IMechaniumVestingWallet-initialVesting--"></span>

Return the percentage of unlocked tokens at the beginning of the vesting schedule

### `startTime() → uint256` (external) <span id="IMechaniumVestingWallet-startTime--"></span>

Return vesting schedule start time

## PRIVATE FUNCTIONS



