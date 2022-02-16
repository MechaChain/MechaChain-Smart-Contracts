# `MechaniumVesting`
MechaniumVesting - Abstract class for vesting and distribution smart contract




**Table of Contents**
- [EVENTS](#events)
    - [`Allocated`](#MechaniumVesting-Allocated-address-uint256-)
    - [`ClaimedTokens`](#MechaniumVesting-ClaimedTokens-address-address-uint256-)
    - [`ClaimedTokensToAll`](#MechaniumVesting-ClaimedTokensToAll-address-uint256-uint256-)
    - [`SoldOut`](#MechaniumVesting-SoldOut-uint256-)
    - [`ReleasedLastTokens`](#MechaniumVesting-ReleasedLastTokens-uint256-)

- [PUBLIC FUNCTIONS](#public-functions)
    - [`allocateTokens`](#MechaniumVesting-allocateTokens-address-uint256-)
    - [`claimTokens`](#MechaniumVesting-claimTokens-address-)
    - [`claimTokens`](#MechaniumVesting-claimTokens--)
    - [`claimTokensForAll`](#MechaniumVesting-claimTokensForAll--)
    - [`balanceOf`](#MechaniumVesting-balanceOf-address-)
    - [`allocatedTokensOf`](#MechaniumVesting-allocatedTokensOf-address-)
    - [`pendingTokensOf`](#MechaniumVesting-pendingTokensOf-address-)
    - [`unlockableTokens`](#MechaniumVesting-unlockableTokens-address-)
    - [`releasedTokensOf`](#MechaniumVesting-releasedTokensOf-address-)
    - [`token`](#MechaniumVesting-token--)
    - [`tokenBalance`](#MechaniumVesting-tokenBalance--)
    - [`totalSupply`](#MechaniumVesting-totalSupply--)
    - [`totalUnallocatedTokens`](#MechaniumVesting-totalUnallocatedTokens--)
    - [`totalAllocatedTokens`](#MechaniumVesting-totalAllocatedTokens--)
    - [`totalReleasedTokens`](#MechaniumVesting-totalReleasedTokens--)
    - [`vestingPerClock`](#MechaniumVesting-vestingPerClock--)
    - [`vestingClockTime`](#MechaniumVesting-vestingClockTime--)
    - [`isSoldOut`](#MechaniumVesting-isSoldOut--)

- [PRIVATE FUNCTIONS](#private-functions)
    - [`constructor`](#MechaniumVesting-constructor-contract-IERC20-uint256-uint256-)
    - [`_releaseTokens`](#MechaniumVesting-_releaseTokens-address-uint256-)
    - [`_unlockTokensCalc`](#MechaniumVesting-_unlockTokensCalc-uint256-uint256-)
    - [`_pendingTokensCalc`](#MechaniumVesting-_pendingTokensCalc-uint256-uint256-)

- [MODIFIERS](#modifiers)
    - [`tokensAvailable`](#MechaniumVesting-tokensAvailable-uint256-)




## EVENTS

### `Allocated(address to, uint256 amount)` <span id="MechaniumVesting-Allocated-address-uint256-"></span>
Event emitted when `amount` tokens have been allocated for `to` address


### `ClaimedTokens(address caller, address to, uint256 amount)` <span id="MechaniumVesting-ClaimedTokens-address-address-uint256-"></span>
Event emitted when `caller` claimed `amount` tokens for `to` address


### `ClaimedTokensToAll(address caller, uint256 beneficiariesNb, uint256 tokensUnlockNb)` <span id="MechaniumVesting-ClaimedTokensToAll-address-uint256-uint256-"></span>
Event emitted when `caller` claimed the tokens for all beneficiary address


### `SoldOut(uint256 totalAllocated)` <span id="MechaniumVesting-SoldOut-uint256-"></span>
Event emitted when all tokens have been allocated


### `ReleasedLastTokens(uint256 totalReleased)` <span id="MechaniumVesting-ReleasedLastTokens-uint256-"></span>
Event emitted when the last tokens have been claimed



## PUBLIC FUNCTIONS

### `allocateTokens(address to, uint256 amount) → bool` (public) <span id="MechaniumVesting-allocateTokens-address-uint256-"></span>
Allocate `amount` token `to` address


- `to`: Address of the beneficiary

- `amount`: Total token to be allocated

### `claimTokens(address account) → bool` (public) <span id="MechaniumVesting-claimTokens-address-"></span>
Claim the account's token


- `account`: the account to claim tokens

### `claimTokens() → bool` (public) <span id="MechaniumVesting-claimTokens--"></span>
Claim the account's token


### `claimTokensForAll() → bool` (public) <span id="MechaniumVesting-claimTokensForAll--"></span>
Claim all the accounts tokens (Only by DEFAULT_ADMIN_ROLE)


### `balanceOf(address account) → uint256` (public) <span id="MechaniumVesting-balanceOf-address-"></span>

Return the amount of tokens locked for `account`

### `allocatedTokensOf(address account) → uint256` (public) <span id="MechaniumVesting-allocatedTokensOf-address-"></span>

Return the amount of allocated tokens for `account` from the beginning

### `pendingTokensOf(address account) → uint256` (public) <span id="MechaniumVesting-pendingTokensOf-address-"></span>

Return the amount of tokens that the `account` can unlock in real time

### `unlockableTokens(address account) → uint256` (public) <span id="MechaniumVesting-unlockableTokens-address-"></span>

Return the amount of tokens that the `account` can unlock per month

### `releasedTokensOf(address account) → uint256` (public) <span id="MechaniumVesting-releasedTokensOf-address-"></span>

Get released tokens of an address

### `token() → address` (public) <span id="MechaniumVesting-token--"></span>

Return the token IERC20

### `tokenBalance() → uint256` (public) <span id="MechaniumVesting-tokenBalance--"></span>

Return the total token hold by the contract

### `totalSupply() → uint256` (public) <span id="MechaniumVesting-totalSupply--"></span>

Return the total supply of tokens

### `totalUnallocatedTokens() → uint256` (public) <span id="MechaniumVesting-totalUnallocatedTokens--"></span>

Return the total token unallocated by the contract

### `totalAllocatedTokens() → uint256` (public) <span id="MechaniumVesting-totalAllocatedTokens--"></span>

Return the total allocated tokens for all the addresses

### `totalReleasedTokens() → uint256` (public) <span id="MechaniumVesting-totalReleasedTokens--"></span>

Return the total tokens that have been transferred among all the addresses

### `vestingPerClock() → uint256` (public) <span id="MechaniumVesting-vestingPerClock--"></span>

Return the percentage of unlocked tokens per `vestingClockTime()` once the vesting schedule has started

### `vestingClockTime() → uint256` (public) <span id="MechaniumVesting-vestingClockTime--"></span>

Return the number of seconds between two `vestingPerClock()`

### `isSoldOut() → bool` (public) <span id="MechaniumVesting-isSoldOut--"></span>

Return true if all tokens have been allocated

## PRIVATE FUNCTIONS
### `constructor(contract IERC20 token_, uint256 vestingPerClock_, uint256 vestingClockTime_)` (internal) <span id="MechaniumVesting-constructor-contract-IERC20-uint256-uint256-"></span>

Contract constructor sets the configuration of the vesting schedule

- `token_`: Address of the ERC20 token contract, this address cannot be changed later

- `vestingPerClock_`: Percentage of unlocked tokens per _vestingClockTime once the vesting schedule has started

- `vestingClockTime_`: Number of seconds between two _vestingPerClock
### `_releaseTokens(address to, uint256 amount)` (internal) <span id="MechaniumVesting-_releaseTokens-address-uint256-"></span>
Send `amount` token `to` address

`amount` must imperatively be less or equal to the number of allocated tokens, throw an assert (loss of transaction fees)

- `to`: Address of the beneficiary

- `amount`: Total token to send
### `_unlockTokensCalc(uint256 startTime, uint256 allocation) → uint256` (internal) <span id="MechaniumVesting-_unlockTokensCalc-uint256-uint256-"></span>

Return the number of tokens that can be unlock since startTime
### `_pendingTokensCalc(uint256 startTime, uint256 allocation) → uint256` (internal) <span id="MechaniumVesting-_pendingTokensCalc-uint256-uint256-"></span>

Return the number of tokens that can be unlock in real time since startTime

## MODIFIERS

### `tokensAvailable(uint256 amount)` <span id="MechaniumVesting-tokensAvailable-uint256-"></span>


Check if the contract has the amount of tokens to allocate

- `amount`: The amount of tokens to allocate


