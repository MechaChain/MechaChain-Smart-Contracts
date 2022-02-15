# `MechaniumCanReleaseUnintented`
MechaniumCanReleaseUnintented - Abstract class for util can release unintented tokens smart contract




**Table of Contents**
- FUNCTIONS
    - [`fallback`](#MechaniumCanReleaseUnintented-fallback--)
    - [`receive`](#MechaniumCanReleaseUnintented-receive--)
    - [`releaseUnintented`](#MechaniumCanReleaseUnintented-releaseUnintented-address-address-uint256-)
- EVENTS
    - [`ReleaseUintentedTokens`](#MechaniumCanReleaseUnintented-ReleaseUintentedTokens-address-address-uint256-)


## FUNCTIONS
### `fallback()` (external)
fallback payable function ( used to receive ETH in tests )

### `receive()` (external)
receive payable function ( used to receive ETH in tests )

### `_addLockedToken(address token_)` (internal)
Add a locked `token_` ( can't be released )

### `releaseUnintented(address token, address account, uint256 amount) → bool` (public)
Release an `amount` of `token` to an `account`
This function is used to prevent unintented tokens that got sent to be stuck on the contract


- `token`: The address of the token contract (zero address for claiming native coins).

- `account`: The address of the tokens/coins receiver.

- `amount`: Amount to claim.

## EVENTS
### `ReleaseUintentedTokens(address token, address account, uint256 amount)`
Event emitted when release unintented `amount` of `token` for `account` address




