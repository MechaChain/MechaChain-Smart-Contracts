# `IMechaniumCanReleaseUnintented`


Mechanim can release unintented smart contract interface


**Table of Contents**

- [PUBLIC FUNCTIONS](#public-functions)
    - [`releaseUnintented`](#IMechaniumCanReleaseUnintented-releaseUnintented-address-address-uint256-)

- [PRIVATE FUNCTIONS](#private-functions)







## PUBLIC FUNCTIONS

### `releaseUnintented(address token, address account, uint256 amount) → bool` (external) <span id="IMechaniumCanReleaseUnintented-releaseUnintented-address-address-uint256-"></span>

Release unintented tokens sent to smart contract ( only admin role )
This function is used to prevent unintented tokens that got sent to be stuck on the contract

- `token`: The address of the token contract (zero address for claiming native coins).

- `account`: The address of the tokens/coins receiver.

- `amount`: Amount to claim.

## PRIVATE FUNCTIONS



