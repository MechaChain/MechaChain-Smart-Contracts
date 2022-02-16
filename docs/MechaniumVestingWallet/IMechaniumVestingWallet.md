# `IMechaniumVestingWallet`
**Documentation of `MechaniumVestingWallet/IMechaniumVestingWallet.sol`.**



Mechanim vesting wallet smart contract interface


## TABLE OF CONTENTS

- [Public Functions](#public-functions)
    - [`transfer`](#IMechaniumVestingWallet-transfer-address-uint256-) 
    - [`unlockableTokens`](#IMechaniumVestingWallet-unlockableTokens--) 
    - [`token`](#IMechaniumVestingWallet-token--) 
    - [`tokenBalance`](#IMechaniumVestingWallet-tokenBalance--) 
    - [`totalSupply`](#IMechaniumVestingWallet-totalSupply--) 
    - [`totalReleasedTokens`](#IMechaniumVestingWallet-totalReleasedTokens--) 
    - [`vestingPerClock`](#IMechaniumVestingWallet-vestingPerClock--) 
    - [`vestingClockTime`](#IMechaniumVestingWallet-vestingClockTime--) 
    - [`initialVesting`](#IMechaniumVestingWallet-initialVesting--) 
    - [`startTime`](#IMechaniumVestingWallet-startTime--) 

- [Internal Functions](#internal-functions)









## PUBLIC FUNCTIONS

### `transfer(address to, uint256 amount) → bool` (external) <a name="IMechaniumVestingWallet-transfer-address-uint256-" id="IMechaniumVestingWallet-transfer-address-uint256-"></a>
Transfer `amount` unlocked tokens `to` address




### `unlockableTokens() → uint256` (external) <a name="IMechaniumVestingWallet-unlockableTokens--" id="IMechaniumVestingWallet-unlockableTokens--"></a>

Return the number of tokens that can be unlock



### `token() → address` (external) <a name="IMechaniumVestingWallet-token--" id="IMechaniumVestingWallet-token--"></a>

Return the token IERC20



### `tokenBalance() → uint256` (external) <a name="IMechaniumVestingWallet-tokenBalance--" id="IMechaniumVestingWallet-tokenBalance--"></a>

Return the total token hold by the contract



### `totalSupply() → uint256` (external) <a name="IMechaniumVestingWallet-totalSupply--" id="IMechaniumVestingWallet-totalSupply--"></a>

Get total tokens supply



### `totalReleasedTokens() → uint256` (external) <a name="IMechaniumVestingWallet-totalReleasedTokens--" id="IMechaniumVestingWallet-totalReleasedTokens--"></a>

Return the total tokens that have been transferred



### `vestingPerClock() → uint256` (external) <a name="IMechaniumVestingWallet-vestingPerClock--" id="IMechaniumVestingWallet-vestingPerClock--"></a>

Return the percentage of unlocked tokens per `vestingClockTime()` once the vesting schedule has started



### `vestingClockTime() → uint256` (external) <a name="IMechaniumVestingWallet-vestingClockTime--" id="IMechaniumVestingWallet-vestingClockTime--"></a>

Return the number of seconds between two `vestingPerClock()`



### `initialVesting() → uint256` (external) <a name="IMechaniumVestingWallet-initialVesting--" id="IMechaniumVestingWallet-initialVesting--"></a>

Return the percentage of unlocked tokens at the beginning of the vesting schedule



### `startTime() → uint256` (external) <a name="IMechaniumVestingWallet-startTime--" id="IMechaniumVestingWallet-startTime--"></a>

Return vesting schedule start time



## INTERNAL FUNCTIONS




