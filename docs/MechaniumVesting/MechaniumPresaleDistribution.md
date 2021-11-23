## `MechaniumPresaleDistribution`





### `vestingStarted()`



Check if the vesting has started

### `vestingNotStarted()`



Check if the vesting has not started


### `constructor(contract IERC20 token_)` (public)



Contract constructor


### `allocateTokens(address to, uint256 amount) → bool` (public)

Allocate `amount` token `to` address




### `startVesting() → bool` (public)

Start the vesting immediately



### `startVesting(uint256 startTime) → bool` (public)

Set the vesting start time




### `setPTEPool(address ptePoolAddress) → bool` (public)

Set the play to earn pool address




### `transferUnsoldToPTEPool() → bool` (public)

Transfer unclaimed tokens to PTE pool



### `setStakingPool(address stakingPoolAddress) → bool` (public)

Set staking pool address




### `transferToStakingPool() → bool` (public)

Transfer tokens balance ( allocated but not claimed ) to the staking pool



### `allocatedTokensOf(address account) → uint256` (public)



Return the amount of allocated tokens for `account` from the beginning

### `pendingTokensOf(address account) → uint256` (public)



Return the amount of tokens that the `account` can unlock in real time

### `unlockableTokens(address account) → uint256` (public)



Return the amount of tokens that the `account` can unlock per month

### `hasVestingStarted() → bool` (public)



Return true if the vesting schedule has started

### `vestingStartingTime() → uint256` (public)



Return the starting time of the vesting schedule

### `maxVestingStartingTime() → uint256` (public)



Return the unchangeable maximum vesting starting time

### `getPTEPoolAddress() → address` (public)



Return the pte pool address

### `getStakingPoolAddress() → address` (public)



Return the staking pool address


### `VestingStartingTimeChanged(uint256 vestingStartingTime)`

Event emitted when the `vestingStartingTime` has changed



### `TransferUnsoldToPTEPool(uint256 amount)`

Event emitted when `amount` tokens has been transferred to the play to earn pool



### `TransferToStakingPool(address account, uint256 amount)`

Event emitted when `account` has transferred `amount` tokens to the staking pool





