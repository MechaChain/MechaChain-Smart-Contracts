# `IMechaniumVesting`


Mechanim distribution smart contract interface


**Table of Contents**

- [PUBLIC FUNCTIONS](#public-functions)
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

- [PRIVATE FUNCTIONS](#private-functions)







## PUBLIC FUNCTIONS

### `allocateTokens(address to, uint256 amount) → bool` (external) <span id="IMechaniumVesting-allocateTokens-address-uint256-"></span>

Allocate an amount of tokens to an address ( only allocator role )

### `claimTokens(address account) → bool` (external) <span id="IMechaniumVesting-claimTokens-address-"></span>

Transfers the allocated tokens to an address ( once the distribution has started )

### `claimTokens() → bool` (external) <span id="IMechaniumVesting-claimTokens--"></span>

Transfers the allocated tokens to the sender ( once the distribution has started )

### `claimTokensForAll() → bool` (external) <span id="IMechaniumVesting-claimTokensForAll--"></span>

Transfers the all the allocated tokens to the respective addresses ( once the distribution has started and only by DEFAULT_ADMIN_ROLE)

### `balanceOf(address account) → uint256` (external) <span id="IMechaniumVesting-balanceOf-address-"></span>

Get balance of allocated tokens of an address

### `allocatedTokensOf(address account) → uint256` (external) <span id="IMechaniumVesting-allocatedTokensOf-address-"></span>

Return the amount of allocated tokens for `account` from the beginning

### `pendingTokensOf(address account) → uint256` (external) <span id="IMechaniumVesting-pendingTokensOf-address-"></span>

Get pending tokens of an account ( amont / time )

### `unlockableTokens(address account) → uint256` (external) <span id="IMechaniumVesting-unlockableTokens-address-"></span>

Get unlockable tokens of an address

### `releasedTokensOf(address account) → uint256` (external) <span id="IMechaniumVesting-releasedTokensOf-address-"></span>

Get released tokens of an address

### `token() → address` (external) <span id="IMechaniumVesting-token--"></span>

Return the token IERC20

### `tokenBalance() → uint256` (external) <span id="IMechaniumVesting-tokenBalance--"></span>

Return the total token hold by the contract

### `totalSupply() → uint256` (external) <span id="IMechaniumVesting-totalSupply--"></span>

Get total tokens supply

### `totalUnallocatedTokens() → uint256` (external) <span id="IMechaniumVesting-totalUnallocatedTokens--"></span>

Get total unallocated tokens

### `totalAllocatedTokens() → uint256` (external) <span id="IMechaniumVesting-totalAllocatedTokens--"></span>

Return the total allocated tokens for all the addresses

### `totalReleasedTokens() → uint256` (external) <span id="IMechaniumVesting-totalReleasedTokens--"></span>

Return the total tokens that have been transferred among all the addresses

### `vestingPerClock() → uint256` (external) <span id="IMechaniumVesting-vestingPerClock--"></span>

Return the percentage of unlocked tokens per `vestingClockTime()` once the vesting schedule has started

### `vestingClockTime() → uint256` (external) <span id="IMechaniumVesting-vestingClockTime--"></span>

Return the number of seconds between two `vestingPerClock()`

### `isSoldOut() → bool` (external) <span id="IMechaniumVesting-isSoldOut--"></span>

Return true if all tokens have been allocated

## PRIVATE FUNCTIONS



