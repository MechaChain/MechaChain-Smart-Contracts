# `MechaniumFoundersDistribution`
MechaniumFoundersDistribution - Vesting and distribution smart contract for the MechaChain founders

Administrators have the right to whitdraw all tokens from the contract if the code fails the audit. If the contract is shifted secure, the whitdraw function is permanently blocked.



**Table of Contents**
- [EVENTS](#events)
    - [`Withdraw`](#MechaniumFoundersDistribution-Withdraw-address-uint256-)
    - [`WithdrawLocked`](#MechaniumFoundersDistribution-WithdrawLocked-address-)

- [PUBLIC FUNCTIONS](#public-functions)
    - [`constructor`](#MechaniumFoundersDistribution-constructor-contract-IERC20-)
    - [`lockWithdraw`](#MechaniumFoundersDistribution-lockWithdraw--)
    - [`withdraw`](#MechaniumFoundersDistribution-withdraw--)
    - [`isWithdrawLocked`](#MechaniumFoundersDistribution-isWithdrawLocked--)

- [PRIVATE FUNCTIONS](#private-functions)





## EVENTS

### `Withdraw(address caller, uint256 amount)` <span id="MechaniumFoundersDistribution-Withdraw-address-uint256-"></span>
Event emitted when the `caller` administrator withdraw `amount` tokens (only if the code fails the audit)


### `WithdrawLocked(address caller)` <span id="MechaniumFoundersDistribution-WithdrawLocked-address-"></span>
Event emitted when the administrator `caller` lock permanently the withdraw function



## PUBLIC FUNCTIONS

### `constructor(contract IERC20 token_)` (public) <span id="MechaniumFoundersDistribution-constructor-contract-IERC20-"></span>

Contract constructor sets the configuration of the vesting schedule

- `token_`: Address of the ERC20 token contract, this address cannot be changed later

### `lockWithdraw() → bool` (external) <span id="MechaniumFoundersDistribution-lockWithdraw--"></span>
Lock permanently the withdraw function


### `withdraw() → bool` (external) <span id="MechaniumFoundersDistribution-withdraw--"></span>
Withdraw all tokens if the code fails the audit


### `isWithdrawLocked() → bool` (external) <span id="MechaniumFoundersDistribution-isWithdrawLocked--"></span>

Return true if withdraw is permanently locked

## PRIVATE FUNCTIONS



