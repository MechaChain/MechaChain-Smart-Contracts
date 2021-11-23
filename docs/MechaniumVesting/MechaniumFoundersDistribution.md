## `MechaniumFoundersDistribution`

Administrators have the right to whitdraw all tokens from the contract if the code fails the audit. If the contract is shifted secure, the whitdraw function is permanently blocked.





### `constructor(contract IERC20 token_)` (public)



Contract constructor sets the configuration of the vesting schedule


### `lockWithdraw() → bool` (external)

Lock permanently the withdraw function



### `withdraw() → bool` (external)

Withdraw all tokens if the code fails the audit



### `isWithdrawLocked() → bool` (external)



Return true if withdraw is permanently locked


### `Withdraw(address caller, uint256 amount)`

Event emitted when the `caller` administrator withdraw `amount` tokens (only if the code fails the audit)



### `WithdrawLocked(address caller)`

Event emitted when the administrator `caller` lock permanently the withdraw function





