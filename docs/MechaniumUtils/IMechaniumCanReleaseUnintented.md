# `IMechaniumCanReleaseUnintented`


Mechanim can release unintented smart contract interface


**Table of Contents**
- FUNCTIONS
    - [`releaseUnintented`](#IMechaniumCanReleaseUnintented-releaseUnintented-address-address-uint256-)


## FUNCTIONS
### `releaseUnintented(address token, address account, uint256 amount) → bool` (external)

Release unintented tokens sent to smart contract ( only admin role )
This function is used to prevent unintented tokens that got sent to be stuck on the contract

- `token`: The address of the token contract (zero address for claiming native coins).

- `account`: The address of the tokens/coins receiver.

- `amount`: Amount to claim.




