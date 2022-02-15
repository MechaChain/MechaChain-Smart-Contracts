# `MechaniumFoundersDistribution`
MechaniumFoundersDistribution - Vesting and distribution smart contract for the MechaChain founders

Administrators have the right to whitdraw all tokens from the contract if the code fails the audit. If the contract is shifted secure, the whitdraw function is permanently blocked.



**Table of Contents**
- FUNCTIONS
    - [`constructor`](#MechaniumFoundersDistribution-constructor-contract-IERC20-)
    - [`lockWithdraw`](#MechaniumFoundersDistribution-lockWithdraw--)
    - [`withdraw`](#MechaniumFoundersDistribution-withdraw--)
    - [`isWithdrawLocked`](#MechaniumFoundersDistribution-isWithdrawLocked--)
- EVENTS
    - [`Withdraw`](#MechaniumFoundersDistribution-Withdraw-address-uint256-)
    - [`WithdrawLocked`](#MechaniumFoundersDistribution-WithdrawLocked-address-)


## FUNCTIONS
### `constructor(contract IERC20 token_)` (public)

Contract constructor sets the configuration of the vesting schedule

- `token_`: Address of the ERC20 token contract, this address cannot be changed later
### `lockWithdraw() → bool` (external)
Lock permanently the withdraw function

### `withdraw() → bool` (external)
Withdraw all tokens if the code fails the audit

### `isWithdrawLocked() → bool` (external)

Return true if withdraw is permanently locked

## EVENTS
### `Withdraw(address caller, uint256 amount)`
Event emitted when the `caller` administrator withdraw `amount` tokens (only if the code fails the audit)

### `WithdrawLocked(address caller)`
Event emitted when the administrator `caller` lock permanently the withdraw function




