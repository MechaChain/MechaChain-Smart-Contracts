## `MechaniumVestingWallet`






### `constructor(contract IERC20 token_, uint256 initialVesting_, uint256 vestingPerClock_, uint256 vestingClockTime_)` (public)



Contract constructor sets the configuration of the vesting schedule


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


### `TransferredTokens(address caller, address to, uint256 amount)`

Event emitted when `caller` transferred `amount` unlock tokens for `to` address



### `SoldOut(uint256 totalAllocated)`

Event emitted when all tokens have been transferred





