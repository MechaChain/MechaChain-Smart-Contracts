# `MechaniumPresaleDistribution`
MechaniumPresaleDistribution - Pre-sale distribution smart contract




**Table of Contents**
- [EVENTS](#events)
    - [`VestingStartingTimeChanged`](#MechaniumPresaleDistribution-VestingStartingTimeChanged-uint256-)
    - [`TransferUnsoldToPTEPool`](#MechaniumPresaleDistribution-TransferUnsoldToPTEPool-uint256-)
    - [`TransferToStakingPool`](#MechaniumPresaleDistribution-TransferToStakingPool-address-uint256-uint256-)

- [PUBLIC FUNCTIONS](#public-functions)
    - [`constructor`](#MechaniumPresaleDistribution-constructor-contract-IERC20-)
    - [`allocateTokens`](#MechaniumPresaleDistribution-allocateTokens-address-uint256-)
    - [`startVesting`](#MechaniumPresaleDistribution-startVesting--)
    - [`startVesting`](#MechaniumPresaleDistribution-startVesting-uint256-)
    - [`setStakingPool`](#MechaniumPresaleDistribution-setStakingPool-address-)
    - [`setStakingTransferTimeLimit`](#MechaniumPresaleDistribution-setStakingTransferTimeLimit-uint256-)
    - [`setMinimumStakingTime`](#MechaniumPresaleDistribution-setMinimumStakingTime-uint256-)
    - [`transferToStakingPool`](#MechaniumPresaleDistribution-transferToStakingPool-uint256-uint256-)
    - [`allocatedTokensOf`](#MechaniumPresaleDistribution-allocatedTokensOf-address-)
    - [`pendingTokensOf`](#MechaniumPresaleDistribution-pendingTokensOf-address-)
    - [`unlockableTokens`](#MechaniumPresaleDistribution-unlockableTokens-address-)
    - [`hasVestingStarted`](#MechaniumPresaleDistribution-hasVestingStarted--)
    - [`vestingStartingTime`](#MechaniumPresaleDistribution-vestingStartingTime--)
    - [`maxVestingStartingTime`](#MechaniumPresaleDistribution-maxVestingStartingTime--)
    - [`getStakingPoolAddress`](#MechaniumPresaleDistribution-getStakingPoolAddress--)
    - [`getStrakingTransferTimeLimit`](#MechaniumPresaleDistribution-getStrakingTransferTimeLimit--)
    - [`getMinimumStakingTime`](#MechaniumPresaleDistribution-getMinimumStakingTime--)

- [PRIVATE FUNCTIONS](#private-functions)

- [MODIFIERS](#modifiers)
    - [`vestingStarted`](#MechaniumPresaleDistribution-vestingStarted--)
    - [`vestingNotStarted`](#MechaniumPresaleDistribution-vestingNotStarted--)




## EVENTS

### `VestingStartingTimeChanged(uint256 vestingStartingTime)` <span id="MechaniumPresaleDistribution-VestingStartingTimeChanged-uint256-"></span>
Event emitted when the `vestingStartingTime` has changed


### `TransferUnsoldToPTEPool(uint256 amount)` <span id="MechaniumPresaleDistribution-TransferUnsoldToPTEPool-uint256-"></span>
Event emitted when `amount` tokens has been transferred to the play to earn pool


### `TransferToStakingPool(address account, uint256 amount, uint256 stakingTime)` <span id="MechaniumPresaleDistribution-TransferToStakingPool-address-uint256-uint256-"></span>
Event emitted when `account` has transferred `amount` tokens to the staking pool



## PUBLIC FUNCTIONS

### `constructor(contract IERC20 token_)` (public) <span id="MechaniumPresaleDistribution-constructor-contract-IERC20-"></span>

Contract constructor

- `token_`: address of the ERC20 token contract, this address cannot be changed later

### `allocateTokens(address to, uint256 amount) → bool` (public) <span id="MechaniumPresaleDistribution-allocateTokens-address-uint256-"></span>
Allocate `amount` token `to` address


- `to`: Address of the beneficiary

- `amount`: Total token to be allocated

### `startVesting() → bool` (public) <span id="MechaniumPresaleDistribution-startVesting--"></span>
Start the vesting immediately


### `startVesting(uint256 startTime) → bool` (public) <span id="MechaniumPresaleDistribution-startVesting-uint256-"></span>
Set the vesting start time


- `startTime`: vesting start time

### `setStakingPool(address stakingPoolAddress) → bool` (public) <span id="MechaniumPresaleDistribution-setStakingPool-address-"></span>
Set staking pool address


- `stakingPoolAddress`: The staking pool address

### `setStakingTransferTimeLimit(uint256 stakingTransferTimeLimit) → bool` (public) <span id="MechaniumPresaleDistribution-setStakingTransferTimeLimit-uint256-"></span>
Set staking transfer time limit


- `stakingTransferTimeLimit`: The staking transfer time limit

### `setMinimumStakingTime(uint256 minimumStakingTime) → bool` (public) <span id="MechaniumPresaleDistribution-setMinimumStakingTime-uint256-"></span>
Set minimum staking time


- `minimumStakingTime`: The minimum staking time

### `transferToStakingPool(uint256 amount, uint256 stakingTime) → bool` (public) <span id="MechaniumPresaleDistribution-transferToStakingPool-uint256-uint256-"></span>
Transfer tokens balance ( allocated but not claimed ) to the staking pool


### `allocatedTokensOf(address account) → uint256` (public) <span id="MechaniumPresaleDistribution-allocatedTokensOf-address-"></span>

Return the amount of allocated tokens for `account` from the beginning

### `pendingTokensOf(address account) → uint256` (public) <span id="MechaniumPresaleDistribution-pendingTokensOf-address-"></span>

Return the amount of tokens that the `account` can unlock in real time

### `unlockableTokens(address account) → uint256` (public) <span id="MechaniumPresaleDistribution-unlockableTokens-address-"></span>

Return the amount of tokens that the `account` can unlock per month

### `hasVestingStarted() → bool` (public) <span id="MechaniumPresaleDistribution-hasVestingStarted--"></span>

Return true if the vesting schedule has started

### `vestingStartingTime() → uint256` (public) <span id="MechaniumPresaleDistribution-vestingStartingTime--"></span>

Return the starting time of the vesting schedule

### `maxVestingStartingTime() → uint256` (public) <span id="MechaniumPresaleDistribution-maxVestingStartingTime--"></span>

Return the unchangeable maximum vesting starting time

### `getStakingPoolAddress() → address` (public) <span id="MechaniumPresaleDistribution-getStakingPoolAddress--"></span>

Return the staking pool address

### `getStrakingTransferTimeLimit() → uint256` (public) <span id="MechaniumPresaleDistribution-getStrakingTransferTimeLimit--"></span>

Return the staking transfer time limit

### `getMinimumStakingTime() → uint256` (public) <span id="MechaniumPresaleDistribution-getMinimumStakingTime--"></span>

Return the minimum staking time

## PRIVATE FUNCTIONS

## MODIFIERS

### `vestingStarted()` <span id="MechaniumPresaleDistribution-vestingStarted--"></span>


Check if the vesting has started

### `vestingNotStarted()` <span id="MechaniumPresaleDistribution-vestingNotStarted--"></span>


Check if the vesting has not started


