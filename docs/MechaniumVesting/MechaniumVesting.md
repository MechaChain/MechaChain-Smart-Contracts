## `MechaniumVesting`





### `tokensAvailable(uint256 amount)`



Check if the contract has the amount of tokens to allocate



### `constructor(contract IERC20 token_, uint256 vestingPerClock, uint256 vestingClockTime)` (internal)



Contract constructor sets the configuration of the vesting schedule


### `allocateTokens(address to, uint256 amount) → bool` (public)

Allocate 'amount' token 'to' address




### `claimTokens(address account) → bool` (public)

Claim the account's token




### `claimTokensForAll() → bool` (public)

Claim all the accounts tokens



### `_releaseTokens(address to, uint256 amount)` (internal)

Send 'amount' token 'to' address


'amount' must imperatively be less or equal to the number of allocated tokens, throw an assert (loss of transaction fees)


### `_unlockTokensCalc(uint256 startTime, uint256 allocation) → uint256` (internal)





### `_pendingTokensCalc(uint256 startTime, uint256 allocation) → uint256` (internal)





### `balanceOf(address account) → uint256` (public)





### `allocatedTokensOf(address account) → uint256` (public)





### `pendingTokensOf(address account) → uint256` (public)





### `unlockableTokens(address account) → uint256` (public)





### `releasedTokensOf(address account) → uint256` (public)



Get released tokens of an address

### `token() → address` (public)





### `tokenBalance() → uint256` (public)





### `totalSupply() → uint256` (public)





### `totalUnallocatedTokens() → uint256` (public)





### `totalAllocatedTokens() → uint256` (public)





### `totalReleasedTokens() → uint256` (public)






### `AllocationAddition(address to, uint256 amount)`

========================
         Events
========================



### `DistributedTokens(address be, address to, uint256 amount)`





### `DistributedTokensToAll(address be, uint256 beneficiariesNb, uint256 tokensUnlockNb)`







