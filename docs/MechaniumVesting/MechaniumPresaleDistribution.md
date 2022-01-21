# `MechaniumPresaleDistribution`
MechaniumPresaleDistribution - Pre-sale distribution smart contract




**Table of Contents**
- FUNCTIONS
    - [`constructor`](#MechaniumPresaleDistribution-constructor-contract-IERC20-)
    - [`allocateTokens`](#MechaniumPresaleDistribution-allocateTokens-address-uint256-)
    - [`startVesting`](#MechaniumPresaleDistribution-startVesting--)
    - [`startVesting`](#MechaniumPresaleDistribution-startVesting-uint256-)
    - [`setPTEPool`](#MechaniumPresaleDistribution-setPTEPool-address-)
    - [`transferUnsoldToPTEPool`](#MechaniumPresaleDistribution-transferUnsoldToPTEPool--)
    - [`setStakingPool`](#MechaniumPresaleDistribution-setStakingPool-address-)
    - [`transferToStakingPool`](#MechaniumPresaleDistribution-transferToStakingPool--)
    - [`allocatedTokensOf`](#MechaniumPresaleDistribution-allocatedTokensOf-address-)
    - [`pendingTokensOf`](#MechaniumPresaleDistribution-pendingTokensOf-address-)
    - [`unlockableTokens`](#MechaniumPresaleDistribution-unlockableTokens-address-)
    - [`hasVestingStarted`](#MechaniumPresaleDistribution-hasVestingStarted--)
    - [`vestingStartingTime`](#MechaniumPresaleDistribution-vestingStartingTime--)
    - [`maxVestingStartingTime`](#MechaniumPresaleDistribution-maxVestingStartingTime--)
    - [`getPTEPoolAddress`](#MechaniumPresaleDistribution-getPTEPoolAddress--)
    - [`getStakingPoolAddress`](#MechaniumPresaleDistribution-getStakingPoolAddress--)
- EVENTS
    - [`VestingStartingTimeChanged`](#MechaniumPresaleDistribution-VestingStartingTimeChanged-uint256-)
    - [`TransferUnsoldToPTEPool`](#MechaniumPresaleDistribution-TransferUnsoldToPTEPool-uint256-)
    - [`TransferToStakingPool`](#MechaniumPresaleDistribution-TransferToStakingPool-address-uint256-)

## MODIFIERS
### `vestingStarted()`


Check if the vesting has started
### `vestingNotStarted()`


Check if the vesting has not started

## FUNCTIONS
### `constructor(contract IERC20 token_)` (public)

Contract constructor

- `token_`: address of the ERC20 token contract, this address cannot be changed later
### `allocateTokens(address to, uint256 amount) → bool` (public)
Allocate `amount` token `to` address


- `to`: Address of the beneficiary

- `amount`: Total token to be allocated
### `startVesting() → bool` (public)
Start the vesting immediately

### `startVesting(uint256 startTime) → bool` (public)
Set the vesting start time


- `startTime`: vesting start time
### `setPTEPool(address ptePoolAddress) → bool` (public)
Set the play to earn pool address


- `ptePoolAddress`: PTE pool address
### `transferUnsoldToPTEPool() → bool` (public)
Transfer unclaimed tokens to PTE pool

### `setStakingPool(address stakingPoolAddress) → bool` (public)
Set staking pool address


- `stakingPoolAddress`: The staking pool address
### `transferToStakingPool() → bool` (public)
Transfer tokens balance ( allocated but not claimed ) to the staking pool

### `allocatedTokensOf(address account) → uint256` (public)

Return the amount of allocated tokens for `account` from the beginning
### `pendingTokensOf(address account) → uint256` (public)

Return the amount of tokens that the `account` can unlock in real time
### `unlockableTokens(address account) → uint256` (public)

Return the amount of tokens that the `account` can unlock per month
### `hasVestingStarted() → bool` (public)

Return true if the vesting schedule has started
### `vestingStartingTime() → uint256` (public)

Return the starting time of the vesting schedule
### `maxVestingStartingTime() → uint256` (public)

Return the unchangeable maximum vesting starting time
### `getPTEPoolAddress() → address` (public)

Return the pte pool address
### `getStakingPoolAddress() → address` (public)

Return the staking pool address

## EVENTS
### `VestingStartingTimeChanged(uint256 vestingStartingTime)`
Event emitted when the `vestingStartingTime` has changed

### `TransferUnsoldToPTEPool(uint256 amount)`
Event emitted when `amount` tokens has been transferred to the play to earn pool

### `TransferToStakingPool(address account, uint256 amount)`
Event emitted when `account` has transferred `amount` tokens to the staking pool




