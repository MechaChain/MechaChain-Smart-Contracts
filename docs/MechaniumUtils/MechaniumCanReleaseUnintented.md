# `MechaniumCanReleaseUnintented`
MechaniumCanReleaseUnintented - Abstract class for util can release unintented tokens smart contract




**Table of Contents**
- [EVENTS](#events)
    - [`ReleaseUintentedTokens`](#MechaniumCanReleaseUnintented-ReleaseUintentedTokens-address-address-uint256-)

- [PUBLIC FUNCTIONS](#public-functions)
    - [`fallback`](#MechaniumCanReleaseUnintented-fallback--)
    - [`receive`](#MechaniumCanReleaseUnintented-receive--)
    - [`releaseUnintented`](#MechaniumCanReleaseUnintented-releaseUnintented-address-address-uint256-)

- [PRIVATE FUNCTIONS](#private-functions)
    - [`_addLockedToken`](#MechaniumCanReleaseUnintented-_addLockedToken-address-)





## EVENTS

### `ReleaseUintentedTokens(address token, address account, uint256 amount)` <span id="MechaniumCanReleaseUnintented-ReleaseUintentedTokens-address-address-uint256-"></span>
Event emitted when release unintented `amount` of `token` for `account` address



## PUBLIC FUNCTIONS

### `fallback()` (external) <span id="MechaniumCanReleaseUnintented-fallback--"></span>
fallback payable function ( used to receive ETH in tests )


### `receive()` (external) <span id="MechaniumCanReleaseUnintented-receive--"></span>
receive payable function ( used to receive ETH in tests )


### `releaseUnintented(address token, address account, uint256 amount) → bool` (public) <span id="MechaniumCanReleaseUnintented-releaseUnintented-address-address-uint256-"></span>
Release an `amount` of `token` to an `account`
This function is used to prevent unintented tokens that got sent to be stuck on the contract


- `token`: The address of the token contract (zero address for claiming native coins).

- `account`: The address of the tokens/coins receiver.

- `amount`: Amount to claim.

## PRIVATE FUNCTIONS
### `_addLockedToken(address token_)` (internal) <span id="MechaniumCanReleaseUnintented-_addLockedToken-address-"></span>
Add a locked `token_` ( can't be released )




