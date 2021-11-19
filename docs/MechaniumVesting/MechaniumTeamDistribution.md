## `MechaniumTeamDistribution`

Can manage multiple allocations with a specific schedule to each




### `constructor(contract IERC20 token_, uint256 timeBeforeStarting, uint256 vestingPerClock, uint256 vestingClockTime)` (public)



Contract constructor sets the configuration of the vesting schedule


### `allocateTokens(address to, uint256 amount) → bool` (public)

Allocate `amount` token `to` address




### `allocatedTokensOf(address account) → uint256` (public)



Return the amount of allocated tokens for `account` from the beginning

### `pendingTokensOf(address account) → uint256` (public)



Return the amount of tokens that the `account` can unlock in real time

### `unlockableTokens(address account) → uint256` (public)



Return the amount of tokens that the `account` can unlock per month

### `allocationCount() → uint256` (public)



Return the amount of tokens of the allocation

### `allocationTokens(uint256 allocationId) → uint256` (public)



Return the amount of tokens of the allocation

### `allocationOwner(uint256 allocationId) → address` (public)



Return the address of the allocation owner

### `allocationStartingTime(uint256 allocationId) → uint256` (public)



Return the starting time of the allocation

### `allocationsOf(address wallet) → uint256[]` (public)



Return the array of allocationId owned by `wallet`




