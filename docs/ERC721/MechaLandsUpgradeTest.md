# `MechaLandsUpgradeTest`
**Documentation of `ERC721/MechaLandsUpgradeTest.sol`.**

MechaLandsV2 - TODO




## TABLE OF CONTENTS
- [Events](#events)
    - [`PlanetSetup`](#MechaLandsUpgradeTest-PlanetSetup-uint256-uint16-uint32---string---) 
    - [`PlanetMintRoundSetup`](#MechaLandsUpgradeTest-PlanetMintRoundSetup-uint256-uint256-uint64-uint64-address-bool-uint256---uint256---uint256---) 
    - [`PlanetRevealed`](#MechaLandsUpgradeTest-PlanetRevealed-uint256-string-string-) 
    - [`PlanetBaseURIChanged`](#MechaLandsUpgradeTest-PlanetBaseURIChanged-uint256-string-string-) 
    - [`PlanetBurnableChanged`](#MechaLandsUpgradeTest-PlanetBurnableChanged-uint256-bool-) 
    - [`Withdrawn`](#MechaLandsUpgradeTest-Withdrawn-address-uint256-) 
    - [`TokenWithdrawn`](#MechaLandsUpgradeTest-TokenWithdrawn-address-address-uint256-) 
    - [`Upgraded`](#ERC1967UpgradeUpgradeable-Upgraded-address-) (inherited)
    - [`AdminChanged`](#ERC1967UpgradeUpgradeable-AdminChanged-address-address-) (inherited)
    - [`BeaconUpgraded`](#ERC1967UpgradeUpgradeable-BeaconUpgraded-address-) (inherited)
    - [`OwnershipTransferred`](#OwnableUpgradeable-OwnershipTransferred-address-address-) (inherited)
    - [`Paused`](#PausableUpgradeable-Paused-address-) (inherited)
    - [`Unpaused`](#PausableUpgradeable-Unpaused-address-) (inherited)
    - [`Transfer`](#IERC721Upgradeable-Transfer-address-address-uint256-) (inherited)
    - [`Approval`](#IERC721Upgradeable-Approval-address-address-uint256-) (inherited)
    - [`ApprovalForAll`](#IERC721Upgradeable-ApprovalForAll-address-address-bool-) (inherited)

- [Public Functions](#public-functions)
    - [`constructor`](#MechaLandsUpgradeTest-constructor--) 
    - [`initialize`](#MechaLandsUpgradeTest-initialize--) 
    - [`tellMeWhatIWant`](#MechaLandsUpgradeTest-tellMeWhatIWant--) 
    - [`mint`](#MechaLandsUpgradeTest-mint-uint256-uint256-uint256-) 
    - [`mintWithValidation`](#MechaLandsUpgradeTest-mintWithValidation-uint256-uint256-uint256-uint256-uint256-bytes-) 
    - [`airdrop`](#MechaLandsUpgradeTest-airdrop-address-uint256-uint256-uint256-) 
    - [`setupPlanet`](#MechaLandsUpgradeTest-setupPlanet-uint256-uint16-uint32---string---) 
    - [`revealPlanet`](#MechaLandsUpgradeTest-revealPlanet-uint256-string-string-) 
    - [`setPlanetBaseURI`](#MechaLandsUpgradeTest-setPlanetBaseURI-uint256-string-string-) 
    - [`setPlanetBurnable`](#MechaLandsUpgradeTest-setPlanetBurnable-uint256-bool-) 
    - [`setPlanetDistributor`](#MechaLandsUpgradeTest-setPlanetDistributor-uint256-address-) 
    - [`setupMintRound`](#MechaLandsUpgradeTest-setupMintRound-uint256-uint64-uint64-uint64-address-bool-uint256---uint256---uint256---) 
    - [`pause`](#MechaLandsUpgradeTest-pause--) 
    - [`unpause`](#MechaLandsUpgradeTest-unpause--) 
    - [`burn`](#MechaLandsUpgradeTest-burn-uint256-) 
    - [`withdraw`](#MechaLandsUpgradeTest-withdraw-address-payable-uint256-) 
    - [`withdrawTokens`](#MechaLandsUpgradeTest-withdrawTokens-address-address-uint256-) 
    - [`tokenURI`](#MechaLandsUpgradeTest-tokenURI-uint256-) 
    - [`totalSupply`](#MechaLandsUpgradeTest-totalSupply--) 
    - [`planetSupplyByType`](#MechaLandsUpgradeTest-planetSupplyByType-uint256-uint256-) 
    - [`planetTotalMintedByType`](#MechaLandsUpgradeTest-planetTotalMintedByType-uint256-uint256-) 
    - [`planetNotRevealUriByType`](#MechaLandsUpgradeTest-planetNotRevealUriByType-uint256-uint256-) 
    - [`roundSupplyByType`](#MechaLandsUpgradeTest-roundSupplyByType-uint256-uint256-) 
    - [`roundPriceByType`](#MechaLandsUpgradeTest-roundPriceByType-uint256-uint256-) 
    - [`roundMaxMintByType`](#MechaLandsUpgradeTest-roundMaxMintByType-uint256-uint256-) 
    - [`roundTotalMintedByType`](#MechaLandsUpgradeTest-roundTotalMintedByType-uint256-uint256-) 
    - [`roundTotalMintedByTypeForUser`](#MechaLandsUpgradeTest-roundTotalMintedByTypeForUser-address-uint256-uint256-) 
    - [`roundTotalMintedForUser`](#MechaLandsUpgradeTest-roundTotalMintedForUser-address-uint256-) 
    - [`chainid`](#MechaLandsUpgradeTest-chainid--) 
    - [`receive`](#MechaLandsUpgradeTest-receive--) 
    - [`proxiableUUID`](#UUPSUpgradeable-proxiableUUID--) (inherited)
    - [`upgradeTo`](#UUPSUpgradeable-upgradeTo-address-) (inherited)
    - [`upgradeToAndCall`](#UUPSUpgradeable-upgradeToAndCall-address-bytes-) (inherited)
    - [`owner`](#OwnableUpgradeable-owner--) (inherited)
    - [`renounceOwnership`](#OwnableUpgradeable-renounceOwnership--) (inherited)
    - [`transferOwnership`](#OwnableUpgradeable-transferOwnership-address-) (inherited)
    - [`paused`](#PausableUpgradeable-paused--) (inherited)
    - [`supportsInterface`](#ERC721Upgradeable-supportsInterface-bytes4-) (inherited)
    - [`balanceOf`](#ERC721Upgradeable-balanceOf-address-) (inherited)
    - [`ownerOf`](#ERC721Upgradeable-ownerOf-uint256-) (inherited)
    - [`name`](#ERC721Upgradeable-name--) (inherited)
    - [`symbol`](#ERC721Upgradeable-symbol--) (inherited)
    - [`approve`](#ERC721Upgradeable-approve-address-uint256-) (inherited)
    - [`getApproved`](#ERC721Upgradeable-getApproved-uint256-) (inherited)
    - [`setApprovalForAll`](#ERC721Upgradeable-setApprovalForAll-address-bool-) (inherited)
    - [`isApprovedForAll`](#ERC721Upgradeable-isApprovedForAll-address-address-) (inherited)
    - [`transferFrom`](#ERC721Upgradeable-transferFrom-address-address-uint256-) (inherited)
    - [`safeTransferFrom`](#ERC721Upgradeable-safeTransferFrom-address-address-uint256-) (inherited)
    - [`safeTransferFrom`](#ERC721Upgradeable-safeTransferFrom-address-address-uint256-bytes-) (inherited)

- [Internal Functions](#internal-functions)
    - [`_roundMint`](#MechaLandsUpgradeTest-_roundMint-address-uint256-uint256-uint256-) 
    - [`_safeMint`](#MechaLandsUpgradeTest-_safeMint-address-uint256-uint256-uint256-) 
    - [`_checkSignature`](#MechaLandsUpgradeTest-_checkSignature-address-uint256-uint256-uint256-uint256-bytes-address-) 
    - [`_beforeTokenTransfer`](#MechaLandsUpgradeTest-_beforeTokenTransfer-address-address-uint256-) 
    - [`_authorizeUpgrade`](#MechaLandsUpgradeTest-_authorizeUpgrade-address-) 
    - [`__UUPSUpgradeable_init`](#UUPSUpgradeable-__UUPSUpgradeable_init--) (inherited)
    - [`__UUPSUpgradeable_init_unchained`](#UUPSUpgradeable-__UUPSUpgradeable_init_unchained--) (inherited)
    - [`__ERC1967Upgrade_init`](#ERC1967UpgradeUpgradeable-__ERC1967Upgrade_init--) (inherited)
    - [`__ERC1967Upgrade_init_unchained`](#ERC1967UpgradeUpgradeable-__ERC1967Upgrade_init_unchained--) (inherited)
    - [`_getImplementation`](#ERC1967UpgradeUpgradeable-_getImplementation--) (inherited)
    - [`_upgradeTo`](#ERC1967UpgradeUpgradeable-_upgradeTo-address-) (inherited)
    - [`_upgradeToAndCall`](#ERC1967UpgradeUpgradeable-_upgradeToAndCall-address-bytes-bool-) (inherited)
    - [`_upgradeToAndCallUUPS`](#ERC1967UpgradeUpgradeable-_upgradeToAndCallUUPS-address-bytes-bool-) (inherited)
    - [`_getAdmin`](#ERC1967UpgradeUpgradeable-_getAdmin--) (inherited)
    - [`_changeAdmin`](#ERC1967UpgradeUpgradeable-_changeAdmin-address-) (inherited)
    - [`_getBeacon`](#ERC1967UpgradeUpgradeable-_getBeacon--) (inherited)
    - [`_upgradeBeaconToAndCall`](#ERC1967UpgradeUpgradeable-_upgradeBeaconToAndCall-address-bytes-bool-) (inherited)
    - [`__ReentrancyGuard_init`](#ReentrancyGuardUpgradeable-__ReentrancyGuard_init--) (inherited)
    - [`__ReentrancyGuard_init_unchained`](#ReentrancyGuardUpgradeable-__ReentrancyGuard_init_unchained--) (inherited)
    - [`__Ownable_init`](#OwnableUpgradeable-__Ownable_init--) (inherited)
    - [`__Ownable_init_unchained`](#OwnableUpgradeable-__Ownable_init_unchained--) (inherited)
    - [`_transferOwnership`](#OwnableUpgradeable-_transferOwnership-address-) (inherited)
    - [`__Pausable_init`](#PausableUpgradeable-__Pausable_init--) (inherited)
    - [`__Pausable_init_unchained`](#PausableUpgradeable-__Pausable_init_unchained--) (inherited)
    - [`_pause`](#PausableUpgradeable-_pause--) (inherited)
    - [`_unpause`](#PausableUpgradeable-_unpause--) (inherited)
    - [`__ERC721Burnable_init`](#ERC721BurnableUpgradeable-__ERC721Burnable_init--) (inherited)
    - [`__ERC721Burnable_init_unchained`](#ERC721BurnableUpgradeable-__ERC721Burnable_init_unchained--) (inherited)
    - [`__ERC721_init`](#ERC721Upgradeable-__ERC721_init-string-string-) (inherited)
    - [`__ERC721_init_unchained`](#ERC721Upgradeable-__ERC721_init_unchained-string-string-) (inherited)
    - [`_baseURI`](#ERC721Upgradeable-_baseURI--) (inherited)
    - [`_safeTransfer`](#ERC721Upgradeable-_safeTransfer-address-address-uint256-bytes-) (inherited)
    - [`_exists`](#ERC721Upgradeable-_exists-uint256-) (inherited)
    - [`_isApprovedOrOwner`](#ERC721Upgradeable-_isApprovedOrOwner-address-uint256-) (inherited)
    - [`_safeMint`](#ERC721Upgradeable-_safeMint-address-uint256-) (inherited)
    - [`_safeMint`](#ERC721Upgradeable-_safeMint-address-uint256-bytes-) (inherited)
    - [`_mint`](#ERC721Upgradeable-_mint-address-uint256-) (inherited)
    - [`_burn`](#ERC721Upgradeable-_burn-uint256-) (inherited)
    - [`_transfer`](#ERC721Upgradeable-_transfer-address-address-uint256-) (inherited)
    - [`_approve`](#ERC721Upgradeable-_approve-address-uint256-) (inherited)
    - [`_setApprovalForAll`](#ERC721Upgradeable-_setApprovalForAll-address-address-bool-) (inherited)
    - [`_afterTokenTransfer`](#ERC721Upgradeable-_afterTokenTransfer-address-address-uint256-) (inherited)
    - [`__ERC165_init`](#ERC165Upgradeable-__ERC165_init--) (inherited)
    - [`__ERC165_init_unchained`](#ERC165Upgradeable-__ERC165_init_unchained--) (inherited)
    - [`__Context_init`](#ContextUpgradeable-__Context_init--) (inherited)
    - [`__Context_init_unchained`](#ContextUpgradeable-__Context_init_unchained--) (inherited)
    - [`_msgSender`](#ContextUpgradeable-_msgSender--) (inherited)
    - [`_msgData`](#ContextUpgradeable-_msgData--) (inherited)



- [Modifiers](#modifiers)
    - [`onlyProxy`](#UUPSUpgradeable-onlyProxy--) (inherited)
    - [`notDelegated`](#UUPSUpgradeable-notDelegated--) (inherited)
    - [`nonReentrant`](#ReentrancyGuardUpgradeable-nonReentrant--) (inherited)
    - [`onlyOwner`](#OwnableUpgradeable-onlyOwner--) (inherited)
    - [`whenNotPaused`](#PausableUpgradeable-whenNotPaused--) (inherited)
    - [`whenPaused`](#PausableUpgradeable-whenPaused--) (inherited)
    - [`initializer`](#Initializable-initializer--) (inherited)
    - [`onlyInitializing`](#Initializable-onlyInitializing--) (inherited)

- [Structs](#structs)
    - [`Planet`](#MechaLandsUpgradeTest-Planet) 
    - [`MintRound`](#MechaLandsUpgradeTest-MintRound) 



## EVENTS

### `PlanetSetup(uint256 planetId, uint16 typesNumber, uint32[] supplyPerType, string[] notRevealUriPerType)`  <a name="MechaLandsUpgradeTest-PlanetSetup-uint256-uint16-uint32---string---" id="MechaLandsUpgradeTest-PlanetSetup-uint256-uint16-uint32---string---"></a>
Event emitted when a planet is created or edited





### `PlanetMintRoundSetup(uint256 roundId, uint256 planetId, uint64 startTime, uint64 duration, address validator, bool limitedPerType, uint256[] pricePerType, uint256[] supplyPerType, uint256[] maxMintPerType)`  <a name="MechaLandsUpgradeTest-PlanetMintRoundSetup-uint256-uint256-uint64-uint64-address-bool-uint256---uint256---uint256---" id="MechaLandsUpgradeTest-PlanetMintRoundSetup-uint256-uint256-uint64-uint64-address-bool-uint256---uint256---uint256---"></a>
Event emitted when a mint round of a planet is created or edited





### `PlanetRevealed(uint256 planetId, string baseURI, string baseExtension)`  <a name="MechaLandsUpgradeTest-PlanetRevealed-uint256-string-string-" id="MechaLandsUpgradeTest-PlanetRevealed-uint256-string-string-"></a>
Event emitted when a planet has been revealed





### `PlanetBaseURIChanged(uint256 planetId, string baseURI, string baseExtension)`  <a name="MechaLandsUpgradeTest-PlanetBaseURIChanged-uint256-string-string-" id="MechaLandsUpgradeTest-PlanetBaseURIChanged-uint256-string-string-"></a>
Event emitted when the baseURI of all lands of a planet has been changed





### `PlanetBurnableChanged(uint256 planetId, bool burnable)`  <a name="MechaLandsUpgradeTest-PlanetBurnableChanged-uint256-bool-" id="MechaLandsUpgradeTest-PlanetBurnableChanged-uint256-bool-"></a>
Event emitted when the burnable option of a planet has been changed





### `Withdrawn(address to, uint256 amount)`  <a name="MechaLandsUpgradeTest-Withdrawn-address-uint256-" id="MechaLandsUpgradeTest-Withdrawn-address-uint256-"></a>
Event emitted when native coin were removed from the contract





### `TokenWithdrawn(address to, address token, uint256 amount)`  <a name="MechaLandsUpgradeTest-TokenWithdrawn-address-address-uint256-" id="MechaLandsUpgradeTest-TokenWithdrawn-address-address-uint256-"></a>
Event emitted when some ERC20 were removed from the contract





### `Upgraded(address implementation)` (inherited) <a name="ERC1967UpgradeUpgradeable-Upgraded-address-" id="ERC1967UpgradeUpgradeable-Upgraded-address-"></a>

Emitted when the implementation is upgraded.


_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol`_.


### `AdminChanged(address previousAdmin, address newAdmin)` (inherited) <a name="ERC1967UpgradeUpgradeable-AdminChanged-address-address-" id="ERC1967UpgradeUpgradeable-AdminChanged-address-address-"></a>

Emitted when the admin account has changed.


_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol`_.


### `BeaconUpgraded(address beacon)` (inherited) <a name="ERC1967UpgradeUpgradeable-BeaconUpgraded-address-" id="ERC1967UpgradeUpgradeable-BeaconUpgraded-address-"></a>

Emitted when the beacon is upgraded.


_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol`_.


### `OwnershipTransferred(address previousOwner, address newOwner)` (inherited) <a name="OwnableUpgradeable-OwnershipTransferred-address-address-" id="OwnableUpgradeable-OwnershipTransferred-address-address-"></a>




_Inherited from `../@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol`_.


### `Paused(address account)` (inherited) <a name="PausableUpgradeable-Paused-address-" id="PausableUpgradeable-Paused-address-"></a>

Emitted when the pause is triggered by `account`.


_Inherited from `../@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol`_.


### `Unpaused(address account)` (inherited) <a name="PausableUpgradeable-Unpaused-address-" id="PausableUpgradeable-Unpaused-address-"></a>

Emitted when the pause is lifted by `account`.


_Inherited from `../@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol`_.


### `Transfer(address from, address to, uint256 tokenId)` (inherited) <a name="IERC721Upgradeable-Transfer-address-address-uint256-" id="IERC721Upgradeable-Transfer-address-address-uint256-"></a>

Emitted when `tokenId` token is transferred from `from` to `to`.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol`_.


### `Approval(address owner, address approved, uint256 tokenId)` (inherited) <a name="IERC721Upgradeable-Approval-address-address-uint256-" id="IERC721Upgradeable-Approval-address-address-uint256-"></a>

Emitted when `owner` enables `approved` to manage the `tokenId` token.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol`_.


### `ApprovalForAll(address owner, address operator, bool approved)` (inherited) <a name="IERC721Upgradeable-ApprovalForAll-address-address-bool-" id="IERC721Upgradeable-ApprovalForAll-address-address-bool-"></a>

Emitted when `owner` enables or disables (`approved`) `operator` to manage all of its assets.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol`_.



## PUBLIC FUNCTIONS

### `constructor()` (public) <a name="MechaLandsUpgradeTest-constructor--" id="MechaLandsUpgradeTest-constructor--"></a>






### `initialize()` (public) <a name="MechaLandsUpgradeTest-initialize--" id="MechaLandsUpgradeTest-initialize--"></a>
Initialize contract





### `tellMeWhatIWant() → uint256` (public) <a name="MechaLandsUpgradeTest-tellMeWhatIWant--" id="MechaLandsUpgradeTest-tellMeWhatIWant--"></a>






### `mint(uint256 roundId, uint256 landType, uint256 amount)` (external) <a name="MechaLandsUpgradeTest-mint-uint256-uint256-uint256-" id="MechaLandsUpgradeTest-mint-uint256-uint256-uint256-"></a>
Mint the `amount` of planet land type in a round without validator


Call {MechaLandsV2-_roundMint}.
Requirements:
- Round must not have a validator
- View {MechaLandsV2-_roundMint} requirements



Parameters:
- `roundId`: The mint round index

- `landType`: The type of the land

- `amount`: The number of lands to mint



### `mintWithValidation(uint256 roundId, uint256 landType, uint256 amount, uint256 maxMint, uint256 payloadExpiration, bytes sig)` (external) <a name="MechaLandsUpgradeTest-mintWithValidation-uint256-uint256-uint256-uint256-uint256-bytes-" id="MechaLandsUpgradeTest-mintWithValidation-uint256-uint256-uint256-uint256-uint256-bytes-"></a>
Mint the `amount` of planet land type with the signature of the round validator.


Requirements:
- Total minted for the user during this round must be less than `maxMint`.
  If round is `limitedPerType`, the condition is only for the `landType` total.
- `sig` must be signed by the validator of the round and contains all information to check.
- `payloadExpiration` must be less than the block timestamp.
- View {MechaLandsV2-_roundMint} requirements.



Parameters:
- `roundId`: The mint round index (verified in `sig`)

- `landType`: The type of the land (verified in `sig`)

- `amount`: The number of lands to mint

- `maxMint`: The maximum token that the user is allowed to mint in the round for this landType (verified in `sig`)

- `payloadExpiration`: The maximum timestamp before the signature is considered invalid (verified in `sig`)

- `sig`: The EC signature generated by the round validator



### `airdrop(address wallet, uint256 planetId, uint256 landType, uint256 amount)` (external) <a name="MechaLandsUpgradeTest-airdrop-address-uint256-uint256-uint256-" id="MechaLandsUpgradeTest-airdrop-address-uint256-uint256-uint256-"></a>
Mint the `amount` of planet land type and transfers it to `wallet`.


Call {MechaLandsV2-_safeMint}.
Requirements:
- Only owner or the `distributor` of the planet.
- View {MechaLandsV2-_safeMint} requirements.



Parameters:
- `wallet`: The wallet to transfer new tokens

- `planetId`: The planet index

- `landType`: The type of the land

- `amount`: The number of lands to mint



### `setupPlanet(uint256 planetId, uint16 typesNumber, uint32[] supplyPerType, string[] notRevealUriPerType)` (public) <a name="MechaLandsUpgradeTest-setupPlanet-uint256-uint16-uint32---string---" id="MechaLandsUpgradeTest-setupPlanet-uint256-uint16-uint32---string---"></a>
Create or edit a planet.


Requirements:
- `planetId` must exist or increment `planetsLength` for create one.
- `planetId` can be 0.
- The number of types cannot be lower than the previous one.
- `supplyPerType` and `notRevealUriPerType` must have a length of `typesNumber`.
- A supply can by lower than the number of mint for the same type.



Parameters:
- `planetId`: The index of the planet.

- `typesNumber`: Number of land types for this planet.

- `supplyPerType`: Maximum number of land by type.

- `notRevealUriPerType`: The base token URI by land type (or all the not reveal URI if not revealed).



### `revealPlanet(uint256 planetId, string baseURI, string baseExtension)` (public) <a name="MechaLandsUpgradeTest-revealPlanet-uint256-string-string-" id="MechaLandsUpgradeTest-revealPlanet-uint256-string-string-"></a>
Activate token revelation for a planet and set his base URI


Can be called only once per planet



Parameters:
- `planetId`: The index of the planet.

- `baseURI`: The baseURI for all lands on this planet.

- `baseExtension`: The base extension for the end of token id.



### `setPlanetBaseURI(uint256 planetId, string baseURI, string baseExtension)` (public) <a name="MechaLandsUpgradeTest-setPlanetBaseURI-uint256-string-string-" id="MechaLandsUpgradeTest-setPlanetBaseURI-uint256-string-string-"></a>
Change the base URI and extension of a planet




Parameters:
- `planetId`: The index of the planet.

- `baseURI`: The baseURI for all lands on this planet.

- `baseExtension`: The base extension for the end of token id.



### `setPlanetBurnable(uint256 planetId, bool burnable)` (public) <a name="MechaLandsUpgradeTest-setPlanetBurnable-uint256-bool-" id="MechaLandsUpgradeTest-setPlanetBurnable-uint256-bool-"></a>
Activate burnable option for a planet




Parameters:
- `planetId`: The index of the planet.

- `burnable`: If users are authorized to burn their tokens for this planet.



### `setPlanetDistributor(uint256 planetId, address distributor)` (public) <a name="MechaLandsUpgradeTest-setPlanetDistributor-uint256-address-" id="MechaLandsUpgradeTest-setPlanetDistributor-uint256-address-"></a>
Set a distributor that has the right to perform airdrops for this planet.




Parameters:
- `planetId`: The index of the planet.

- `distributor`: The distributor address.



### `setupMintRound(uint256 roundId, uint64 planetId, uint64 startTime, uint64 duration, address validator, bool limitedPerType, uint256[] pricePerType, uint256[] supplyPerType, uint256[] maxMintPerType)` (public) <a name="MechaLandsUpgradeTest-setupMintRound-uint256-uint64-uint64-uint64-address-bool-uint256---uint256---uint256---" id="MechaLandsUpgradeTest-setupMintRound-uint256-uint64-uint64-uint64-address-bool-uint256---uint256---uint256---"></a>
Create or edit a mint round for a planet


`supplyPerType` of the round can be greater than the one of the planet. In this case,
      it is the supply of the planet that will be taken into account.

Requirements:
- `roundId` must exist or increment `roundsLength` for create one.
- `roundId` can be 0.
- The number of types cannot be lower than the previous one.
- `supplyPerType` and `pricePerType` must have a length of planet's `typesNumber`.
- A supply can by lower than the number of round mint for the same type.
- If `roundId` already exist, we can't change the `planetId` to avoid forgotten minted count mapping.



Parameters:
- `roundId`: The index of the planet mint round.

- `planetId`: The index of the planet.

- `startTime`: The start time of the round in unix seconds timestamp. 0 if not set.

- `duration`: The duration of the round in seconds. 0 if ends at sold out.

- `validator`: The address of the whitelist validator. Can be 'address(0)' for no whitelist.

- `limitedPerType`: If the max mint limitation per wallet is defined par type or far all types.

- `pricePerType`: The price by land type of the round in wei.

- `supplyPerType`: The round supply by land type.

- `maxMintPerType`: The maximum number of tokens that a user can mint per type during the round. If `limitedPerType`, all values should be the same.



### `pause()` (public) <a name="MechaLandsUpgradeTest-pause--" id="MechaLandsUpgradeTest-pause--"></a>
Pause the contract : disables mints, transactions and burns until `unpause`





### `unpause()` (public) <a name="MechaLandsUpgradeTest-unpause--" id="MechaLandsUpgradeTest-unpause--"></a>
Unpause the contract





### `burn(uint256 tokenId)` (public) <a name="MechaLandsUpgradeTest-burn-uint256-" id="MechaLandsUpgradeTest-burn-uint256-"></a>

Burns `tokenId`. See {ERC721-_burn}.

Requirements:
- The planet of `tokenId` must be burnable.
- The caller must own `tokenId` or be an approved operator.




### `withdraw(address payable to, uint256 amount)` (public) <a name="MechaLandsUpgradeTest-withdraw-address-payable-uint256-" id="MechaLandsUpgradeTest-withdraw-address-payable-uint256-"></a>
Withdraw network native coins




Parameters:
- `to`: The address of the tokens/coins receiver.

- `amount`: Amount to claim.



### `withdrawTokens(address to, address token, uint256 amount)` (public) <a name="MechaLandsUpgradeTest-withdrawTokens-address-address-uint256-" id="MechaLandsUpgradeTest-withdrawTokens-address-address-uint256-"></a>
Withdraw ERC20




Parameters:
- `to`: The address of the tokens/coins receiver.

- `token`: The address of the token contract.

- `amount`: Amount to claim.



### `tokenURI(uint256 tokenId) → string` (public) <a name="MechaLandsUpgradeTest-tokenURI-uint256-" id="MechaLandsUpgradeTest-tokenURI-uint256-"></a>
Returns the URI of `tokenId` or the not revealed uri, according to its planet and land type





### `totalSupply() → uint256` (public) <a name="MechaLandsUpgradeTest-totalSupply--" id="MechaLandsUpgradeTest-totalSupply--"></a>
Returns the total amount of tokens minted.





### `planetSupplyByType(uint256 planetId, uint256 landType) → uint256` (public) <a name="MechaLandsUpgradeTest-planetSupplyByType-uint256-uint256-" id="MechaLandsUpgradeTest-planetSupplyByType-uint256-uint256-"></a>
Return the supply of `landType` for `planetId`





### `planetTotalMintedByType(uint256 planetId, uint256 landType) → uint256` (public) <a name="MechaLandsUpgradeTest-planetTotalMintedByType-uint256-uint256-" id="MechaLandsUpgradeTest-planetTotalMintedByType-uint256-uint256-"></a>
Return the total minted of `landType` for `planetId`





### `planetNotRevealUriByType(uint256 planetId, uint256 landType) → string` (public) <a name="MechaLandsUpgradeTest-planetNotRevealUriByType-uint256-uint256-" id="MechaLandsUpgradeTest-planetNotRevealUriByType-uint256-uint256-"></a>
Return the not reveal URI of `landType` for `planetId`





### `roundSupplyByType(uint256 roundId, uint256 landType) → uint256` (public) <a name="MechaLandsUpgradeTest-roundSupplyByType-uint256-uint256-" id="MechaLandsUpgradeTest-roundSupplyByType-uint256-uint256-"></a>
Return the supply of `landType` for `roundId`





### `roundPriceByType(uint256 roundId, uint256 landType) → uint256` (public) <a name="MechaLandsUpgradeTest-roundPriceByType-uint256-uint256-" id="MechaLandsUpgradeTest-roundPriceByType-uint256-uint256-"></a>
Return the price of a single `landType` for `roundId`





### `roundMaxMintByType(uint256 roundId, uint256 landType) → uint256` (public) <a name="MechaLandsUpgradeTest-roundMaxMintByType-uint256-uint256-" id="MechaLandsUpgradeTest-roundMaxMintByType-uint256-uint256-"></a>
Return the maximum number of `landType` tokens that a user can mint for `roundId`





### `roundTotalMintedByType(uint256 roundId, uint256 landType) → uint256` (public) <a name="MechaLandsUpgradeTest-roundTotalMintedByType-uint256-uint256-" id="MechaLandsUpgradeTest-roundTotalMintedByType-uint256-uint256-"></a>
Return the total minted of `landType` for `roundId`





### `roundTotalMintedByTypeForUser(address user, uint256 roundId, uint256 landType) → uint256` (public) <a name="MechaLandsUpgradeTest-roundTotalMintedByTypeForUser-address-uint256-uint256-" id="MechaLandsUpgradeTest-roundTotalMintedByTypeForUser-address-uint256-uint256-"></a>
Return the total minted of `landType` for `user` in `roundId`





### `roundTotalMintedForUser(address user, uint256 roundId) → uint256` (public) <a name="MechaLandsUpgradeTest-roundTotalMintedForUser-address-uint256-" id="MechaLandsUpgradeTest-roundTotalMintedForUser-address-uint256-"></a>
Return the total minted for `user` in `roundId` for all lands





### `chainid() → uint256` (public) <a name="MechaLandsUpgradeTest-chainid--" id="MechaLandsUpgradeTest-chainid--"></a>






### `receive()` (external) <a name="MechaLandsUpgradeTest-receive--" id="MechaLandsUpgradeTest-receive--"></a>






### `proxiableUUID() → bytes32` (external) (inherited)<a name="UUPSUpgradeable-proxiableUUID--" id="UUPSUpgradeable-proxiableUUID--"></a>

Implementation of the ERC1822 {proxiableUUID} function. This returns the storage slot used by the
implementation. It is used to validate that the this implementation remains valid after an upgrade.
IMPORTANT: A proxy pointing at a proxiable contract should not be considered proxiable itself, because this risks
bricking a proxy that upgrades to it, by delegating to itself until out of gas. Thus it is critical that this
function revert if invoked through a proxy. This is guaranteed by the `notDelegated` modifier.


_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol`_.


### `upgradeTo(address newImplementation)` (external) (inherited)<a name="UUPSUpgradeable-upgradeTo-address-" id="UUPSUpgradeable-upgradeTo-address-"></a>

Upgrade the implementation of the proxy to `newImplementation`.
Calls {_authorizeUpgrade}.
Emits an {Upgraded} event.


_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol`_.


### `upgradeToAndCall(address newImplementation, bytes data)` (external) (inherited)<a name="UUPSUpgradeable-upgradeToAndCall-address-bytes-" id="UUPSUpgradeable-upgradeToAndCall-address-bytes-"></a>

Upgrade the implementation of the proxy to `newImplementation`, and subsequently execute the function call
encoded in `data`.
Calls {_authorizeUpgrade}.
Emits an {Upgraded} event.


_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol`_.


### `owner() → address` (public) (inherited)<a name="OwnableUpgradeable-owner--" id="OwnableUpgradeable-owner--"></a>

Returns the address of the current owner.


_Inherited from `../@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol`_.


### `renounceOwnership()` (public) (inherited)<a name="OwnableUpgradeable-renounceOwnership--" id="OwnableUpgradeable-renounceOwnership--"></a>

Leaves the contract without owner. It will not be possible to call
`onlyOwner` functions anymore. Can only be called by the current owner.
NOTE: Renouncing ownership will leave the contract without an owner,
thereby removing any functionality that is only available to the owner.


_Inherited from `../@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol`_.


### `transferOwnership(address newOwner)` (public) (inherited)<a name="OwnableUpgradeable-transferOwnership-address-" id="OwnableUpgradeable-transferOwnership-address-"></a>

Transfers ownership of the contract to a new account (`newOwner`).
Can only be called by the current owner.


_Inherited from `../@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol`_.


### `paused() → bool` (public) (inherited)<a name="PausableUpgradeable-paused--" id="PausableUpgradeable-paused--"></a>

Returns true if the contract is paused, and false otherwise.


_Inherited from `../@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol`_.


### `supportsInterface(bytes4 interfaceId) → bool` (public) (inherited)<a name="ERC721Upgradeable-supportsInterface-bytes4-" id="ERC721Upgradeable-supportsInterface-bytes4-"></a>

See {IERC165-supportsInterface}.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `balanceOf(address owner) → uint256` (public) (inherited)<a name="ERC721Upgradeable-balanceOf-address-" id="ERC721Upgradeable-balanceOf-address-"></a>

See {IERC721-balanceOf}.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `ownerOf(uint256 tokenId) → address` (public) (inherited)<a name="ERC721Upgradeable-ownerOf-uint256-" id="ERC721Upgradeable-ownerOf-uint256-"></a>

See {IERC721-ownerOf}.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `name() → string` (public) (inherited)<a name="ERC721Upgradeable-name--" id="ERC721Upgradeable-name--"></a>

See {IERC721Metadata-name}.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `symbol() → string` (public) (inherited)<a name="ERC721Upgradeable-symbol--" id="ERC721Upgradeable-symbol--"></a>

See {IERC721Metadata-symbol}.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `approve(address to, uint256 tokenId)` (public) (inherited)<a name="ERC721Upgradeable-approve-address-uint256-" id="ERC721Upgradeable-approve-address-uint256-"></a>

See {IERC721-approve}.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `getApproved(uint256 tokenId) → address` (public) (inherited)<a name="ERC721Upgradeable-getApproved-uint256-" id="ERC721Upgradeable-getApproved-uint256-"></a>

See {IERC721-getApproved}.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `setApprovalForAll(address operator, bool approved)` (public) (inherited)<a name="ERC721Upgradeable-setApprovalForAll-address-bool-" id="ERC721Upgradeable-setApprovalForAll-address-bool-"></a>

See {IERC721-setApprovalForAll}.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `isApprovedForAll(address owner, address operator) → bool` (public) (inherited)<a name="ERC721Upgradeable-isApprovedForAll-address-address-" id="ERC721Upgradeable-isApprovedForAll-address-address-"></a>

See {IERC721-isApprovedForAll}.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `transferFrom(address from, address to, uint256 tokenId)` (public) (inherited)<a name="ERC721Upgradeable-transferFrom-address-address-uint256-" id="ERC721Upgradeable-transferFrom-address-address-uint256-"></a>

See {IERC721-transferFrom}.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `safeTransferFrom(address from, address to, uint256 tokenId)` (public) (inherited)<a name="ERC721Upgradeable-safeTransferFrom-address-address-uint256-" id="ERC721Upgradeable-safeTransferFrom-address-address-uint256-"></a>

See {IERC721-safeTransferFrom}.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `safeTransferFrom(address from, address to, uint256 tokenId, bytes _data)` (public) (inherited)<a name="ERC721Upgradeable-safeTransferFrom-address-address-uint256-bytes-" id="ERC721Upgradeable-safeTransferFrom-address-address-uint256-bytes-"></a>

See {IERC721-safeTransferFrom}.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


## INTERNAL FUNCTIONS

### `_roundMint(address wallet, uint256 roundId, uint256 landType, uint256 amount)` (internal)  <a name="MechaLandsUpgradeTest-_roundMint-address-uint256-uint256-uint256-" id="MechaLandsUpgradeTest-_roundMint-address-uint256-uint256-uint256-"></a>
Safely mint the `amount` of planet land type for `wallet` in a `round`


Call {MechaLandsV2-_safeMint}.
Requirements:
- round must be active
- msg.value must contain the price
- The supply of the round for the land type must not be exceeded with amount
- View {MechaLandsV2-_safeMint} Requirements

Increase `totalMintedPerType` and `totalMintedPerTypePerUser` of the round



Parameters:
- `wallet`: The wallet to transfer new tokens

- `roundId`: The mint round index

- `landType`: The type of the land

- `amount`: The number of lands to mint



### `_safeMint(address wallet, uint256 planetId, uint256 landType, uint256 amount)` (internal)  <a name="MechaLandsUpgradeTest-_safeMint-address-uint256-uint256-uint256-" id="MechaLandsUpgradeTest-_safeMint-address-uint256-uint256-uint256-"></a>
Safely mint the `amount` of planet land type for `wallet`


Requirements:
- `amount` must be above 0
- `landType` must exist
- The supply of the planet's land type must not be exceeded with amount

Increase `totalMintedPerType` of the planet



Parameters:
- `wallet`: The wallet to transfer new tokens

- `planetId`: The planet index

- `landType`: The type of the land

- `amount`: The number of lands to mint



### `_checkSignature(address wallet, uint256 payloadExpiration, uint256 maxMint, uint256 landType, uint256 roundId, bytes sig, address signer)` (internal)  <a name="MechaLandsUpgradeTest-_checkSignature-address-uint256-uint256-uint256-uint256-bytes-address-" id="MechaLandsUpgradeTest-_checkSignature-address-uint256-uint256-uint256-uint256-bytes-address-"></a>
Reverts if the data does not correspond to the signature, to the correct validator or if it has expired


Requirements:
- `payloadExpiration` must be less than the block timestamp
- `sig` must be a hash of the concatenation of `wallet`, `payloadExpiration`, contract's address and contract's chainid
- `sig` must be signed by `signer`



Parameters:
- `wallet`: The user wallet

- `payloadExpiration`: The maximum timestamp before the signature is considered invalid

- `maxMint`: The maximum token that the user is allowed to mint in the round

- `landType`: The landType that is allowed to mint

- `roundId`: The roundId that is allowed to mint

- `sig`: The EC signature generated by the signatory

- `signer`: The address that is supposed to be the signatory



### `_beforeTokenTransfer(address from, address to, uint256 tokenId)` (internal)  <a name="MechaLandsUpgradeTest-_beforeTokenTransfer-address-address-uint256-" id="MechaLandsUpgradeTest-_beforeTokenTransfer-address-address-uint256-"></a>






### `_authorizeUpgrade(address newImplementation)` (internal)  <a name="MechaLandsUpgradeTest-_authorizeUpgrade-address-" id="MechaLandsUpgradeTest-_authorizeUpgrade-address-"></a>






### `__UUPSUpgradeable_init()` (internal) (inherited) <a name="UUPSUpgradeable-__UUPSUpgradeable_init--" id="UUPSUpgradeable-__UUPSUpgradeable_init--"></a>




_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol`_.


### `__UUPSUpgradeable_init_unchained()` (internal) (inherited) <a name="UUPSUpgradeable-__UUPSUpgradeable_init_unchained--" id="UUPSUpgradeable-__UUPSUpgradeable_init_unchained--"></a>




_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol`_.


### `__ERC1967Upgrade_init()` (internal) (inherited) <a name="ERC1967UpgradeUpgradeable-__ERC1967Upgrade_init--" id="ERC1967UpgradeUpgradeable-__ERC1967Upgrade_init--"></a>




_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol`_.


### `__ERC1967Upgrade_init_unchained()` (internal) (inherited) <a name="ERC1967UpgradeUpgradeable-__ERC1967Upgrade_init_unchained--" id="ERC1967UpgradeUpgradeable-__ERC1967Upgrade_init_unchained--"></a>




_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol`_.


### `_getImplementation() → address` (internal) (inherited) <a name="ERC1967UpgradeUpgradeable-_getImplementation--" id="ERC1967UpgradeUpgradeable-_getImplementation--"></a>

Returns the current implementation address.


_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol`_.


### `_upgradeTo(address newImplementation)` (internal) (inherited) <a name="ERC1967UpgradeUpgradeable-_upgradeTo-address-" id="ERC1967UpgradeUpgradeable-_upgradeTo-address-"></a>

Perform implementation upgrade
Emits an {Upgraded} event.


_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol`_.


### `_upgradeToAndCall(address newImplementation, bytes data, bool forceCall)` (internal) (inherited) <a name="ERC1967UpgradeUpgradeable-_upgradeToAndCall-address-bytes-bool-" id="ERC1967UpgradeUpgradeable-_upgradeToAndCall-address-bytes-bool-"></a>

Perform implementation upgrade with additional setup call.
Emits an {Upgraded} event.


_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol`_.


### `_upgradeToAndCallUUPS(address newImplementation, bytes data, bool forceCall)` (internal) (inherited) <a name="ERC1967UpgradeUpgradeable-_upgradeToAndCallUUPS-address-bytes-bool-" id="ERC1967UpgradeUpgradeable-_upgradeToAndCallUUPS-address-bytes-bool-"></a>

Perform implementation upgrade with security checks for UUPS proxies, and additional setup call.
Emits an {Upgraded} event.


_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol`_.


### `_getAdmin() → address` (internal) (inherited) <a name="ERC1967UpgradeUpgradeable-_getAdmin--" id="ERC1967UpgradeUpgradeable-_getAdmin--"></a>

Returns the current admin.


_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol`_.


### `_changeAdmin(address newAdmin)` (internal) (inherited) <a name="ERC1967UpgradeUpgradeable-_changeAdmin-address-" id="ERC1967UpgradeUpgradeable-_changeAdmin-address-"></a>

Changes the admin of the proxy.
Emits an {AdminChanged} event.


_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol`_.


### `_getBeacon() → address` (internal) (inherited) <a name="ERC1967UpgradeUpgradeable-_getBeacon--" id="ERC1967UpgradeUpgradeable-_getBeacon--"></a>

Returns the current beacon.


_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol`_.


### `_upgradeBeaconToAndCall(address newBeacon, bytes data, bool forceCall)` (internal) (inherited) <a name="ERC1967UpgradeUpgradeable-_upgradeBeaconToAndCall-address-bytes-bool-" id="ERC1967UpgradeUpgradeable-_upgradeBeaconToAndCall-address-bytes-bool-"></a>

Perform beacon upgrade with additional setup call. Note: This upgrades the address of the beacon, it does
not upgrade the implementation contained in the beacon (see {UpgradeableBeacon-_setImplementation} for that).
Emits a {BeaconUpgraded} event.


_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol`_.


### `__ReentrancyGuard_init()` (internal) (inherited) <a name="ReentrancyGuardUpgradeable-__ReentrancyGuard_init--" id="ReentrancyGuardUpgradeable-__ReentrancyGuard_init--"></a>




_Inherited from `../@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol`_.


### `__ReentrancyGuard_init_unchained()` (internal) (inherited) <a name="ReentrancyGuardUpgradeable-__ReentrancyGuard_init_unchained--" id="ReentrancyGuardUpgradeable-__ReentrancyGuard_init_unchained--"></a>




_Inherited from `../@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol`_.


### `__Ownable_init()` (internal) (inherited) <a name="OwnableUpgradeable-__Ownable_init--" id="OwnableUpgradeable-__Ownable_init--"></a>

Initializes the contract setting the deployer as the initial owner.


_Inherited from `../@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol`_.


### `__Ownable_init_unchained()` (internal) (inherited) <a name="OwnableUpgradeable-__Ownable_init_unchained--" id="OwnableUpgradeable-__Ownable_init_unchained--"></a>




_Inherited from `../@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol`_.


### `_transferOwnership(address newOwner)` (internal) (inherited) <a name="OwnableUpgradeable-_transferOwnership-address-" id="OwnableUpgradeable-_transferOwnership-address-"></a>

Transfers ownership of the contract to a new account (`newOwner`).
Internal function without access restriction.


_Inherited from `../@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol`_.


### `__Pausable_init()` (internal) (inherited) <a name="PausableUpgradeable-__Pausable_init--" id="PausableUpgradeable-__Pausable_init--"></a>

Initializes the contract in unpaused state.


_Inherited from `../@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol`_.


### `__Pausable_init_unchained()` (internal) (inherited) <a name="PausableUpgradeable-__Pausable_init_unchained--" id="PausableUpgradeable-__Pausable_init_unchained--"></a>




_Inherited from `../@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol`_.


### `_pause()` (internal) (inherited) <a name="PausableUpgradeable-_pause--" id="PausableUpgradeable-_pause--"></a>

Triggers stopped state.
Requirements:
- The contract must not be paused.


_Inherited from `../@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol`_.


### `_unpause()` (internal) (inherited) <a name="PausableUpgradeable-_unpause--" id="PausableUpgradeable-_unpause--"></a>

Returns to normal state.
Requirements:
- The contract must be paused.


_Inherited from `../@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol`_.


### `__ERC721Burnable_init()` (internal) (inherited) <a name="ERC721BurnableUpgradeable-__ERC721Burnable_init--" id="ERC721BurnableUpgradeable-__ERC721Burnable_init--"></a>




_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol`_.


### `__ERC721Burnable_init_unchained()` (internal) (inherited) <a name="ERC721BurnableUpgradeable-__ERC721Burnable_init_unchained--" id="ERC721BurnableUpgradeable-__ERC721Burnable_init_unchained--"></a>




_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol`_.


### `__ERC721_init(string name_, string symbol_)` (internal) (inherited) <a name="ERC721Upgradeable-__ERC721_init-string-string-" id="ERC721Upgradeable-__ERC721_init-string-string-"></a>

Initializes the contract by setting a `name` and a `symbol` to the token collection.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `__ERC721_init_unchained(string name_, string symbol_)` (internal) (inherited) <a name="ERC721Upgradeable-__ERC721_init_unchained-string-string-" id="ERC721Upgradeable-__ERC721_init_unchained-string-string-"></a>




_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `_baseURI() → string` (internal) (inherited) <a name="ERC721Upgradeable-_baseURI--" id="ERC721Upgradeable-_baseURI--"></a>

Base URI for computing {tokenURI}. If set, the resulting URI for each
token will be the concatenation of the `baseURI` and the `tokenId`. Empty
by default, can be overriden in child contracts.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `_safeTransfer(address from, address to, uint256 tokenId, bytes _data)` (internal) (inherited) <a name="ERC721Upgradeable-_safeTransfer-address-address-uint256-bytes-" id="ERC721Upgradeable-_safeTransfer-address-address-uint256-bytes-"></a>

Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
are aware of the ERC721 protocol to prevent tokens from being forever locked.
`_data` is additional data, it has no specified format and it is sent in call to `to`.
This internal function is equivalent to {safeTransferFrom}, and can be used to e.g.
implement alternative mechanisms to perform token transfer, such as signature-based.
Requirements:
- `from` cannot be the zero address.
- `to` cannot be the zero address.
- `tokenId` token must exist and be owned by `from`.
- If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
Emits a {Transfer} event.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `_exists(uint256 tokenId) → bool` (internal) (inherited) <a name="ERC721Upgradeable-_exists-uint256-" id="ERC721Upgradeable-_exists-uint256-"></a>

Returns whether `tokenId` exists.
Tokens can be managed by their owner or approved accounts via {approve} or {setApprovalForAll}.
Tokens start existing when they are minted (`_mint`),
and stop existing when they are burned (`_burn`).


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `_isApprovedOrOwner(address spender, uint256 tokenId) → bool` (internal) (inherited) <a name="ERC721Upgradeable-_isApprovedOrOwner-address-uint256-" id="ERC721Upgradeable-_isApprovedOrOwner-address-uint256-"></a>

Returns whether `spender` is allowed to manage `tokenId`.
Requirements:
- `tokenId` must exist.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `_safeMint(address to, uint256 tokenId)` (internal) (inherited) <a name="ERC721Upgradeable-_safeMint-address-uint256-" id="ERC721Upgradeable-_safeMint-address-uint256-"></a>

Safely mints `tokenId` and transfers it to `to`.
Requirements:
- `tokenId` must not exist.
- If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
Emits a {Transfer} event.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `_safeMint(address to, uint256 tokenId, bytes _data)` (internal) (inherited) <a name="ERC721Upgradeable-_safeMint-address-uint256-bytes-" id="ERC721Upgradeable-_safeMint-address-uint256-bytes-"></a>

Same as {xref-ERC721-_safeMint-address-uint256-}[`_safeMint`], with an additional `data` parameter which is
forwarded in {IERC721Receiver-onERC721Received} to contract recipients.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `_mint(address to, uint256 tokenId)` (internal) (inherited) <a name="ERC721Upgradeable-_mint-address-uint256-" id="ERC721Upgradeable-_mint-address-uint256-"></a>

Mints `tokenId` and transfers it to `to`.
WARNING: Usage of this method is discouraged, use {_safeMint} whenever possible
Requirements:
- `tokenId` must not exist.
- `to` cannot be the zero address.
Emits a {Transfer} event.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `_burn(uint256 tokenId)` (internal) (inherited) <a name="ERC721Upgradeable-_burn-uint256-" id="ERC721Upgradeable-_burn-uint256-"></a>

Destroys `tokenId`.
The approval is cleared when the token is burned.
Requirements:
- `tokenId` must exist.
Emits a {Transfer} event.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `_transfer(address from, address to, uint256 tokenId)` (internal) (inherited) <a name="ERC721Upgradeable-_transfer-address-address-uint256-" id="ERC721Upgradeable-_transfer-address-address-uint256-"></a>

Transfers `tokenId` from `from` to `to`.
 As opposed to {transferFrom}, this imposes no restrictions on msg.sender.
Requirements:
- `to` cannot be the zero address.
- `tokenId` token must be owned by `from`.
Emits a {Transfer} event.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `_approve(address to, uint256 tokenId)` (internal) (inherited) <a name="ERC721Upgradeable-_approve-address-uint256-" id="ERC721Upgradeable-_approve-address-uint256-"></a>

Approve `to` to operate on `tokenId`
Emits a {Approval} event.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `_setApprovalForAll(address owner, address operator, bool approved)` (internal) (inherited) <a name="ERC721Upgradeable-_setApprovalForAll-address-address-bool-" id="ERC721Upgradeable-_setApprovalForAll-address-address-bool-"></a>

Approve `operator` to operate on all of `owner` tokens
Emits a {ApprovalForAll} event.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `_afterTokenTransfer(address from, address to, uint256 tokenId)` (internal) (inherited) <a name="ERC721Upgradeable-_afterTokenTransfer-address-address-uint256-" id="ERC721Upgradeable-_afterTokenTransfer-address-address-uint256-"></a>

Hook that is called after any transfer of tokens. This includes
minting and burning.
Calling conditions:
- when `from` and `to` are both non-zero.
- `from` and `to` are never both zero.
To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `__ERC165_init()` (internal) (inherited) <a name="ERC165Upgradeable-__ERC165_init--" id="ERC165Upgradeable-__ERC165_init--"></a>




_Inherited from `../@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol`_.


### `__ERC165_init_unchained()` (internal) (inherited) <a name="ERC165Upgradeable-__ERC165_init_unchained--" id="ERC165Upgradeable-__ERC165_init_unchained--"></a>




_Inherited from `../@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol`_.


### `__Context_init()` (internal) (inherited) <a name="ContextUpgradeable-__Context_init--" id="ContextUpgradeable-__Context_init--"></a>




_Inherited from `../@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol`_.


### `__Context_init_unchained()` (internal) (inherited) <a name="ContextUpgradeable-__Context_init_unchained--" id="ContextUpgradeable-__Context_init_unchained--"></a>




_Inherited from `../@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol`_.


### `_msgSender() → address` (internal) (inherited) <a name="ContextUpgradeable-_msgSender--" id="ContextUpgradeable-_msgSender--"></a>




_Inherited from `../@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol`_.


### `_msgData() → bytes` (internal) (inherited) <a name="ContextUpgradeable-_msgData--" id="ContextUpgradeable-_msgData--"></a>




_Inherited from `../@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol`_.



## MODIFIERS

### `onlyProxy()` (inherited) <a name="UUPSUpgradeable-onlyProxy--" id="UUPSUpgradeable-onlyProxy--"></a>


Check that the execution is being performed through a delegatecall call and that the execution context is
a proxy contract with an implementation (as defined in ERC1967) pointing to self. This should only be the case
for UUPS and transparent proxies that are using the current contract as their implementation. Execution of a
function through ERC1167 minimal proxies (clones) would not normally pass this test, but is not guaranteed to
fail.


_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol`_.


### `notDelegated()` (inherited) <a name="UUPSUpgradeable-notDelegated--" id="UUPSUpgradeable-notDelegated--"></a>


Check that the execution is not being performed through a delegate call. This allows a function to be
callable on the implementing contract but not through proxies.


_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol`_.


### `nonReentrant()` (inherited) <a name="ReentrancyGuardUpgradeable-nonReentrant--" id="ReentrancyGuardUpgradeable-nonReentrant--"></a>


Prevents a contract from calling itself, directly or indirectly.
Calling a `nonReentrant` function from another `nonReentrant`
function is not supported. It is possible to prevent this from happening
by making the `nonReentrant` function external, and making it call a
`private` function that does the actual work.


_Inherited from `../@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol`_.


### `onlyOwner()` (inherited) <a name="OwnableUpgradeable-onlyOwner--" id="OwnableUpgradeable-onlyOwner--"></a>


Throws if called by any account other than the owner.


_Inherited from `../@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol`_.


### `whenNotPaused()` (inherited) <a name="PausableUpgradeable-whenNotPaused--" id="PausableUpgradeable-whenNotPaused--"></a>


Modifier to make a function callable only when the contract is not paused.
Requirements:
- The contract must not be paused.


_Inherited from `../@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol`_.


### `whenPaused()` (inherited) <a name="PausableUpgradeable-whenPaused--" id="PausableUpgradeable-whenPaused--"></a>


Modifier to make a function callable only when the contract is paused.
Requirements:
- The contract must be paused.


_Inherited from `../@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol`_.


### `initializer()` (inherited) <a name="Initializable-initializer--" id="Initializable-initializer--"></a>


Modifier to protect an initializer function from being invoked twice.


_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol`_.


### `onlyInitializing()` (inherited) <a name="Initializable-onlyInitializing--" id="Initializable-onlyInitializing--"></a>


Modifier to protect an initialization function so that it can only be invoked by functions with the
{initializer} modifier, directly or indirectly.


_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol`_.


## STRUCTS

### `Planet`  <a name="MechaLandsUpgradeTest-Planet" id="MechaLandsUpgradeTest-Planet"></a>
- bool revealed
- bool burnable
- uint16 typesNumber
- string baseURI
- string baseExtension
- address distributor
- mapping(uint256 => uint256) supplyPerType
- mapping(uint256 => uint256) totalMintedPerType
- mapping(uint256 => string) notRevealUriPerType



### `MintRound`  <a name="MechaLandsUpgradeTest-MintRound" id="MechaLandsUpgradeTest-MintRound"></a>
- bool limitedPerType
- uint64 planetId
- uint64 startTime
- uint64 duration
- address validator
- mapping(uint256 => uint256) pricePerType
- mapping(uint256 => uint256) supplyPerType
- mapping(uint256 => uint256) maxMintPerType
- mapping(uint256 => uint256) totalMintedPerType
- mapping(address => uint256) totalMintedPerUser
- mapping(address => mapping(uint256 => uint256)) totalMintedPerTypePerUser



