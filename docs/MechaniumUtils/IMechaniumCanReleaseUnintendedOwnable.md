# `IMechaniumCanReleaseUnintendedOwnable`
**Documentation of `MechaniumUtils/IMechaniumCanReleaseUnintendedOwnable.sol`.**



Mechanium can release unintended ( ownable ) smart contract interface


## TABLE OF CONTENTS

- [Public Functions](#public-functions)
    - [`releaseUnintended`](#IMechaniumCanReleaseUnintendedOwnable-releaseUnintended-address-address-uint256-) 

- [Internal Functions](#internal-functions)









## PUBLIC FUNCTIONS

### `releaseUnintended(address token, address account, uint256 amount) → bool` (external) <a name="IMechaniumCanReleaseUnintendedOwnable-releaseUnintended-address-address-uint256-" id="IMechaniumCanReleaseUnintendedOwnable-releaseUnintended-address-address-uint256-"></a>

Release unintended tokens sent to smart contract ( only owner )
This function is used to prevent unintended tokens that got sent to be stuck on the contract


Parameters:
- `token`: The address of the token contract (zero address for claiming native coins).

- `account`: The address of the tokens/coins receiver.

- `amount`: Amount to claim.



## INTERNAL FUNCTIONS




