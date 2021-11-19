## `MechaniumTeamDistribution`

Can manage multiple allocations with a specific schedule to each




### `constructor(contract IERC20 token_, uint256 timeBeforeStarting, uint256 vestingPerClock, uint256 vestingClockTime)` (public)



Contract constructor sets the configuration of the vesting schedule


### `allocateTokens(address to, uint256 amount) → bool` (public)

Allocate 'amount' token 'to' address




### `allocatedTokensOf(address account) → uint256` (public)





### `pendingTokensOf(address account) → uint256` (public)





### `unlockableTokens(address account) → uint256` (public)





### `allocationCount() → uint256` (public)





### `allocationTokens(uint256 allocationId) → uint256` (public)





### `allocationOwner(uint256 allocationId) → address` (public)





### `allocationStartingTime(uint256 allocationId) → uint256` (public)





### `allocationsOf(address wallet) → uint256[]` (public)








