# `MechaniumPresaleRewardsDistribution`
MechaniumPresaleRewardsDistribution - Pre-sale distribution smart contract




**Table of Contents**
- [EVENTS](#events)
    - [`VestingStartingTimeChanged`](#MechaniumPresaleRewardsDistribution-VestingStartingTimeChanged-uint256-)
    - [`TransferUnsoldToPTEPool`](#MechaniumPresaleRewardsDistribution-TransferUnsoldToPTEPool-uint256-)
    - [`TransferToStakingPool`](#MechaniumPresaleRewardsDistribution-TransferToStakingPool-address-uint256-uint256-)

- [PUBLIC FUNCTIONS](#public-functions)
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

- [PRIVATE FUNCTIONS](#private-functions)

- [MODIFIERS](#modifiers)
    - [`vestingStarted`](#MechaniumPresaleRewardsDistribution-vestingStarted--)
    - [`vestingNotStarted`](#MechaniumPresaleRewardsDistribution-vestingNotStarted--)




## EVENTS

### `VestingStartingTimeChanged(uint256 vestingStartingTime)` <span id="MechaniumPresaleRewardsDistribution-VestingStartingTimeChanged-uint256-"></span>
Event emitted when the `vestingStartingTime` has changed


### `TransferUnsoldToPTEPool(uint256 amount)` <span id="MechaniumPresaleRewardsDistribution-TransferUnsoldToPTEPool-uint256-"></span>
Event emitted when `amount` tokens has been transferred to the play to earn pool


### `TransferToStakingPool(address account, uint256 amount, uint256 stakingTime)` <span id="MechaniumPresaleRewardsDistribution-TransferToStakingPool-address-uint256-uint256-"></span>
Event emitted when `account` has transferred `amount` tokens to the staking pool



## PUBLIC FUNCTIONS

### `constructor(contract IERC20 token_)` (public) <span id="MechaniumPresaleRewardsDistribution-constructor-contract-IERC20-"></span>

Contract constructor

- `token_`: address of the ERC20 token contract, this address cannot be changed later

### `allocateTokens(address to, uint256 amount) → bool` (public) <span id="MechaniumPresaleRewardsDistribution-allocateTokens-address-uint256-"></span>
Allocate `amount` token `to` address


- `to`: Address of the beneficiary

- `amount`: Total token to be allocated

### `startVesting() → bool` (public) <span id="MechaniumPresaleRewardsDistribution-startVesting--"></span>
Start the vesting immediately


### `startVesting(uint256 startTime) → bool` (public) <span id="MechaniumPresaleRewardsDistribution-startVesting-uint256-"></span>
Set the vesting start time


- `startTime`: vesting start time

### `setStakingPool(address stakingPoolAddress) → bool` (public) <span id="MechaniumPresaleRewardsDistribution-setStakingPool-address-"></span>
Set staking pool address


- `stakingPoolAddress`: The staking pool address

### `setStakingTransferTimeLimit(uint256 stakingTransferTimeLimit) → bool` (public) <span id="MechaniumPresaleRewardsDistribution-setStakingTransferTimeLimit-uint256-"></span>
Set staking transfer time limit


- `stakingTransferTimeLimit`: The staking transfer time limit

### `setMinimumStakingTime(uint256 minimumStakingTime) → bool` (public) <span id="MechaniumPresaleRewardsDistribution-setMinimumStakingTime-uint256-"></span>
Set minimum staking time


- `minimumStakingTime`: The minimum staking time

### `transferToStakingPool(uint256 amount, uint256 stakingTime) → bool` (public) <span id="MechaniumPresaleRewardsDistribution-transferToStakingPool-uint256-uint256-"></span>
Transfer tokens balance ( allocated but not claimed ) to the staking pool


### `allocatedTokensOf(address account) → uint256` (public) <span id="MechaniumPresaleRewardsDistribution-allocatedTokensOf-address-"></span>

Return the amount of allocated tokens for `account` from the beginning

### `pendingTokensOf(address account) → uint256` (public) <span id="MechaniumPresaleRewardsDistribution-pendingTokensOf-address-"></span>

Return the amount of tokens that the `account` can unlock in real time

### `unlockableTokens(address account) → uint256` (public) <span id="MechaniumPresaleRewardsDistribution-unlockableTokens-address-"></span>

Return the amount of tokens that the `account` can unlock per month

### `hasVestingStarted() → bool` (public) <span id="MechaniumPresaleRewardsDistribution-hasVestingStarted--"></span>

Return true if the vesting schedule has started

### `vestingStartingTime() → uint256` (public) <span id="MechaniumPresaleRewardsDistribution-vestingStartingTime--"></span>

Return the starting time of the vesting schedule

### `maxVestingStartingTime() → uint256` (public) <span id="MechaniumPresaleRewardsDistribution-maxVestingStartingTime--"></span>

Return the unchangeable maximum vesting starting time

### `getStakingPoolAddress() → address` (public) <span id="MechaniumPresaleRewardsDistribution-getStakingPoolAddress--"></span>

Return the staking pool address

### `getStrakingTransferTimeLimit() → uint256` (public) <span id="MechaniumPresaleRewardsDistribution-getStrakingTransferTimeLimit--"></span>

Return the staking transfer time limit

### `getMinimumStakingTime() → uint256` (public) <span id="MechaniumPresaleRewardsDistribution-getMinimumStakingTime--"></span>

Return the minimum staking time

## PRIVATE FUNCTIONS

## MODIFIERS

### `vestingStarted()` <span id="MechaniumPresaleRewardsDistribution-vestingStarted--"></span>


Check if the vesting has started

### `vestingNotStarted()` <span id="MechaniumPresaleRewardsDistribution-vestingNotStarted--"></span>


Check if the vesting has not started


