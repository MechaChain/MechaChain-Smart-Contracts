# `MechaniumCanReleaseUnintendedOwnable`
MechaniumCanReleaseUnintendedOwnable - Abstract class for util can release unintended tokens smart contract




**Table of Contents**
- [EVENTS](#events)
    - [`ReleaseUintentedTokens`](#MechaniumCanReleaseUnintendedOwnable-ReleaseUintentedTokens-address-address-uint256-)

- [PUBLIC FUNCTIONS](#public-functions)
    - [`fallback`](#MechaniumCanReleaseUnintendedOwnable-fallback--)
    - [`receive`](#MechaniumCanReleaseUnintendedOwnable-receive--)
    - [`releaseUnintended`](#MechaniumCanReleaseUnintendedOwnable-releaseUnintended-address-address-uint256-)

- [PRIVATE FUNCTIONS](#private-functions)
    - [`_addLockedToken`](#MechaniumCanReleaseUnintendedOwnable-_addLockedToken-address-)





## EVENTS

### `ReleaseUintentedTokens(address token, address account, uint256 amount)` <span id="MechaniumCanReleaseUnintendedOwnable-ReleaseUintentedTokens-address-address-uint256-"></span>
Event emitted when release unintended `amount` of `token` for `account` address



## PUBLIC FUNCTIONS

### `fallback()` (external) <span id="MechaniumCanReleaseUnintendedOwnable-fallback--"></span>
fallback payable function ( used to receive ETH in tests )


### `receive()` (external) <span id="MechaniumCanReleaseUnintendedOwnable-receive--"></span>
receive payable function ( used to receive ETH in tests )


### `releaseUnintended(address token, address account, uint256 amount) → bool` (public) <span id="MechaniumCanReleaseUnintendedOwnable-releaseUnintended-address-address-uint256-"></span>
Release an `amount` of `token` to an `account`
This function is used to prevent unintended tokens that got sent to be stuck on the contract


- `token`: The address of the token contract (zero address for claiming native coins).

- `account`: The address of the tokens/coins receiver.

- `amount`: Amount to claim.

## PRIVATE FUNCTIONS
### `_addLockedToken(address token_)` (internal) <span id="MechaniumCanReleaseUnintendedOwnable-_addLockedToken-address-"></span>
Add a locked `token_` ( can't be released )




