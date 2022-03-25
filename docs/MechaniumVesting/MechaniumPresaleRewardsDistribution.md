# `MechaniumPresaleRewardsDistribution`
**Documentation of `MechaniumVesting/MechaniumPresaleRewardsDistribution.sol`.**

MechaniumPresaleRewardsDistribution - Pre-sale distribution smart contract




## TABLE OF CONTENTS
- [Events](#events)
    - [`VestingStartingTimeChanged`](#MechaniumPresaleRewardsDistribution-VestingStartingTimeChanged-uint256-) 
    - [`TransferUnsoldToPTEPool`](#MechaniumPresaleRewardsDistribution-TransferUnsoldToPTEPool-uint256-) 
    - [`TransferToStakingPool`](#MechaniumPresaleRewardsDistribution-TransferToStakingPool-address-uint256-uint256-) 
    - [`Allocated`](#MechaniumVesting-Allocated-address-uint256-) (inherited)
    - [`ClaimedTokens`](#MechaniumVesting-ClaimedTokens-address-address-uint256-) (inherited)
    - [`ClaimedTokensToAll`](#MechaniumVesting-ClaimedTokensToAll-address-uint256-uint256-) (inherited)
    - [`SoldOut`](#MechaniumVesting-SoldOut-uint256-) (inherited)
    - [`ReleasedLastTokens`](#MechaniumVesting-ReleasedLastTokens-uint256-) (inherited)
    - [`ReleaseUintentedTokens`](#MechaniumCanReleaseUnintented-ReleaseUintentedTokens-address-address-uint256-) (inherited)
    - [`RoleAdminChanged`](#IAccessControl-RoleAdminChanged-bytes32-bytes32-bytes32-) (inherited)
    - [`RoleGranted`](#IAccessControl-RoleGranted-bytes32-address-address-) (inherited)
    - [`RoleRevoked`](#IAccessControl-RoleRevoked-bytes32-address-address-) (inherited)

- [Public Functions](#public-functions)
    - [`constructor`](#MechaniumPresaleRewardsDistribution-constructor-contract-IERC20-) 
    - [`allocateTokens`](#MechaniumPresaleRewardsDistribution-allocateTokens-address-uint256-) 
    - [`startVesting`](#MechaniumPresaleRewardsDistribution-startVesting--) 
    - [`startVesting`](#MechaniumPresaleRewardsDistribution-startVesting-uint256-) 
    - [`setStakingPool`](#MechaniumPresaleRewardsDistribution-setStakingPool-address-) 
    - [`setStakingTransferTimeLimit`](#MechaniumPresaleRewardsDistribution-setStakingTransferTimeLimit-uint256-) 
    - [`setMinimumStakingTime`](#MechaniumPresaleRewardsDistribution-setMinimumStakingTime-uint256-) 
    - [`transferToStakingPool`](#MechaniumPresaleRewardsDistribution-transferToStakingPool-uint256-uint256-) 
    - [`allocatedTokensOf`](#MechaniumPresaleRewardsDistribution-allocatedTokensOf-address-) 
    - [`pendingTokensOf`](#MechaniumPresaleRewardsDistribution-pendingTokensOf-address-) 
    - [`unlockableTokens`](#MechaniumPresaleRewardsDistribution-unlockableTokens-address-) 
    - [`hasVestingStarted`](#MechaniumPresaleRewardsDistribution-hasVestingStarted--) 
    - [`vestingStartingTime`](#MechaniumPresaleRewardsDistribution-vestingStartingTime--) 
    - [`maxVestingStartingTime`](#MechaniumPresaleRewardsDistribution-maxVestingStartingTime--) 
    - [`getStakingPoolAddress`](#MechaniumPresaleRewardsDistribution-getStakingPoolAddress--) 
    - [`getStrakingTransferTimeLimit`](#MechaniumPresaleRewardsDistribution-getStrakingTransferTimeLimit--) 
    - [`getMinimumStakingTime`](#MechaniumPresaleRewardsDistribution-getMinimumStakingTime--) 
    - [`claimTokens`](#MechaniumVesting-claimTokens-address-) (inherited)
    - [`claimTokens`](#MechaniumVesting-claimTokens--) (inherited)
    - [`claimTokensForAll`](#MechaniumVesting-claimTokensForAll--) (inherited)
    - [`balanceOf`](#MechaniumVesting-balanceOf-address-) (inherited)
    - [`releasedTokensOf`](#MechaniumVesting-releasedTokensOf-address-) (inherited)
    - [`token`](#MechaniumVesting-token--) (inherited)
    - [`tokenBalance`](#MechaniumVesting-tokenBalance--) (inherited)
    - [`totalSupply`](#MechaniumVesting-totalSupply--) (inherited)
    - [`totalUnallocatedTokens`](#MechaniumVesting-totalUnallocatedTokens--) (inherited)
    - [`totalAllocatedTokens`](#MechaniumVesting-totalAllocatedTokens--) (inherited)
    - [`totalReleasedTokens`](#MechaniumVesting-totalReleasedTokens--) (inherited)
    - [`vestingPerClock`](#MechaniumVesting-vestingPerClock--) (inherited)
    - [`vestingClockTime`](#MechaniumVesting-vestingClockTime--) (inherited)
    - [`isSoldOut`](#MechaniumVesting-isSoldOut--) (inherited)
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
    - [`_releaseTokens`](#MechaniumVesting-_releaseTokens-address-uint256-) (inherited)
    - [`_unlockTokensCalc`](#MechaniumVesting-_unlockTokensCalc-uint256-uint256-) (inherited)
    - [`_pendingTokensCalc`](#MechaniumVesting-_pendingTokensCalc-uint256-uint256-) (inherited)
    - [`_addLockedToken`](#MechaniumCanReleaseUnintented-_addLockedToken-address-) (inherited)
    - [`_checkRole`](#AccessControl-_checkRole-bytes32-address-) (inherited)
    - [`_setupRole`](#AccessControl-_setupRole-bytes32-address-) (inherited)
    - [`_setRoleAdmin`](#AccessControl-_setRoleAdmin-bytes32-bytes32-) (inherited)
    - [`_grantRole`](#AccessControl-_grantRole-bytes32-address-) (inherited)
    - [`_revokeRole`](#AccessControl-_revokeRole-bytes32-address-) (inherited)
    - [`_msgSender`](#Context-_msgSender--) (inherited)
    - [`_msgData`](#Context-_msgData--) (inherited)



- [Modifiers](#modifiers)
    - [`vestingStarted`](#MechaniumPresaleRewardsDistribution-vestingStarted--) 
    - [`vestingNotStarted`](#MechaniumPresaleRewardsDistribution-vestingNotStarted--) 
    - [`tokensAvailable`](#MechaniumVesting-tokensAvailable-uint256-) (inherited)
    - [`onlyRole`](#AccessControl-onlyRole-bytes32-) (inherited)

- [Structs](#structs)
    - [`RoleData`](#AccessControl-RoleData) (inherited)



## EVENTS

### `VestingStartingTimeChanged(uint256 vestingStartingTime)`  <a name="MechaniumPresaleRewardsDistribution-VestingStartingTimeChanged-uint256-" id="MechaniumPresaleRewardsDistribution-VestingStartingTimeChanged-uint256-"></a>
Event emitted when the `vestingStartingTime` has changed




### `TransferUnsoldToPTEPool(uint256 amount)`  <a name="MechaniumPresaleRewardsDistribution-TransferUnsoldToPTEPool-uint256-" id="MechaniumPresaleRewardsDistribution-TransferUnsoldToPTEPool-uint256-"></a>
Event emitted when `amount` tokens has been transferred to the play to earn pool




### `TransferToStakingPool(address account, uint256 amount, uint256 stakingTime)`  <a name="MechaniumPresaleRewardsDistribution-TransferToStakingPool-address-uint256-uint256-" id="MechaniumPresaleRewardsDistribution-TransferToStakingPool-address-uint256-uint256-"></a>
Event emitted when `account` has transferred `amount` tokens to the staking pool




### `Allocated(address to, uint256 amount)` (inherited) <a name="MechaniumVesting-Allocated-address-uint256-" id="MechaniumVesting-Allocated-address-uint256-"></a>
Event emitted when `amount` tokens have been allocated for `to` address


_Inherited from `MechaniumVesting/MechaniumVesting.sol`_.


### `ClaimedTokens(address caller, address to, uint256 amount)` (inherited) <a name="MechaniumVesting-ClaimedTokens-address-address-uint256-" id="MechaniumVesting-ClaimedTokens-address-address-uint256-"></a>
Event emitted when `caller` claimed `amount` tokens for `to` address


_Inherited from `MechaniumVesting/MechaniumVesting.sol`_.


### `ClaimedTokensToAll(address caller, uint256 beneficiariesNb, uint256 tokensUnlockNb)` (inherited) <a name="MechaniumVesting-ClaimedTokensToAll-address-uint256-uint256-" id="MechaniumVesting-ClaimedTokensToAll-address-uint256-uint256-"></a>
Event emitted when `caller` claimed the tokens for all beneficiary address


_Inherited from `MechaniumVesting/MechaniumVesting.sol`_.


### `SoldOut(uint256 totalAllocated)` (inherited) <a name="MechaniumVesting-SoldOut-uint256-" id="MechaniumVesting-SoldOut-uint256-"></a>
Event emitted when all tokens have been allocated


_Inherited from `MechaniumVesting/MechaniumVesting.sol`_.


### `ReleasedLastTokens(uint256 totalReleased)` (inherited) <a name="MechaniumVesting-ReleasedLastTokens-uint256-" id="MechaniumVesting-ReleasedLastTokens-uint256-"></a>
Event emitted when the last tokens have been claimed


_Inherited from `MechaniumVesting/MechaniumVesting.sol`_.


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

### `constructor(contract IERC20 token_)` (public) <a name="MechaniumPresaleRewardsDistribution-constructor-contract-IERC20-" id="MechaniumPresaleRewardsDistribution-constructor-contract-IERC20-"></a>

Contract constructor

- `token_`: address of the ERC20 token contract, this address cannot be changed later



### `allocateTokens(address to, uint256 amount) → bool` (public) <a name="MechaniumPresaleRewardsDistribution-allocateTokens-address-uint256-" id="MechaniumPresaleRewardsDistribution-allocateTokens-address-uint256-"></a>
Allocate `amount` token `to` address


- `to`: Address of the beneficiary

- `amount`: Total token to be allocated



### `startVesting() → bool` (public) <a name="MechaniumPresaleRewardsDistribution-startVesting--" id="MechaniumPresaleRewardsDistribution-startVesting--"></a>
Start the vesting immediately




### `startVesting(uint256 startTime) → bool` (public) <a name="MechaniumPresaleRewardsDistribution-startVesting-uint256-" id="MechaniumPresaleRewardsDistribution-startVesting-uint256-"></a>
Set the vesting start time


- `startTime`: vesting start time



### `setStakingPool(address stakingPoolAddress) → bool` (public) <a name="MechaniumPresaleRewardsDistribution-setStakingPool-address-" id="MechaniumPresaleRewardsDistribution-setStakingPool-address-"></a>
Set staking pool address


- `stakingPoolAddress`: The staking pool address



### `setStakingTransferTimeLimit(uint256 stakingTransferTimeLimit) → bool` (public) <a name="MechaniumPresaleRewardsDistribution-setStakingTransferTimeLimit-uint256-" id="MechaniumPresaleRewardsDistribution-setStakingTransferTimeLimit-uint256-"></a>
Set staking transfer time limit


- `stakingTransferTimeLimit`: The staking transfer time limit



### `setMinimumStakingTime(uint256 minimumStakingTime) → bool` (public) <a name="MechaniumPresaleRewardsDistribution-setMinimumStakingTime-uint256-" id="MechaniumPresaleRewardsDistribution-setMinimumStakingTime-uint256-"></a>
Set minimum staking time


- `minimumStakingTime`: The minimum staking time



### `transferToStakingPool(uint256 amount, uint256 stakingTime) → bool` (public) <a name="MechaniumPresaleRewardsDistribution-transferToStakingPool-uint256-uint256-" id="MechaniumPresaleRewardsDistribution-transferToStakingPool-uint256-uint256-"></a>
Transfer tokens balance ( allocated but not claimed ) to the staking pool




### `allocatedTokensOf(address account) → uint256` (public) <a name="MechaniumPresaleRewardsDistribution-allocatedTokensOf-address-" id="MechaniumPresaleRewardsDistribution-allocatedTokensOf-address-"></a>

Return the amount of allocated tokens for `account` from the beginning



### `pendingTokensOf(address account) → uint256` (public) <a name="MechaniumPresaleRewardsDistribution-pendingTokensOf-address-" id="MechaniumPresaleRewardsDistribution-pendingTokensOf-address-"></a>

Return the amount of tokens that the `account` can unlock in real time



### `unlockableTokens(address account) → uint256` (public) <a name="MechaniumPresaleRewardsDistribution-unlockableTokens-address-" id="MechaniumPresaleRewardsDistribution-unlockableTokens-address-"></a>

Return the amount of tokens that the `account` can unlock per month



### `hasVestingStarted() → bool` (public) <a name="MechaniumPresaleRewardsDistribution-hasVestingStarted--" id="MechaniumPresaleRewardsDistribution-hasVestingStarted--"></a>

Return true if the vesting schedule has started



### `vestingStartingTime() → uint256` (public) <a name="MechaniumPresaleRewardsDistribution-vestingStartingTime--" id="MechaniumPresaleRewardsDistribution-vestingStartingTime--"></a>

Return the starting time of the vesting schedule



### `maxVestingStartingTime() → uint256` (public) <a name="MechaniumPresaleRewardsDistribution-maxVestingStartingTime--" id="MechaniumPresaleRewardsDistribution-maxVestingStartingTime--"></a>

Return the unchangeable maximum vesting starting time



### `getStakingPoolAddress() → address` (public) <a name="MechaniumPresaleRewardsDistribution-getStakingPoolAddress--" id="MechaniumPresaleRewardsDistribution-getStakingPoolAddress--"></a>

Return the staking pool address



### `getStrakingTransferTimeLimit() → uint256` (public) <a name="MechaniumPresaleRewardsDistribution-getStrakingTransferTimeLimit--" id="MechaniumPresaleRewardsDistribution-getStrakingTransferTimeLimit--"></a>

Return the staking transfer time limit



### `getMinimumStakingTime() → uint256` (public) <a name="MechaniumPresaleRewardsDistribution-getMinimumStakingTime--" id="MechaniumPresaleRewardsDistribution-getMinimumStakingTime--"></a>

Return the minimum staking time



### `claimTokens(address account) → bool` (public) (inherited)<a name="MechaniumVesting-claimTokens-address-" id="MechaniumVesting-claimTokens-address-"></a>
Claim the account's token


- `account`: the account to claim tokens

_Inherited from `MechaniumVesting/MechaniumVesting.sol`_.


### `claimTokens() → bool` (public) (inherited)<a name="MechaniumVesting-claimTokens--" id="MechaniumVesting-claimTokens--"></a>
Claim the account's token


_Inherited from `MechaniumVesting/MechaniumVesting.sol`_.


### `claimTokensForAll() → bool` (public) (inherited)<a name="MechaniumVesting-claimTokensForAll--" id="MechaniumVesting-claimTokensForAll--"></a>
Claim all the accounts tokens (Only by DEFAULT_ADMIN_ROLE)


_Inherited from `MechaniumVesting/MechaniumVesting.sol`_.


### `balanceOf(address account) → uint256` (public) (inherited)<a name="MechaniumVesting-balanceOf-address-" id="MechaniumVesting-balanceOf-address-"></a>

Return the amount of tokens locked for `account`

_Inherited from `MechaniumVesting/MechaniumVesting.sol`_.


### `releasedTokensOf(address account) → uint256` (public) (inherited)<a name="MechaniumVesting-releasedTokensOf-address-" id="MechaniumVesting-releasedTokensOf-address-"></a>

Get released tokens of an address

_Inherited from `MechaniumVesting/MechaniumVesting.sol`_.


### `token() → address` (public) (inherited)<a name="MechaniumVesting-token--" id="MechaniumVesting-token--"></a>

Return the token IERC20

_Inherited from `MechaniumVesting/MechaniumVesting.sol`_.


### `tokenBalance() → uint256` (public) (inherited)<a name="MechaniumVesting-tokenBalance--" id="MechaniumVesting-tokenBalance--"></a>

Return the total token hold by the contract

_Inherited from `MechaniumVesting/MechaniumVesting.sol`_.


### `totalSupply() → uint256` (public) (inherited)<a name="MechaniumVesting-totalSupply--" id="MechaniumVesting-totalSupply--"></a>

Return the total supply of tokens

_Inherited from `MechaniumVesting/MechaniumVesting.sol`_.


### `totalUnallocatedTokens() → uint256` (public) (inherited)<a name="MechaniumVesting-totalUnallocatedTokens--" id="MechaniumVesting-totalUnallocatedTokens--"></a>

Return the total token unallocated by the contract

_Inherited from `MechaniumVesting/MechaniumVesting.sol`_.


### `totalAllocatedTokens() → uint256` (public) (inherited)<a name="MechaniumVesting-totalAllocatedTokens--" id="MechaniumVesting-totalAllocatedTokens--"></a>

Return the total allocated tokens for all the addresses

_Inherited from `MechaniumVesting/MechaniumVesting.sol`_.


### `totalReleasedTokens() → uint256` (public) (inherited)<a name="MechaniumVesting-totalReleasedTokens--" id="MechaniumVesting-totalReleasedTokens--"></a>

Return the total tokens that have been transferred among all the addresses

_Inherited from `MechaniumVesting/MechaniumVesting.sol`_.


### `vestingPerClock() → uint256` (public) (inherited)<a name="MechaniumVesting-vestingPerClock--" id="MechaniumVesting-vestingPerClock--"></a>

Return the percentage of unlocked tokens per `vestingClockTime()` once the vesting schedule has started

_Inherited from `MechaniumVesting/MechaniumVesting.sol`_.


### `vestingClockTime() → uint256` (public) (inherited)<a name="MechaniumVesting-vestingClockTime--" id="MechaniumVesting-vestingClockTime--"></a>

Return the number of seconds between two `vestingPerClock()`

_Inherited from `MechaniumVesting/MechaniumVesting.sol`_.


### `isSoldOut() → bool` (public) (inherited)<a name="MechaniumVesting-isSoldOut--" id="MechaniumVesting-isSoldOut--"></a>

Return true if all tokens have been allocated

_Inherited from `MechaniumVesting/MechaniumVesting.sol`_.


### `fallback()` (external) (inherited)<a name="MechaniumCanReleaseUnintented-fallback--" id="MechaniumCanReleaseUnintented-fallback--"></a>
fallback payable function ( used to receive ETH in tests )


_Inherited from `MechaniumUtils/MechaniumCanReleaseUnintented.sol`_.


### `receive()` (external) (inherited)<a name="MechaniumCanReleaseUnintented-receive--" id="MechaniumCanReleaseUnintented-receive--"></a>
receive payable function ( used to receive ETH in tests )


_Inherited from `MechaniumUtils/MechaniumCanReleaseUnintented.sol`_.


### `releaseUnintented(address token, address account, uint256 amount) → bool` (public) (inherited)<a name="MechaniumCanReleaseUnintented-releaseUnintented-address-address-uint256-" id="MechaniumCanReleaseUnintented-releaseUnintented-address-address-uint256-"></a>
Release an `amount` of `token` to an `account`
This function is used to prevent unintented tokens that got sent to be stuck on the contract


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

### `_releaseTokens(address to, uint256 amount)` (internal) (inherited) <a name="MechaniumVesting-_releaseTokens-address-uint256-" id="MechaniumVesting-_releaseTokens-address-uint256-"></a>
Send `amount` token `to` address

`amount` must imperatively be less or equal to the number of allocated tokens, throw an assert (loss of transaction fees)

- `to`: Address of the beneficiary

- `amount`: Total token to send

_Inherited from `MechaniumVesting/MechaniumVesting.sol`_.


### `_unlockTokensCalc(uint256 startTime, uint256 allocation) → uint256` (internal) (inherited) <a name="MechaniumVesting-_unlockTokensCalc-uint256-uint256-" id="MechaniumVesting-_unlockTokensCalc-uint256-uint256-"></a>

Return the number of tokens that can be unlock since startTime

_Inherited from `MechaniumVesting/MechaniumVesting.sol`_.


### `_pendingTokensCalc(uint256 startTime, uint256 allocation) → uint256` (internal) (inherited) <a name="MechaniumVesting-_pendingTokensCalc-uint256-uint256-" id="MechaniumVesting-_pendingTokensCalc-uint256-uint256-"></a>

Return the number of tokens that can be unlock in real time since startTime

_Inherited from `MechaniumVesting/MechaniumVesting.sol`_.


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

### `vestingStarted()`  <a name="MechaniumPresaleRewardsDistribution-vestingStarted--" id="MechaniumPresaleRewardsDistribution-vestingStarted--"></a>


Check if the vesting has started



### `vestingNotStarted()`  <a name="MechaniumPresaleRewardsDistribution-vestingNotStarted--" id="MechaniumPresaleRewardsDistribution-vestingNotStarted--"></a>


Check if the vesting has not started



### `tokensAvailable(uint256 amount)` (inherited) <a name="MechaniumVesting-tokensAvailable-uint256-" id="MechaniumVesting-tokensAvailable-uint256-"></a>


Check if the contract has the amount of tokens to allocate

- `amount`: The amount of tokens to allocate

_Inherited from `MechaniumVesting/MechaniumVesting.sol`_.


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

