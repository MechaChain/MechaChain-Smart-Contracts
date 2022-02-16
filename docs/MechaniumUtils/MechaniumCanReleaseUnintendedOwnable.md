# `MechaniumCanReleaseUnintendedOwnable`
**Documentation of `MechaniumUtils/MechaniumCanReleaseUnintendedOwnable.sol`.**

MechaniumCanReleaseUnintendedOwnable - Abstract class for util can release unintended tokens smart contract




## TABLE OF CONTENTS
- [Events](#events)
    - [`ReleaseUintentedTokens`](#MechaniumCanReleaseUnintendedOwnable-ReleaseUintentedTokens-address-address-uint256-) 
    - [`OwnershipTransferred`](#Ownable-OwnershipTransferred-address-address-) (inherited)

- [Public Functions](#public-functions)
    - [`fallback`](#MechaniumCanReleaseUnintendedOwnable-fallback--) 
    - [`receive`](#MechaniumCanReleaseUnintendedOwnable-receive--) 
    - [`releaseUnintended`](#MechaniumCanReleaseUnintendedOwnable-releaseUnintended-address-address-uint256-) 
    - [`owner`](#Ownable-owner--) (inherited)
    - [`renounceOwnership`](#Ownable-renounceOwnership--) (inherited)
    - [`transferOwnership`](#Ownable-transferOwnership-address-) (inherited)

- [Internal Functions](#internal-functions)
    - [`_addLockedToken`](#MechaniumCanReleaseUnintendedOwnable-_addLockedToken-address-) 
    - [`constructor`](#Ownable-constructor--) (inherited)
    - [`_transferOwnership`](#Ownable-_transferOwnership-address-) (inherited)
    - [`_msgSender`](#Context-_msgSender--) (inherited)
    - [`_msgData`](#Context-_msgData--) (inherited)



- [Modifiers](#modifiers)
    - [`onlyOwner`](#Ownable-onlyOwner--) (inherited)




## EVENTS

### `ReleaseUintentedTokens(address token, address account, uint256 amount)`  <a name="MechaniumCanReleaseUnintendedOwnable-ReleaseUintentedTokens-address-address-uint256-" id="MechaniumCanReleaseUnintendedOwnable-ReleaseUintentedTokens-address-address-uint256-"></a>
Event emitted when release unintended `amount` of `token` for `account` address




### `OwnershipTransferred(address previousOwner, address newOwner)` (inherited) <a name="Ownable-OwnershipTransferred-address-address-" id="Ownable-OwnershipTransferred-address-address-"></a>



_Inherited from `../@openzeppelin/contracts/access/Ownable.sol`_.



## PUBLIC FUNCTIONS

### `fallback()` (external) <a name="MechaniumCanReleaseUnintendedOwnable-fallback--" id="MechaniumCanReleaseUnintendedOwnable-fallback--"></a>
fallback payable function ( used to receive ETH in tests )




### `receive()` (external) <a name="MechaniumCanReleaseUnintendedOwnable-receive--" id="MechaniumCanReleaseUnintendedOwnable-receive--"></a>
receive payable function ( used to receive ETH in tests )




### `releaseUnintended(address token, address account, uint256 amount) → bool` (public) <a name="MechaniumCanReleaseUnintendedOwnable-releaseUnintended-address-address-uint256-" id="MechaniumCanReleaseUnintendedOwnable-releaseUnintended-address-address-uint256-"></a>
Release an `amount` of `token` to an `account`
This function is used to prevent unintended tokens that got sent to be stuck on the contract


- `token`: The address of the token contract (zero address for claiming native coins).

- `account`: The address of the tokens/coins receiver.

- `amount`: Amount to claim.



### `owner() → address` (public) (inherited)<a name="Ownable-owner--" id="Ownable-owner--"></a>

Returns the address of the current owner.

_Inherited from `../@openzeppelin/contracts/access/Ownable.sol`_.


### `renounceOwnership()` (public) (inherited)<a name="Ownable-renounceOwnership--" id="Ownable-renounceOwnership--"></a>

Leaves the contract without owner. It will not be possible to call
`onlyOwner` functions anymore. Can only be called by the current owner.
NOTE: Renouncing ownership will leave the contract without an owner,
thereby removing any functionality that is only available to the owner.

_Inherited from `../@openzeppelin/contracts/access/Ownable.sol`_.


### `transferOwnership(address newOwner)` (public) (inherited)<a name="Ownable-transferOwnership-address-" id="Ownable-transferOwnership-address-"></a>

Transfers ownership of the contract to a new account (`newOwner`).
Can only be called by the current owner.

_Inherited from `../@openzeppelin/contracts/access/Ownable.sol`_.


## INTERNAL FUNCTIONS

### `_addLockedToken(address token_)` (internal)  <a name="MechaniumCanReleaseUnintendedOwnable-_addLockedToken-address-" id="MechaniumCanReleaseUnintendedOwnable-_addLockedToken-address-"></a>
Add a locked `token_` ( can't be released )




### `constructor()` (internal) (inherited) <a name="Ownable-constructor--" id="Ownable-constructor--"></a>

Initializes the contract setting the deployer as the initial owner.

_Inherited from `../@openzeppelin/contracts/access/Ownable.sol`_.


### `_transferOwnership(address newOwner)` (internal) (inherited) <a name="Ownable-_transferOwnership-address-" id="Ownable-_transferOwnership-address-"></a>

Transfers ownership of the contract to a new account (`newOwner`).
Internal function without access restriction.

_Inherited from `../@openzeppelin/contracts/access/Ownable.sol`_.


### `_msgSender() → address` (internal) (inherited) <a name="Context-_msgSender--" id="Context-_msgSender--"></a>



_Inherited from `../@openzeppelin/contracts/utils/Context.sol`_.


### `_msgData() → bytes` (internal) (inherited) <a name="Context-_msgData--" id="Context-_msgData--"></a>



_Inherited from `../@openzeppelin/contracts/utils/Context.sol`_.



## MODIFIERS

### `onlyOwner()` (inherited) <a name="Ownable-onlyOwner--" id="Ownable-onlyOwner--"></a>


Throws if called by any account other than the owner.

_Inherited from `../@openzeppelin/contracts/access/Ownable.sol`_.



