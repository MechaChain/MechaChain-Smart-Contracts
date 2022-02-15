# `MechaniumTeamDistribution`
MechaniumTeamDistribution - Vesting and distribution smart contract for the MechaChain team

Can manage multiple allocations with a specific schedule to each



**Table of Contents**
- FUNCTIONS
    - [`constructor`](#MechaniumTeamDistribution-constructor-contract-IERC20-uint256-uint256-uint256-)
    - [`allocateTokens`](#MechaniumTeamDistribution-allocateTokens-address-uint256-)
    - [`allocatedTokensOf`](#MechaniumTeamDistribution-allocatedTokensOf-address-)
    - [`pendingTokensOf`](#MechaniumTeamDistribution-pendingTokensOf-address-)
    - [`unlockableTokens`](#MechaniumTeamDistribution-unlockableTokens-address-)
    - [`allocationCount`](#MechaniumTeamDistribution-allocationCount--)
    - [`allocationTokens`](#MechaniumTeamDistribution-allocationTokens-uint256-)
    - [`allocationOwner`](#MechaniumTeamDistribution-allocationOwner-uint256-)
    - [`allocationStartingTime`](#MechaniumTeamDistribution-allocationStartingTime-uint256-)
    - [`allocationsOf`](#MechaniumTeamDistribution-allocationsOf-address-)
    - [`timeBeforeStarting`](#MechaniumTeamDistribution-timeBeforeStarting--)


## FUNCTIONS
### `constructor(contract IERC20 token_, uint256 timeBeforeStarting_, uint256 vestingPerClock_, uint256 vestingClockTime_)` (public)

Contract constructor sets the configuration of the vesting schedule

- `token_`: Address of the ERC20 token contract, this address cannot be changed later

- `timeBeforeStarting_`: Number of seconds to wait between allocation and the start of the schedule

- `vestingPerClock_`: Percentage of unlocked tokens per _vestingClockTime once the vesting schedule has started

- `vestingClockTime_`: Number of seconds between two _vestingPerClock
### `allocateTokens(address to, uint256 amount) → bool` (public)
Allocate `amount` token `to` address


- `to`: Address of the beneficiary

- `amount`: Total token to be allocated
### `allocatedTokensOf(address account) → uint256` (public)

Return the amount of allocated tokens for `account` from the beginning
### `pendingTokensOf(address account) → uint256` (public)

Return the amount of tokens that the `account` can unlock in real time
### `unlockableTokens(address account) → uint256` (public)

Return the amount of tokens that the `account` can unlock per month
### `allocationCount() → uint256` (public)

Return the amount of tokens of the allocation
### `allocationTokens(uint256 allocationId) → uint256` (public)

Return the amount of tokens of the allocation
### `allocationOwner(uint256 allocationId) → address` (public)

Return the address of the allocation owner
### `allocationStartingTime(uint256 allocationId) → uint256` (public)

Return the starting time of the allocation
### `allocationsOf(address wallet) → uint256[]` (public)

Return the array of allocationId owned by `wallet`
### `timeBeforeStarting() → uint256` (public)

Return the number of seconds to wait between allocation and the start of the schedule




