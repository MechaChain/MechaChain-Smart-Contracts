## `MechaniumPresaleDistribution`





### `vestingStarted()`



Check if the vesting has started

### `vestingNotStarted()`



Check if the vesting has not started


### `constructor(contract IERC20 token_)` (public)



Contract constructor


### `allocateTokens(address to, uint256 amount) → bool` (public)

Allocate 'amount' token 'to' address




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





### `pendingTokensOf(address account) → uint256` (public)





### `unlockableTokens(address account) → uint256` (public)





### `hasVestingStarted() → bool` (public)





### `vestingStartingTime() → uint256` (external)





### `maxVestingStartingTime() → uint256` (external)






### `VestingStartingTimeChanged(uint256 vestingStartingTime)`

========================
         Events
========================



### `TransferUnsoldToPTEPool(uint256 amount)`





### `TransferToStakingPool(address account, uint256 amount)`







