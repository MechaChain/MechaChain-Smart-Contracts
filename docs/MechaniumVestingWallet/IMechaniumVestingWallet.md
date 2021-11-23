## `IMechaniumVestingWallet`



Mechanim vesting wallet smart contract interface


### `transfer(address to, uint256 amount) → bool` (external)

Transfer `amount` unlocked tokens `to` address



### `unlockableTokens() → uint256` (external)



Return the number of tokens that can be unlock

### `token() → address` (external)



Return the token IERC20

### `tokenBalance() → uint256` (external)



Return the total token hold by the contract

### `totalSupply() → uint256` (external)



Get total tokens supply

### `totalReleasedTokens() → uint256` (external)



Return the total tokens that have been transferred

### `vestingPerClock() → uint256` (external)



Return the percentage of unlocked tokens per `vestingClockTime()` once the vesting schedule has started

### `vestingClockTime() → uint256` (external)



Return the number of seconds between two `vestingPerClock()`

### `initialVesting() → uint256` (external)



Return the percentage of unlocked tokens at the beginning of the vesting schedule

### `startTime() → uint256` (external)



Return vesting schedule start time




