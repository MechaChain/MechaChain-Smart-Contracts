# `IMechaniumVesting`


Mechanim distribution smart contract interface


**Table of Contents**
- FUNCTIONS
    - [`allocateTokens`](#IMechaniumVesting-allocateTokens-address-uint256-)
    - [`claimTokens`](#IMechaniumVesting-claimTokens-address-)
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


## FUNCTIONS
### `allocateTokens(address to, uint256 amount) → bool` (external)

Allocate an amount of tokens to an address ( only allocator role )
### `claimTokens(address account) → bool` (external)

Transfers the allocated tokens to an address ( once the distribution has started )
### `claimTokensForAll() → bool` (external)

Transfers the all the allocated tokens to the respective addresses ( once the distribution has started )
### `balanceOf(address account) → uint256` (external)

Get balance of allocated tokens of an address
### `allocatedTokensOf(address account) → uint256` (external)

Return the amount of allocated tokens for `account` from the beginning
### `pendingTokensOf(address account) → uint256` (external)

Get pending tokens of an account ( amont / time )
### `unlockableTokens(address account) → uint256` (external)

Get unlockable tokens of an address
### `releasedTokensOf(address account) → uint256` (external)

Get released tokens of an address
### `token() → address` (external)

Return the token IERC20
### `tokenBalance() → uint256` (external)

Return the total token hold by the contract
### `totalSupply() → uint256` (external)

Get total tokens supply
### `totalUnallocatedTokens() → uint256` (external)

Get total unallocated tokens
### `totalAllocatedTokens() → uint256` (external)

Return the total allocated tokens for all the addresses
### `totalReleasedTokens() → uint256` (external)

Return the total tokens that have been transferred among all the addresses
### `vestingPerClock() → uint256` (external)

Return the percentage of unlocked tokens per `vestingClockTime()` once the vesting schedule has started
### `vestingClockTime() → uint256` (external)

Return the number of seconds between two `vestingPerClock()`
### `isSoldOut() → bool` (external)

Return true if all tokens have been allocated




