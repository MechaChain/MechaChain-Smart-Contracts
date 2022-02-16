# `IMechaniumCanReleaseUnintendedOwnable`


Mechanium can release unintended ( ownable ) smart contract interface


**Table of Contents**

- [PUBLIC FUNCTIONS](#public-functions)
    - [`releaseUnintended`](#IMechaniumCanReleaseUnintendedOwnable-releaseUnintended-address-address-uint256-)

- [PRIVATE FUNCTIONS](#private-functions)







## PUBLIC FUNCTIONS

### `releaseUnintended(address token, address account, uint256 amount) → bool` (external) <span id="IMechaniumCanReleaseUnintendedOwnable-releaseUnintended-address-address-uint256-"></span>

Release unintended tokens sent to smart contract ( only owner )
This function is used to prevent unintended tokens that got sent to be stuck on the contract

- `token`: The address of the token contract (zero address for claiming native coins).

- `account`: The address of the tokens/coins receiver.

- `amount`: Amount to claim.

## PRIVATE FUNCTIONS



