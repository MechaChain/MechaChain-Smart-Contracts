## `MechaniumCanReleaseUnintented`






### `fallback()` (external)

fallback payable function ( used to receive ETH in tests )



### `receive()` (external)

receive payable function ( used to receive ETH in tests )



### `_addLockedToken(address token_)` (internal)

Add a locked `token_` ( can't be released )



### `releaseUnintented(address token, address account, uint256 amount) → bool` (public)

Release an `amount` of `token` to an `account`
This function is used to prevent unintented tokens that got sent to be stuck on the contract





### `ReleaseUintentedTokens(address token, address account, uint256 amount)`

Event emitted when release unintented `amount` of `token` for `account` address





