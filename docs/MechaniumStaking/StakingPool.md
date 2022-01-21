# `StakingPool`
StakingPool - A dummy staking pool smart contract for tests




**Table of Contents**
- FUNCTIONS
    - [`constructor`](#StakingPool-constructor-contract-IERC20-)
    - [`stakeTokensFromDistribution`](#StakingPool-stakeTokensFromDistribution-address-uint256-)
    - [`token`](#StakingPool-token--)
    - [`totalAllocatedTokens`](#StakingPool-totalAllocatedTokens--)
    - [`balanceOf`](#StakingPool-balanceOf-address-)


## FUNCTIONS
### `constructor(contract IERC20 token_)` (public)

Contract constructor sets the configuration of the vesting schedule

- `token_`: Address of the ERC20 token contract, this address cannot be changed later
### `stakeTokensFromDistribution(address account, uint256 amount) → bool` (public)


### `token() → contract IERC20` (public)


### `totalAllocatedTokens() → uint256` (public)


### `balanceOf(address account) → uint256` (public)






