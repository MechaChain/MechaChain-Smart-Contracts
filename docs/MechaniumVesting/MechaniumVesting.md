## `MechaniumVesting`





### `tokensAvailable(uint256 amount)`



Check if the contract has the amount of tokens to allocate



### `constructor(contract IERC20 token_, uint256 vestingPerClock, uint256 vestingClockTime)` (internal)



Contract constructor sets the configuration of the vesting schedule


### `allocateTokens(address to, uint256 amount) → bool` (public)

Allocate `amount` token `to` address




### `claimTokens(address account) → bool` (public)

Claim the account's token




### `claimTokensForAll() → bool` (public)

Claim all the accounts tokens



### `_releaseTokens(address to, uint256 amount)` (internal)

Send `amount` token `to` address


`amount` must imperatively be less or equal to the number of allocated tokens, throw an assert (loss of transaction fees)


### `_unlockTokensCalc(uint256 startTime, uint256 allocation) → uint256` (internal)



Return the number of tokens that can be unlock since startTime

### `_pendingTokensCalc(uint256 startTime, uint256 allocation) → uint256` (internal)



Return the number of tokens that can be unlock in real time since startTime

### `balanceOf(address account) → uint256` (public)



Return the amount of tokens locked for `account`

### `allocatedTokensOf(address account) → uint256` (public)



Return the amount of allocated tokens for `account` from the beginning

### `pendingTokensOf(address account) → uint256` (public)



Return the amount of tokens that the `account` can unlock in real time

### `unlockableTokens(address account) → uint256` (public)



Return the amount of tokens that the `account` can unlock per month

### `releasedTokensOf(address account) → uint256` (public)



Get released tokens of an address

### `token() → address` (public)



Return the token IERC20

### `tokenBalance() → uint256` (public)



Return the total token hold by the contract

### `totalSupply() → uint256` (public)



Return the total supply of tokens

### `totalUnallocatedTokens() → uint256` (public)



Return the total token unallocated by the contract

### `totalAllocatedTokens() → uint256` (public)



Return the total allocated tokens for all the addresses

### `totalReleasedTokens() → uint256` (public)



Return the total tokens that have been transferred among all the addresses


### `AllocationAddition(address to, uint256 amount)`



### `DistributedTokens(address be, address to, uint256 amount)`





### `DistributedTokensToAll(address be, uint256 beneficiariesNb, uint256 tokensUnlockNb)`







