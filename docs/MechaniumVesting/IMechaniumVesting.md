# `IMechaniumVesting`
**Documentation of `MechaniumVesting/IMechaniumVesting.sol`.**



Mechanim distribution smart contract interface


## TABLE OF CONTENTS

- [Public Functions](#public-functions)
    - [`allocateTokens`](#IMechaniumVesting-allocateTokens-address-uint256-) 
    - [`claimTokens`](#IMechaniumVesting-claimTokens-address-) 
    - [`claimTokens`](#IMechaniumVesting-claimTokens--) 
    - [`claimTokensForAll`](#IMechaniumVesting-claimTokensForAll--) 
    - [`balanceOf`](#IMechaniumVesting-balanceOf-address-) 
    - [`allocatedTokensOf`](#IMechaniumVesting-allocatedTokensOf-address-) 
    - [`pendingTokensOf`](#IMechaniumVesting-pendingTokensOf-address-) 
    - [`unlockableTokens`](#IMechaniumVesting-unlockableTokens-address-) 
    - [`releasedTokensOf`](#IMechaniumVesting-releasedTokensOf-address-) 
    - [`token`](#IMechaniumVesting-token--) 
    - [`tokenBalance`](#IMechaniumVesting-tokenBalance--) 
    - [`totalSupply`](#IMechaniumVesting-totalSupply--) 
    - [`totalUnallocatedTokens`](#IMechaniumVesting-totalUnallocatedTokens--) 
    - [`totalAllocatedTokens`](#IMechaniumVesting-totalAllocatedTokens--) 
    - [`totalReleasedTokens`](#IMechaniumVesting-totalReleasedTokens--) 
    - [`vestingPerClock`](#IMechaniumVesting-vestingPerClock--) 
    - [`vestingClockTime`](#IMechaniumVesting-vestingClockTime--) 
    - [`isSoldOut`](#IMechaniumVesting-isSoldOut--) 

- [Internal Functions](#internal-functions)









## PUBLIC FUNCTIONS

### `allocateTokens(address to, uint256 amount) → bool` (external) <a name="IMechaniumVesting-allocateTokens-address-uint256-" id="IMechaniumVesting-allocateTokens-address-uint256-"></a>

Allocate an amount of tokens to an address ( only allocator role )



### `claimTokens(address account) → bool` (external) <a name="IMechaniumVesting-claimTokens-address-" id="IMechaniumVesting-claimTokens-address-"></a>

Transfers the allocated tokens to an address ( once the distribution has started )



### `claimTokens() → bool` (external) <a name="IMechaniumVesting-claimTokens--" id="IMechaniumVesting-claimTokens--"></a>

Transfers the allocated tokens to the sender ( once the distribution has started )



### `claimTokensForAll() → bool` (external) <a name="IMechaniumVesting-claimTokensForAll--" id="IMechaniumVesting-claimTokensForAll--"></a>

Transfers the all the allocated tokens to the respective addresses ( once the distribution has started and only by DEFAULT_ADMIN_ROLE)



### `balanceOf(address account) → uint256` (external) <a name="IMechaniumVesting-balanceOf-address-" id="IMechaniumVesting-balanceOf-address-"></a>

Get balance of allocated tokens of an address



### `allocatedTokensOf(address account) → uint256` (external) <a name="IMechaniumVesting-allocatedTokensOf-address-" id="IMechaniumVesting-allocatedTokensOf-address-"></a>

Return the amount of allocated tokens for `account` from the beginning



### `pendingTokensOf(address account) → uint256` (external) <a name="IMechaniumVesting-pendingTokensOf-address-" id="IMechaniumVesting-pendingTokensOf-address-"></a>

Get pending tokens of an account ( amont / time )



### `unlockableTokens(address account) → uint256` (external) <a name="IMechaniumVesting-unlockableTokens-address-" id="IMechaniumVesting-unlockableTokens-address-"></a>

Get unlockable tokens of an address



### `releasedTokensOf(address account) → uint256` (external) <a name="IMechaniumVesting-releasedTokensOf-address-" id="IMechaniumVesting-releasedTokensOf-address-"></a>

Get released tokens of an address



### `token() → address` (external) <a name="IMechaniumVesting-token--" id="IMechaniumVesting-token--"></a>

Return the token IERC20



### `tokenBalance() → uint256` (external) <a name="IMechaniumVesting-tokenBalance--" id="IMechaniumVesting-tokenBalance--"></a>

Return the total token hold by the contract



### `totalSupply() → uint256` (external) <a name="IMechaniumVesting-totalSupply--" id="IMechaniumVesting-totalSupply--"></a>

Get total tokens supply



### `totalUnallocatedTokens() → uint256` (external) <a name="IMechaniumVesting-totalUnallocatedTokens--" id="IMechaniumVesting-totalUnallocatedTokens--"></a>

Get total unallocated tokens



### `totalAllocatedTokens() → uint256` (external) <a name="IMechaniumVesting-totalAllocatedTokens--" id="IMechaniumVesting-totalAllocatedTokens--"></a>

Return the total allocated tokens for all the addresses



### `totalReleasedTokens() → uint256` (external) <a name="IMechaniumVesting-totalReleasedTokens--" id="IMechaniumVesting-totalReleasedTokens--"></a>

Return the total tokens that have been transferred among all the addresses



### `vestingPerClock() → uint256` (external) <a name="IMechaniumVesting-vestingPerClock--" id="IMechaniumVesting-vestingPerClock--"></a>

Return the percentage of unlocked tokens per `vestingClockTime()` once the vesting schedule has started



### `vestingClockTime() → uint256` (external) <a name="IMechaniumVesting-vestingClockTime--" id="IMechaniumVesting-vestingClockTime--"></a>

Return the number of seconds between two `vestingPerClock()`



### `isSoldOut() → bool` (external) <a name="IMechaniumVesting-isSoldOut--" id="IMechaniumVesting-isSoldOut--"></a>

Return true if all tokens have been allocated



## INTERNAL FUNCTIONS




