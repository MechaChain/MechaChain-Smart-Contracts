# `Mechanium`
**Documentation of `Mechanium.sol`.**

Mechanium - Official $MECHA ERC20 for MechaChain play to earn project

100 000 000 $MECHA are preminted on deployment to the admin wallet



## TABLE OF CONTENTS
- [Events](#events)
    - [`Transfer`](#IERC20-Transfer-address-address-uint256-) (inherited)
    - [`Approval`](#IERC20-Approval-address-address-uint256-) (inherited)

- [Public Functions](#public-functions)
    - [`constructor`](#Mechanium-constructor-address-) 
    - [`name`](#ERC20-name--) (inherited)
    - [`symbol`](#ERC20-symbol--) (inherited)
    - [`decimals`](#ERC20-decimals--) (inherited)
    - [`totalSupply`](#ERC20-totalSupply--) (inherited)
    - [`balanceOf`](#ERC20-balanceOf-address-) (inherited)
    - [`transfer`](#ERC20-transfer-address-uint256-) (inherited)
    - [`allowance`](#ERC20-allowance-address-address-) (inherited)
    - [`approve`](#ERC20-approve-address-uint256-) (inherited)
    - [`transferFrom`](#ERC20-transferFrom-address-address-uint256-) (inherited)
    - [`increaseAllowance`](#ERC20-increaseAllowance-address-uint256-) (inherited)
    - [`decreaseAllowance`](#ERC20-decreaseAllowance-address-uint256-) (inherited)

- [Internal Functions](#internal-functions)
    - [`_transfer`](#ERC20-_transfer-address-address-uint256-) (inherited)
    - [`_mint`](#ERC20-_mint-address-uint256-) (inherited)
    - [`_burn`](#ERC20-_burn-address-uint256-) (inherited)
    - [`_approve`](#ERC20-_approve-address-address-uint256-) (inherited)
    - [`_spendAllowance`](#ERC20-_spendAllowance-address-address-uint256-) (inherited)
    - [`_beforeTokenTransfer`](#ERC20-_beforeTokenTransfer-address-address-uint256-) (inherited)
    - [`_afterTokenTransfer`](#ERC20-_afterTokenTransfer-address-address-uint256-) (inherited)
    - [`_msgSender`](#Context-_msgSender--) (inherited)
    - [`_msgData`](#Context-_msgData--) (inherited)







## EVENTS

### `Transfer(address from, address to, uint256 value)` (inherited) <a name="IERC20-Transfer-address-address-uint256-" id="IERC20-Transfer-address-address-uint256-"></a>

Emitted when `value` tokens are moved from one account (`from`) to
another (`to`).
Note that `value` may be zero.


_Inherited from `../@openzeppelin/contracts/token/ERC20/IERC20.sol`_.


### `Approval(address owner, address spender, uint256 value)` (inherited) <a name="IERC20-Approval-address-address-uint256-" id="IERC20-Approval-address-address-uint256-"></a>

Emitted when the allowance of a `spender` for an `owner` is set by
a call to {approve}. `value` is the new allowance.


_Inherited from `../@openzeppelin/contracts/token/ERC20/IERC20.sol`_.



## PUBLIC FUNCTIONS

### `constructor(address adminWallet)` (public) <a name="Mechanium-constructor-address-" id="Mechanium-constructor-address-"></a>

Contract constructor


Parameters:
- `adminWallet`: address of the MechaChain admin wallet



### `name() → string` (public) (inherited)<a name="ERC20-name--" id="ERC20-name--"></a>

Returns the name of the token.


_Inherited from `../@openzeppelin/contracts/token/ERC20/ERC20.sol`_.


### `symbol() → string` (public) (inherited)<a name="ERC20-symbol--" id="ERC20-symbol--"></a>

Returns the symbol of the token, usually a shorter version of the
name.


_Inherited from `../@openzeppelin/contracts/token/ERC20/ERC20.sol`_.


### `decimals() → uint8` (public) (inherited)<a name="ERC20-decimals--" id="ERC20-decimals--"></a>

Returns the number of decimals used to get its user representation.
For example, if `decimals` equals `2`, a balance of `505` tokens should
be displayed to a user as `5.05` (`505 / 10 ** 2`).
Tokens usually opt for a value of 18, imitating the relationship between
Ether and Wei. This is the value {ERC20} uses, unless this function is
overridden;
NOTE: This information is only used for _display_ purposes: it in
no way affects any of the arithmetic of the contract, including
{IERC20-balanceOf} and {IERC20-transfer}.


_Inherited from `../@openzeppelin/contracts/token/ERC20/ERC20.sol`_.


### `totalSupply() → uint256` (public) (inherited)<a name="ERC20-totalSupply--" id="ERC20-totalSupply--"></a>

See {IERC20-totalSupply}.


_Inherited from `../@openzeppelin/contracts/token/ERC20/ERC20.sol`_.


### `balanceOf(address account) → uint256` (public) (inherited)<a name="ERC20-balanceOf-address-" id="ERC20-balanceOf-address-"></a>

See {IERC20-balanceOf}.


_Inherited from `../@openzeppelin/contracts/token/ERC20/ERC20.sol`_.


### `transfer(address to, uint256 amount) → bool` (public) (inherited)<a name="ERC20-transfer-address-uint256-" id="ERC20-transfer-address-uint256-"></a>

See {IERC20-transfer}.
Requirements:
- `to` cannot be the zero address.
- the caller must have a balance of at least `amount`.


_Inherited from `../@openzeppelin/contracts/token/ERC20/ERC20.sol`_.


### `allowance(address owner, address spender) → uint256` (public) (inherited)<a name="ERC20-allowance-address-address-" id="ERC20-allowance-address-address-"></a>

See {IERC20-allowance}.


_Inherited from `../@openzeppelin/contracts/token/ERC20/ERC20.sol`_.


### `approve(address spender, uint256 amount) → bool` (public) (inherited)<a name="ERC20-approve-address-uint256-" id="ERC20-approve-address-uint256-"></a>

See {IERC20-approve}.
NOTE: If `amount` is the maximum `uint256`, the allowance is not updated on
`transferFrom`. This is semantically equivalent to an infinite approval.
Requirements:
- `spender` cannot be the zero address.


_Inherited from `../@openzeppelin/contracts/token/ERC20/ERC20.sol`_.


### `transferFrom(address from, address to, uint256 amount) → bool` (public) (inherited)<a name="ERC20-transferFrom-address-address-uint256-" id="ERC20-transferFrom-address-address-uint256-"></a>

See {IERC20-transferFrom}.
Emits an {Approval} event indicating the updated allowance. This is not
required by the EIP. See the note at the beginning of {ERC20}.
NOTE: Does not update the allowance if the current allowance
is the maximum `uint256`.
Requirements:
- `from` and `to` cannot be the zero address.
- `from` must have a balance of at least `amount`.
- the caller must have allowance for ``from``'s tokens of at least
`amount`.


_Inherited from `../@openzeppelin/contracts/token/ERC20/ERC20.sol`_.


### `increaseAllowance(address spender, uint256 addedValue) → bool` (public) (inherited)<a name="ERC20-increaseAllowance-address-uint256-" id="ERC20-increaseAllowance-address-uint256-"></a>

Atomically increases the allowance granted to `spender` by the caller.
This is an alternative to {approve} that can be used as a mitigation for
problems described in {IERC20-approve}.
Emits an {Approval} event indicating the updated allowance.
Requirements:
- `spender` cannot be the zero address.


_Inherited from `../@openzeppelin/contracts/token/ERC20/ERC20.sol`_.


### `decreaseAllowance(address spender, uint256 subtractedValue) → bool` (public) (inherited)<a name="ERC20-decreaseAllowance-address-uint256-" id="ERC20-decreaseAllowance-address-uint256-"></a>

Atomically decreases the allowance granted to `spender` by the caller.
This is an alternative to {approve} that can be used as a mitigation for
problems described in {IERC20-approve}.
Emits an {Approval} event indicating the updated allowance.
Requirements:
- `spender` cannot be the zero address.
- `spender` must have allowance for the caller of at least
`subtractedValue`.


_Inherited from `../@openzeppelin/contracts/token/ERC20/ERC20.sol`_.


## INTERNAL FUNCTIONS

### `_transfer(address from, address to, uint256 amount)` (internal) (inherited) <a name="ERC20-_transfer-address-address-uint256-" id="ERC20-_transfer-address-address-uint256-"></a>

Moves `amount` of tokens from `sender` to `recipient`.
This internal function is equivalent to {transfer}, and can be used to
e.g. implement automatic token fees, slashing mechanisms, etc.
Emits a {Transfer} event.
Requirements:
- `from` cannot be the zero address.
- `to` cannot be the zero address.
- `from` must have a balance of at least `amount`.


_Inherited from `../@openzeppelin/contracts/token/ERC20/ERC20.sol`_.


### `_mint(address account, uint256 amount)` (internal) (inherited) <a name="ERC20-_mint-address-uint256-" id="ERC20-_mint-address-uint256-"></a>

Creates `amount` tokens and assigns them to `account`, increasing
the total supply.
Emits a {Transfer} event with `from` set to the zero address.
Requirements:
- `account` cannot be the zero address.


_Inherited from `../@openzeppelin/contracts/token/ERC20/ERC20.sol`_.


### `_burn(address account, uint256 amount)` (internal) (inherited) <a name="ERC20-_burn-address-uint256-" id="ERC20-_burn-address-uint256-"></a>

Destroys `amount` tokens from `account`, reducing the
total supply.
Emits a {Transfer} event with `to` set to the zero address.
Requirements:
- `account` cannot be the zero address.
- `account` must have at least `amount` tokens.


_Inherited from `../@openzeppelin/contracts/token/ERC20/ERC20.sol`_.


### `_approve(address owner, address spender, uint256 amount)` (internal) (inherited) <a name="ERC20-_approve-address-address-uint256-" id="ERC20-_approve-address-address-uint256-"></a>

Sets `amount` as the allowance of `spender` over the `owner` s tokens.
This internal function is equivalent to `approve`, and can be used to
e.g. set automatic allowances for certain subsystems, etc.
Emits an {Approval} event.
Requirements:
- `owner` cannot be the zero address.
- `spender` cannot be the zero address.


_Inherited from `../@openzeppelin/contracts/token/ERC20/ERC20.sol`_.


### `_spendAllowance(address owner, address spender, uint256 amount)` (internal) (inherited) <a name="ERC20-_spendAllowance-address-address-uint256-" id="ERC20-_spendAllowance-address-address-uint256-"></a>

Spend `amount` form the allowance of `owner` toward `spender`.
Does not update the allowance amount in case of infinite allowance.
Revert if not enough allowance is available.
Might emit an {Approval} event.


_Inherited from `../@openzeppelin/contracts/token/ERC20/ERC20.sol`_.


### `_beforeTokenTransfer(address from, address to, uint256 amount)` (internal) (inherited) <a name="ERC20-_beforeTokenTransfer-address-address-uint256-" id="ERC20-_beforeTokenTransfer-address-address-uint256-"></a>

Hook that is called before any transfer of tokens. This includes
minting and burning.
Calling conditions:
- when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
will be transferred to `to`.
- when `from` is zero, `amount` tokens will be minted for `to`.
- when `to` is zero, `amount` of ``from``'s tokens will be burned.
- `from` and `to` are never both zero.
To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].


_Inherited from `../@openzeppelin/contracts/token/ERC20/ERC20.sol`_.


### `_afterTokenTransfer(address from, address to, uint256 amount)` (internal) (inherited) <a name="ERC20-_afterTokenTransfer-address-address-uint256-" id="ERC20-_afterTokenTransfer-address-address-uint256-"></a>

Hook that is called after any transfer of tokens. This includes
minting and burning.
Calling conditions:
- when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
has been transferred to `to`.
- when `from` is zero, `amount` tokens have been minted for `to`.
- when `to` is zero, `amount` of ``from``'s tokens have been burned.
- `from` and `to` are never both zero.
To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].


_Inherited from `../@openzeppelin/contracts/token/ERC20/ERC20.sol`_.


### `_msgSender() → address` (internal) (inherited) <a name="Context-_msgSender--" id="Context-_msgSender--"></a>




_Inherited from `../@openzeppelin/contracts/utils/Context.sol`_.


### `_msgData() → bytes` (internal) (inherited) <a name="Context-_msgData--" id="Context-_msgData--"></a>




_Inherited from `../@openzeppelin/contracts/utils/Context.sol`_.





