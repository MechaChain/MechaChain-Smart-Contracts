# `IMechaniumCanReleaseUnintented`
**Documentation of `MechaniumUtils/IMechaniumCanReleaseUnintented.sol`.**



Mechanim can release unintented smart contract interface


## TABLE OF CONTENTS

- [Public Functions](#public-functions)
    - [`releaseUnintented`](#IMechaniumCanReleaseUnintented-releaseUnintented-address-address-uint256-) 

- [Internal Functions](#internal-functions)









## PUBLIC FUNCTIONS

### `releaseUnintented(address token, address account, uint256 amount) → bool` (external) <a name="IMechaniumCanReleaseUnintented-releaseUnintented-address-address-uint256-" id="IMechaniumCanReleaseUnintented-releaseUnintented-address-address-uint256-"></a>

Release unintented tokens sent to smart contract ( only admin role )
This function is used to prevent unintented tokens that got sent to be stuck on the contract


Parameters:
- `token`: The address of the token contract (zero address for claiming native coins).

- `account`: The address of the tokens/coins receiver.

- `amount`: Amount to claim.



## INTERNAL FUNCTIONS




