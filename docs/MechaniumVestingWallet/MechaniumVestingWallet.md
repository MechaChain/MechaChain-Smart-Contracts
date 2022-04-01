# `MechaniumVestingWallet`
**Documentation of `MechaniumVestingWallet/MechaniumVestingWallet.sol`.**

MechaniumVestingWallet - Hold $MECHA allocated for different operations with a vesting schedule




## TABLE OF CONTENTS
- [Events](#events)
    - [`TransferredTokens`](#MechaniumVestingWallet-TransferredTokens-address-address-uint256-) 
    - [`SoldOut`](#MechaniumVestingWallet-SoldOut-uint256-) 
    - [`ReleaseUintentedTokens`](#MechaniumCanReleaseUnintented-ReleaseUintentedTokens-address-address-uint256-) (inherited)
    - [`RoleAdminChanged`](#IAccessControl-RoleAdminChanged-bytes32-bytes32-bytes32-) (inherited)
    - [`RoleGranted`](#IAccessControl-RoleGranted-bytes32-address-address-) (inherited)
    - [`RoleRevoked`](#IAccessControl-RoleRevoked-bytes32-address-address-) (inherited)

- [Public Functions](#public-functions)
    - [`constructor`](#MechaniumVestingWallet-constructor-contract-IERC20-uint256-uint256-uint256-) 
    - [`transfer`](#MechaniumVestingWallet-transfer-address-uint256-) 
    - [`unlockableTokens`](#MechaniumVestingWallet-unlockableTokens--) 
    - [`token`](#MechaniumVestingWallet-token--) 
    - [`tokenBalance`](#MechaniumVestingWallet-tokenBalance--) 
    - [`totalSupply`](#MechaniumVestingWallet-totalSupply--) 
    - [`totalReleasedTokens`](#MechaniumVestingWallet-totalReleasedTokens--) 
    - [`vestingPerClock`](#MechaniumVestingWallet-vestingPerClock--) 
    - [`vestingClockTime`](#MechaniumVestingWallet-vestingClockTime--) 
    - [`initialVesting`](#MechaniumVestingWallet-initialVesting--) 
    - [`startTime`](#MechaniumVestingWallet-startTime--) 
    - [`fallback`](#MechaniumCanReleaseUnintented-fallback--) (inherited)
    - [`receive`](#MechaniumCanReleaseUnintented-receive--) (inherited)
    - [`releaseUnintented`](#MechaniumCanReleaseUnintented-releaseUnintented-address-address-uint256-) (inherited)
    - [`supportsInterface`](#AccessControl-supportsInterface-bytes4-) (inherited)
    - [`hasRole`](#AccessControl-hasRole-bytes32-address-) (inherited)
    - [`getRoleAdmin`](#AccessControl-getRoleAdmin-bytes32-) (inherited)
    - [`grantRole`](#AccessControl-grantRole-bytes32-address-) (inherited)
    - [`revokeRole`](#AccessControl-revokeRole-bytes32-address-) (inherited)
    - [`renounceRole`](#AccessControl-renounceRole-bytes32-address-) (inherited)

- [Internal Functions](#internal-functions)
    - [`_addLockedToken`](#MechaniumCanReleaseUnintented-_addLockedToken-address-) (inherited)
    - [`_checkRole`](#AccessControl-_checkRole-bytes32-address-) (inherited)
    - [`_setupRole`](#AccessControl-_setupRole-bytes32-address-) (inherited)
    - [`_setRoleAdmin`](#AccessControl-_setRoleAdmin-bytes32-bytes32-) (inherited)
    - [`_grantRole`](#AccessControl-_grantRole-bytes32-address-) (inherited)
    - [`_revokeRole`](#AccessControl-_revokeRole-bytes32-address-) (inherited)
    - [`_msgSender`](#Context-_msgSender--) (inherited)
    - [`_msgData`](#Context-_msgData--) (inherited)



- [Modifiers](#modifiers)
    - [`onlyRole`](#AccessControl-onlyRole-bytes32-) (inherited)

- [Structs](#structs)
    - [`RoleData`](#AccessControl-RoleData) (inherited)



## EVENTS

### `TransferredTokens(address caller, address to, uint256 amount)`  <a name="MechaniumVestingWallet-TransferredTokens-address-address-uint256-" id="MechaniumVestingWallet-TransferredTokens-address-address-uint256-"></a>
Event emitted when `caller` transferred `amount` unlock tokens for `to` address





### `SoldOut(uint256 totalAllocated)`  <a name="MechaniumVestingWallet-SoldOut-uint256-" id="MechaniumVestingWallet-SoldOut-uint256-"></a>
Event emitted when all tokens have been transferred





### `ReleaseUintentedTokens(address token, address account, uint256 amount)` (inherited) <a name="MechaniumCanReleaseUnintented-ReleaseUintentedTokens-address-address-uint256-" id="MechaniumCanReleaseUnintented-ReleaseUintentedTokens-address-address-uint256-"></a>
Event emitted when release unintented `amount` of `token` for `account` address



_Inherited from `MechaniumUtils/MechaniumCanReleaseUnintented.sol`_.


### `RoleAdminChanged(bytes32 role, bytes32 previousAdminRole, bytes32 newAdminRole)` (inherited) <a name="IAccessControl-RoleAdminChanged-bytes32-bytes32-bytes32-" id="IAccessControl-RoleAdminChanged-bytes32-bytes32-bytes32-"></a>

Emitted when `newAdminRole` is set as ``role``'s admin role, replacing `previousAdminRole`
`DEFAULT_ADMIN_ROLE` is the starting admin for all roles, despite
{RoleAdminChanged} not being emitted signaling this.
_Available since v3.1._


_Inherited from `../@openzeppelin/contracts/access/IAccessControl.sol`_.


### `RoleGranted(bytes32 role, address account, address sender)` (inherited) <a name="IAccessControl-RoleGranted-bytes32-address-address-" id="IAccessControl-RoleGranted-bytes32-address-address-"></a>

Emitted when `account` is granted `role`.
`sender` is the account that originated the contract call, an admin role
bearer except when using {AccessControl-_setupRole}.


_Inherited from `../@openzeppelin/contracts/access/IAccessControl.sol`_.


### `RoleRevoked(bytes32 role, address account, address sender)` (inherited) <a name="IAccessControl-RoleRevoked-bytes32-address-address-" id="IAccessControl-RoleRevoked-bytes32-address-address-"></a>

Emitted when `account` is revoked `role`.
`sender` is the account that originated the contract call:
  - if using `revokeRole`, it is the admin role bearer
  - if using `renounceRole`, it is the role bearer (i.e. `account`)


_Inherited from `../@openzeppelin/contracts/access/IAccessControl.sol`_.



## PUBLIC FUNCTIONS

### `constructor(contract IERC20 token_, uint256 initialVesting_, uint256 vestingPerClock_, uint256 vestingClockTime_)` (public) <a name="MechaniumVestingWallet-constructor-contract-IERC20-uint256-uint256-uint256-" id="MechaniumVestingWallet-constructor-contract-IERC20-uint256-uint256-uint256-"></a>

Contract constructor sets the configuration of the vesting schedule


Parameters:
- `token_`: Address of the ERC20 token contract, this address cannot be changed later

- `initialVesting_`: Percentage of unlocked tokens at the beginning of the vesting schedule

- `vestingPerClock_`: Percentage of unlocked tokens per _vestingClockTime once the vesting schedule has started

- `vestingClockTime_`: Number of seconds between two _vestingPerClock



### `transfer(address to, uint256 amount) → bool` (public) <a name="MechaniumVestingWallet-transfer-address-uint256-" id="MechaniumVestingWallet-transfer-address-uint256-"></a>
Transfer `amount` unlocked tokens `to` address





### `unlockableTokens() → uint256` (public) <a name="MechaniumVestingWallet-unlockableTokens--" id="MechaniumVestingWallet-unlockableTokens--"></a>

Return the number of tokens that can be unlock




### `token() → address` (public) <a name="MechaniumVestingWallet-token--" id="MechaniumVestingWallet-token--"></a>

Return the token IERC20




### `tokenBalance() → uint256` (public) <a name="MechaniumVestingWallet-tokenBalance--" id="MechaniumVestingWallet-tokenBalance--"></a>

Return the total token hold by the contract




### `totalSupply() → uint256` (public) <a name="MechaniumVestingWallet-totalSupply--" id="MechaniumVestingWallet-totalSupply--"></a>

Return the total supply of tokens




### `totalReleasedTokens() → uint256` (public) <a name="MechaniumVestingWallet-totalReleasedTokens--" id="MechaniumVestingWallet-totalReleasedTokens--"></a>

Return the total tokens that have been transferred




### `vestingPerClock() → uint256` (public) <a name="MechaniumVestingWallet-vestingPerClock--" id="MechaniumVestingWallet-vestingPerClock--"></a>

Return the percentage of unlocked tokens per `vestingClockTime()` once the vesting schedule has started




### `vestingClockTime() → uint256` (public) <a name="MechaniumVestingWallet-vestingClockTime--" id="MechaniumVestingWallet-vestingClockTime--"></a>

Return the number of seconds between two `vestingPerClock()`




### `initialVesting() → uint256` (public) <a name="MechaniumVestingWallet-initialVesting--" id="MechaniumVestingWallet-initialVesting--"></a>

Return the percentage of unlocked tokens at the beginning of the vesting schedule




### `startTime() → uint256` (public) <a name="MechaniumVestingWallet-startTime--" id="MechaniumVestingWallet-startTime--"></a>

Return vesting schedule start time




### `fallback()` (external) (inherited)<a name="MechaniumCanReleaseUnintented-fallback--" id="MechaniumCanReleaseUnintented-fallback--"></a>
fallback payable function ( used to receive ETH in tests )



_Inherited from `MechaniumUtils/MechaniumCanReleaseUnintented.sol`_.


### `receive()` (external) (inherited)<a name="MechaniumCanReleaseUnintented-receive--" id="MechaniumCanReleaseUnintented-receive--"></a>
receive payable function ( used to receive ETH in tests )



_Inherited from `MechaniumUtils/MechaniumCanReleaseUnintented.sol`_.


### `releaseUnintented(address token, address account, uint256 amount) → bool` (public) (inherited)<a name="MechaniumCanReleaseUnintented-releaseUnintented-address-address-uint256-" id="MechaniumCanReleaseUnintented-releaseUnintented-address-address-uint256-"></a>
Release an `amount` of `token` to an `account`
This function is used to prevent unintented tokens that got sent to be stuck on the contract



Parameters:
- `token`: The address of the token contract (zero address for claiming native coins).

- `account`: The address of the tokens/coins receiver.

- `amount`: Amount to claim.

_Inherited from `MechaniumUtils/MechaniumCanReleaseUnintented.sol`_.


### `supportsInterface(bytes4 interfaceId) → bool` (public) (inherited)<a name="AccessControl-supportsInterface-bytes4-" id="AccessControl-supportsInterface-bytes4-"></a>

See {IERC165-supportsInterface}.


_Inherited from `../@openzeppelin/contracts/access/AccessControl.sol`_.


### `hasRole(bytes32 role, address account) → bool` (public) (inherited)<a name="AccessControl-hasRole-bytes32-address-" id="AccessControl-hasRole-bytes32-address-"></a>

Returns `true` if `account` has been granted `role`.


_Inherited from `../@openzeppelin/contracts/access/AccessControl.sol`_.


### `getRoleAdmin(bytes32 role) → bytes32` (public) (inherited)<a name="AccessControl-getRoleAdmin-bytes32-" id="AccessControl-getRoleAdmin-bytes32-"></a>

Returns the admin role that controls `role`. See {grantRole} and
{revokeRole}.
To change a role's admin, use {_setRoleAdmin}.


_Inherited from `../@openzeppelin/contracts/access/AccessControl.sol`_.


### `grantRole(bytes32 role, address account)` (public) (inherited)<a name="AccessControl-grantRole-bytes32-address-" id="AccessControl-grantRole-bytes32-address-"></a>

Grants `role` to `account`.
If `account` had not been already granted `role`, emits a {RoleGranted}
event.
Requirements:
- the caller must have ``role``'s admin role.


_Inherited from `../@openzeppelin/contracts/access/AccessControl.sol`_.


### `revokeRole(bytes32 role, address account)` (public) (inherited)<a name="AccessControl-revokeRole-bytes32-address-" id="AccessControl-revokeRole-bytes32-address-"></a>

Revokes `role` from `account`.
If `account` had been granted `role`, emits a {RoleRevoked} event.
Requirements:
- the caller must have ``role``'s admin role.


_Inherited from `../@openzeppelin/contracts/access/AccessControl.sol`_.


### `renounceRole(bytes32 role, address account)` (public) (inherited)<a name="AccessControl-renounceRole-bytes32-address-" id="AccessControl-renounceRole-bytes32-address-"></a>

Revokes `role` from the calling account.
Roles are often managed via {grantRole} and {revokeRole}: this function's
purpose is to provide a mechanism for accounts to lose their privileges
if they are compromised (such as when a trusted device is misplaced).
If the calling account had been revoked `role`, emits a {RoleRevoked}
event.
Requirements:
- the caller must be `account`.


_Inherited from `../@openzeppelin/contracts/access/AccessControl.sol`_.


## INTERNAL FUNCTIONS

### `_addLockedToken(address token_)` (internal) (inherited) <a name="MechaniumCanReleaseUnintented-_addLockedToken-address-" id="MechaniumCanReleaseUnintented-_addLockedToken-address-"></a>
Add a locked `token_` ( can't be released )



_Inherited from `MechaniumUtils/MechaniumCanReleaseUnintented.sol`_.


### `_checkRole(bytes32 role, address account)` (internal) (inherited) <a name="AccessControl-_checkRole-bytes32-address-" id="AccessControl-_checkRole-bytes32-address-"></a>

Revert with a standard message if `account` is missing `role`.
The format of the revert reason is given by the following regular expression:
 /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/


_Inherited from `../@openzeppelin/contracts/access/AccessControl.sol`_.


### `_setupRole(bytes32 role, address account)` (internal) (inherited) <a name="AccessControl-_setupRole-bytes32-address-" id="AccessControl-_setupRole-bytes32-address-"></a>

Grants `role` to `account`.
If `account` had not been already granted `role`, emits a {RoleGranted}
event. Note that unlike {grantRole}, this function doesn't perform any
checks on the calling account.
[WARNING]
====
This function should only be called from the constructor when setting
up the initial roles for the system.
Using this function in any other way is effectively circumventing the admin
system imposed by {AccessControl}.
====
NOTE: This function is deprecated in favor of {_grantRole}.


_Inherited from `../@openzeppelin/contracts/access/AccessControl.sol`_.


### `_setRoleAdmin(bytes32 role, bytes32 adminRole)` (internal) (inherited) <a name="AccessControl-_setRoleAdmin-bytes32-bytes32-" id="AccessControl-_setRoleAdmin-bytes32-bytes32-"></a>

Sets `adminRole` as ``role``'s admin role.
Emits a {RoleAdminChanged} event.


_Inherited from `../@openzeppelin/contracts/access/AccessControl.sol`_.


### `_grantRole(bytes32 role, address account)` (internal) (inherited) <a name="AccessControl-_grantRole-bytes32-address-" id="AccessControl-_grantRole-bytes32-address-"></a>

Grants `role` to `account`.
Internal function without access restriction.


_Inherited from `../@openzeppelin/contracts/access/AccessControl.sol`_.


### `_revokeRole(bytes32 role, address account)` (internal) (inherited) <a name="AccessControl-_revokeRole-bytes32-address-" id="AccessControl-_revokeRole-bytes32-address-"></a>

Revokes `role` from `account`.
Internal function without access restriction.


_Inherited from `../@openzeppelin/contracts/access/AccessControl.sol`_.


### `_msgSender() → address` (internal) (inherited) <a name="Context-_msgSender--" id="Context-_msgSender--"></a>




_Inherited from `../@openzeppelin/contracts/utils/Context.sol`_.


### `_msgData() → bytes` (internal) (inherited) <a name="Context-_msgData--" id="Context-_msgData--"></a>




_Inherited from `../@openzeppelin/contracts/utils/Context.sol`_.



## MODIFIERS

### `onlyRole(bytes32 role)` (inherited) <a name="AccessControl-onlyRole-bytes32-" id="AccessControl-onlyRole-bytes32-"></a>


Modifier that checks that an account has a specific role. Reverts
with a standardized message including the required role.
The format of the revert reason is given by the following regular expression:
 /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
_Available since v4.1._


_Inherited from `../@openzeppelin/contracts/access/AccessControl.sol`_.


## STRUCTS

### `RoleData` (inherited) <a name="AccessControl-RoleData" id="AccessControl-RoleData"></a>
- mapping(address => bool) members
- bytes32 adminRole

_Inherited from `../@openzeppelin/contracts/access/AccessControl.sol`_.


