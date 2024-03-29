# `MechaPilots2219V2`
**Documentation of `ERC721/draft-MechaPilots2219V2.sol`.**

MechaPilots2219 - TODO




## TABLE OF CONTENTS
- [Events](#events)
    - [`MintRoundSetup`](#MechaPilots2219V1-MintRoundSetup-uint256-uint32-2--uint64-uint64-address-uint256-) (inherited)
    - [`TokenRevealed`](#MechaPilots2219V1-TokenRevealed-uint256-address-string-) (inherited)
    - [`BaseURIChanged`](#MechaPilots2219V1-BaseURIChanged-string-) (inherited)
    - [`BaseExtensionChanged`](#MechaPilots2219V1-BaseExtensionChanged-string-) (inherited)
    - [`BurnableChanged`](#MechaPilots2219V1-BurnableChanged-bool-) (inherited)
    - [`MaxMintsPerWalletChanged`](#MechaPilots2219V1-MaxMintsPerWalletChanged-uint256-) (inherited)
    - [`Withdrawn`](#MechaPilots2219V1-Withdrawn-address-uint256-) (inherited)
    - [`TokenWithdrawn`](#MechaPilots2219V1-TokenWithdrawn-address-address-uint256-) (inherited)
    - [`Upgraded`](#ERC1967UpgradeUpgradeable-Upgraded-address-) (inherited)
    - [`AdminChanged`](#ERC1967UpgradeUpgradeable-AdminChanged-address-address-) (inherited)
    - [`BeaconUpgraded`](#ERC1967UpgradeUpgradeable-BeaconUpgraded-address-) (inherited)
    - [`OperatorFilterRegistryAddressUpdated`](#UpdatableOperatorFiltererUpgradeable-OperatorFilterRegistryAddressUpdated-address-) (inherited)
    - [`OwnershipTransferred`](#OwnableUpgradeable-OwnershipTransferred-address-address-) (inherited)
    - [`Paused`](#PausableUpgradeable-Paused-address-) (inherited)
    - [`Unpaused`](#PausableUpgradeable-Unpaused-address-) (inherited)
    - [`Transfer`](#IERC721Upgradeable-Transfer-address-address-uint256-) (inherited)
    - [`Approval`](#IERC721Upgradeable-Approval-address-address-uint256-) (inherited)
    - [`ApprovalForAll`](#IERC721Upgradeable-ApprovalForAll-address-address-bool-) (inherited)
    - [`RoleAdminChanged`](#IAccessControlUpgradeable-RoleAdminChanged-bytes32-bytes32-bytes32-) (inherited)
    - [`RoleGranted`](#IAccessControlUpgradeable-RoleGranted-bytes32-address-address-) (inherited)
    - [`RoleRevoked`](#IAccessControlUpgradeable-RoleRevoked-bytes32-address-address-) (inherited)
    - [`Initialized`](#Initializable-Initialized-uint8-) (inherited)

- [Public Functions](#public-functions)
    - [`initializeV2`](#MechaPilots2219V2-initializeV2--) 
    - [`constructor`](#MechaPilots2219V1-constructor--) (inherited)
    - [`initialize`](#MechaPilots2219V1-initialize--) (inherited)
    - [`mint`](#MechaPilots2219V1-mint-uint256-uint256-uint256-) (inherited)
    - [`mintWithValidation`](#MechaPilots2219V1-mintWithValidation-uint256-uint256-uint256-uint256-uint256-bytes-) (inherited)
    - [`revealToken`](#MechaPilots2219V1-revealToken-uint256-string-uint256-bytes-) (inherited)
    - [`setTokenURI`](#MechaPilots2219V1-setTokenURI-uint256-string-) (inherited)
    - [`setTokenURIPerBatch`](#MechaPilots2219V1-setTokenURIPerBatch-uint256---string---) (inherited)
    - [`airdrop`](#MechaPilots2219V1-airdrop-address-uint256-uint256-) (inherited)
    - [`setupMintRound`](#MechaPilots2219V1-setupMintRound-uint256-uint32-2--uint64-uint64-address-uint256-) (inherited)
    - [`pause`](#MechaPilots2219V1-pause--) (inherited)
    - [`unpause`](#MechaPilots2219V1-unpause--) (inherited)
    - [`setBaseURI`](#MechaPilots2219V1-setBaseURI-string-) (inherited)
    - [`setBaseExtension`](#MechaPilots2219V1-setBaseExtension-string-) (inherited)
    - [`setBurnable`](#MechaPilots2219V1-setBurnable-bool-) (inherited)
    - [`setMaxMintsPerWallet`](#MechaPilots2219V1-setMaxMintsPerWallet-uint256-) (inherited)
    - [`burn`](#MechaPilots2219V1-burn-uint256-) (inherited)
    - [`withdraw`](#MechaPilots2219V1-withdraw-address-payable-uint256-) (inherited)
    - [`withdrawTokens`](#MechaPilots2219V1-withdrawTokens-address-address-uint256-) (inherited)
    - [`setDefaultRoyalty`](#MechaPilots2219V1-setDefaultRoyalty-address-uint96-) (inherited)
    - [`deleteDefaultRoyalty`](#MechaPilots2219V1-deleteDefaultRoyalty--) (inherited)
    - [`setApprovalForAll`](#MechaPilots2219V1-setApprovalForAll-address-bool-) (inherited)
    - [`approve`](#MechaPilots2219V1-approve-address-uint256-) (inherited)
    - [`transferFrom`](#MechaPilots2219V1-transferFrom-address-address-uint256-) (inherited)
    - [`safeTransferFrom`](#MechaPilots2219V1-safeTransferFrom-address-address-uint256-) (inherited)
    - [`safeTransferFrom`](#MechaPilots2219V1-safeTransferFrom-address-address-uint256-bytes-) (inherited)
    - [`tokenURI`](#MechaPilots2219V1-tokenURI-uint256-) (inherited)
    - [`isRevealed`](#MechaPilots2219V1-isRevealed-uint256-) (inherited)
    - [`rounds`](#MechaPilots2219V1-rounds-uint256-) (inherited)
    - [`totalSupply`](#MechaPilots2219V1-totalSupply--) (inherited)
    - [`totalSupplyByFaction`](#MechaPilots2219V1-totalSupplyByFaction-uint256-) (inherited)
    - [`totalMintedByFaction`](#MechaPilots2219V1-totalMintedByFaction-uint256-) (inherited)
    - [`totalBurnedByFaction`](#MechaPilots2219V1-totalBurnedByFaction-uint256-) (inherited)
    - [`totalMintedBy`](#MechaPilots2219V1-totalMintedBy-address-uint256-) (inherited)
    - [`owner`](#MechaPilots2219V1-owner--) (inherited)
    - [`supportsInterface`](#MechaPilots2219V1-supportsInterface-bytes4-) (inherited)
    - [`receive`](#MechaPilots2219V1-receive--) (inherited)
    - [`proxiableUUID`](#UUPSUpgradeable-proxiableUUID--) (inherited)
    - [`upgradeTo`](#UUPSUpgradeable-upgradeTo-address-) (inherited)
    - [`upgradeToAndCall`](#UUPSUpgradeable-upgradeToAndCall-address-bytes-) (inherited)
    - [`updateOperatorFilterRegistryAddress`](#UpdatableOperatorFiltererUpgradeable-updateOperatorFilterRegistryAddress-address-) (inherited)
    - [`operatorFilterRegistry`](#UpdatableOperatorFiltererUpgradeable-operatorFilterRegistry--) (inherited)
    - [`hasRole`](#AccessControlUpgradeable-hasRole-bytes32-address-) (inherited)
    - [`getRoleAdmin`](#AccessControlUpgradeable-getRoleAdmin-bytes32-) (inherited)
    - [`grantRole`](#AccessControlUpgradeable-grantRole-bytes32-address-) (inherited)
    - [`revokeRole`](#AccessControlUpgradeable-revokeRole-bytes32-address-) (inherited)
    - [`renounceRole`](#AccessControlUpgradeable-renounceRole-bytes32-address-) (inherited)
    - [`renounceOwnership`](#OwnableUpgradeable-renounceOwnership--) (inherited)
    - [`transferOwnership`](#OwnableUpgradeable-transferOwnership-address-) (inherited)
    - [`paused`](#PausableUpgradeable-paused--) (inherited)
    - [`balanceOf`](#ERC721Upgradeable-balanceOf-address-) (inherited)
    - [`ownerOf`](#ERC721Upgradeable-ownerOf-uint256-) (inherited)
    - [`name`](#ERC721Upgradeable-name--) (inherited)
    - [`symbol`](#ERC721Upgradeable-symbol--) (inherited)
    - [`getApproved`](#ERC721Upgradeable-getApproved-uint256-) (inherited)
    - [`isApprovedForAll`](#ERC721Upgradeable-isApprovedForAll-address-address-) (inherited)
    - [`royaltyInfo`](#ERC2981Upgradeable-royaltyInfo-uint256-uint256-) (inherited)

- [Internal Functions](#internal-functions)
    - [`_roundMint`](#MechaPilots2219V1-_roundMint-address-uint256-uint256-uint256-) (inherited)
    - [`_safeMint`](#MechaPilots2219V1-_safeMint-address-uint256-uint256-) (inherited)
    - [`_getRandomToken`](#MechaPilots2219V1-_getRandomToken-address-uint256-) (inherited)
    - [`_checkSignature`](#MechaPilots2219V1-_checkSignature-uint256-bytes-bytes-address-) (inherited)
    - [`_checkSignatureFromRole`](#MechaPilots2219V1-_checkSignatureFromRole-uint256-bytes-bytes-bytes32-) (inherited)
    - [`_burn`](#MechaPilots2219V1-_burn-uint256-) (inherited)
    - [`_beforeTokenTransfer`](#MechaPilots2219V1-_beforeTokenTransfer-address-address-uint256-uint256-) (inherited)
    - [`_authorizeUpgrade`](#MechaPilots2219V1-_authorizeUpgrade-address-) (inherited)
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
    - [`__UpdatableOperatorFiltererUpgradeable_init`](#UpdatableOperatorFiltererUpgradeable-__UpdatableOperatorFiltererUpgradeable_init-address-address-bool-) (inherited)
    - [`_checkFilterOperator`](#UpdatableOperatorFiltererUpgradeable-_checkFilterOperator-address-) (inherited)
    - [`__OperatorFilterer_init`](#OperatorFiltererUpgradeable-__OperatorFilterer_init-address-bool-) (inherited)
    - [`__AccessControl_init`](#AccessControlUpgradeable-__AccessControl_init--) (inherited)
    - [`__AccessControl_init_unchained`](#AccessControlUpgradeable-__AccessControl_init_unchained--) (inherited)
    - [`_checkRole`](#AccessControlUpgradeable-_checkRole-bytes32-) (inherited)
    - [`_checkRole`](#AccessControlUpgradeable-_checkRole-bytes32-address-) (inherited)
    - [`_setupRole`](#AccessControlUpgradeable-_setupRole-bytes32-address-) (inherited)
    - [`_setRoleAdmin`](#AccessControlUpgradeable-_setRoleAdmin-bytes32-bytes32-) (inherited)
    - [`_grantRole`](#AccessControlUpgradeable-_grantRole-bytes32-address-) (inherited)
    - [`_revokeRole`](#AccessControlUpgradeable-_revokeRole-bytes32-address-) (inherited)
    - [`__Ownable_init`](#OwnableUpgradeable-__Ownable_init--) (inherited)
    - [`__Ownable_init_unchained`](#OwnableUpgradeable-__Ownable_init_unchained--) (inherited)
    - [`_checkOwner`](#OwnableUpgradeable-_checkOwner--) (inherited)
    - [`_transferOwnership`](#OwnableUpgradeable-_transferOwnership-address-) (inherited)
    - [`__Pausable_init`](#PausableUpgradeable-__Pausable_init--) (inherited)
    - [`__Pausable_init_unchained`](#PausableUpgradeable-__Pausable_init_unchained--) (inherited)
    - [`_requireNotPaused`](#PausableUpgradeable-_requireNotPaused--) (inherited)
    - [`_requirePaused`](#PausableUpgradeable-_requirePaused--) (inherited)
    - [`_pause`](#PausableUpgradeable-_pause--) (inherited)
    - [`_unpause`](#PausableUpgradeable-_unpause--) (inherited)
    - [`__ERC721Royalty_init`](#ERC721RoyaltyUpgradeable-__ERC721Royalty_init--) (inherited)
    - [`__ERC721Royalty_init_unchained`](#ERC721RoyaltyUpgradeable-__ERC721Royalty_init_unchained--) (inherited)
    - [`__ERC721Burnable_init`](#ERC721BurnableUpgradeable-__ERC721Burnable_init--) (inherited)
    - [`__ERC721Burnable_init_unchained`](#ERC721BurnableUpgradeable-__ERC721Burnable_init_unchained--) (inherited)
    - [`__ERC721_init`](#ERC721Upgradeable-__ERC721_init-string-string-) (inherited)
    - [`__ERC721_init_unchained`](#ERC721Upgradeable-__ERC721_init_unchained-string-string-) (inherited)
    - [`_baseURI`](#ERC721Upgradeable-_baseURI--) (inherited)
    - [`_safeTransfer`](#ERC721Upgradeable-_safeTransfer-address-address-uint256-bytes-) (inherited)
    - [`_ownerOf`](#ERC721Upgradeable-_ownerOf-uint256-) (inherited)
    - [`_exists`](#ERC721Upgradeable-_exists-uint256-) (inherited)
    - [`_isApprovedOrOwner`](#ERC721Upgradeable-_isApprovedOrOwner-address-uint256-) (inherited)
    - [`_safeMint`](#ERC721Upgradeable-_safeMint-address-uint256-) (inherited)
    - [`_safeMint`](#ERC721Upgradeable-_safeMint-address-uint256-bytes-) (inherited)
    - [`_mint`](#ERC721Upgradeable-_mint-address-uint256-) (inherited)
    - [`_transfer`](#ERC721Upgradeable-_transfer-address-address-uint256-) (inherited)
    - [`_approve`](#ERC721Upgradeable-_approve-address-uint256-) (inherited)
    - [`_setApprovalForAll`](#ERC721Upgradeable-_setApprovalForAll-address-address-bool-) (inherited)
    - [`_requireMinted`](#ERC721Upgradeable-_requireMinted-uint256-) (inherited)
    - [`_afterTokenTransfer`](#ERC721Upgradeable-_afterTokenTransfer-address-address-uint256-uint256-) (inherited)
    - [`__unsafe_increaseBalance`](#ERC721Upgradeable-__unsafe_increaseBalance-address-uint256-) (inherited)
    - [`__ERC2981_init`](#ERC2981Upgradeable-__ERC2981_init--) (inherited)
    - [`__ERC2981_init_unchained`](#ERC2981Upgradeable-__ERC2981_init_unchained--) (inherited)
    - [`_feeDenominator`](#ERC2981Upgradeable-_feeDenominator--) (inherited)
    - [`_setDefaultRoyalty`](#ERC2981Upgradeable-_setDefaultRoyalty-address-uint96-) (inherited)
    - [`_deleteDefaultRoyalty`](#ERC2981Upgradeable-_deleteDefaultRoyalty--) (inherited)
    - [`_setTokenRoyalty`](#ERC2981Upgradeable-_setTokenRoyalty-uint256-address-uint96-) (inherited)
    - [`_resetTokenRoyalty`](#ERC2981Upgradeable-_resetTokenRoyalty-uint256-) (inherited)
    - [`__ERC165_init`](#ERC165Upgradeable-__ERC165_init--) (inherited)
    - [`__ERC165_init_unchained`](#ERC165Upgradeable-__ERC165_init_unchained--) (inherited)
    - [`__Context_init`](#ContextUpgradeable-__Context_init--) (inherited)
    - [`__Context_init_unchained`](#ContextUpgradeable-__Context_init_unchained--) (inherited)
    - [`_msgSender`](#ContextUpgradeable-_msgSender--) (inherited)
    - [`_msgData`](#ContextUpgradeable-_msgData--) (inherited)
    - [`_disableInitializers`](#Initializable-_disableInitializers--) (inherited)
    - [`_getInitializedVersion`](#Initializable-_getInitializedVersion--) (inherited)
    - [`_isInitializing`](#Initializable-_isInitializing--) (inherited)



- [Modifiers](#modifiers)
    - [`onlyProxy`](#UUPSUpgradeable-onlyProxy--) (inherited)
    - [`notDelegated`](#UUPSUpgradeable-notDelegated--) (inherited)
    - [`onlyAllowedOperator`](#OperatorFiltererUpgradeable-onlyAllowedOperator-address-) (inherited)
    - [`onlyAllowedOperatorApproval`](#OperatorFiltererUpgradeable-onlyAllowedOperatorApproval-address-) (inherited)
    - [`onlyRole`](#AccessControlUpgradeable-onlyRole-bytes32-) (inherited)
    - [`onlyOwner`](#OwnableUpgradeable-onlyOwner--) (inherited)
    - [`whenNotPaused`](#PausableUpgradeable-whenNotPaused--) (inherited)
    - [`whenPaused`](#PausableUpgradeable-whenPaused--) (inherited)
    - [`initializer`](#Initializable-initializer--) (inherited)
    - [`reinitializer`](#Initializable-reinitializer-uint8-) (inherited)
    - [`onlyInitializing`](#Initializable-onlyInitializing--) (inherited)

- [Structs](#structs)
    - [`MintRound`](#MechaPilots2219V1-MintRound) (inherited)
    - [`RoleData`](#AccessControlUpgradeable-RoleData) (inherited)
    - [`RoyaltyInfo`](#ERC2981Upgradeable-RoyaltyInfo) (inherited)

- [Enums](#enums)
    - [`Faction`](#MechaPilots2219V1-Faction) (inherited)


## EVENTS

### `MintRoundSetup(uint256 roundId, uint32[2] supply, uint64 startTime, uint64 duration, address validator, uint256 price)` (inherited) <a name="MechaPilots2219V1-MintRoundSetup-uint256-uint32-2--uint64-uint64-address-uint256-" id="MechaPilots2219V1-MintRoundSetup-uint256-uint32-2--uint64-uint64-address-uint256-"></a>
Event emitted when a mint round is created or edited



_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `TokenRevealed(uint256 tokenId, address by, string uri)` (inherited) <a name="MechaPilots2219V1-TokenRevealed-uint256-address-string-" id="MechaPilots2219V1-TokenRevealed-uint256-address-string-"></a>
Event emitted when a token has been revealed



_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `BaseURIChanged(string newBaseURI)` (inherited) <a name="MechaPilots2219V1-BaseURIChanged-string-" id="MechaPilots2219V1-BaseURIChanged-string-"></a>
Event emitted when `baseURI` has been modified



_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `BaseExtensionChanged(string newBaseExtension)` (inherited) <a name="MechaPilots2219V1-BaseExtensionChanged-string-" id="MechaPilots2219V1-BaseExtensionChanged-string-"></a>
Event emitted when `baseExtension` has been modified



_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `BurnableChanged(bool newBurnable)` (inherited) <a name="MechaPilots2219V1-BurnableChanged-bool-" id="MechaPilots2219V1-BurnableChanged-bool-"></a>
Event emitted when `burnable` option has been modified



_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `MaxMintsPerWalletChanged(uint256 newMaxMintsPerWallet)` (inherited) <a name="MechaPilots2219V1-MaxMintsPerWalletChanged-uint256-" id="MechaPilots2219V1-MaxMintsPerWalletChanged-uint256-"></a>
Event emitted when `maxMintsPerWallet` has been modified



_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `Withdrawn(address to, uint256 amount)` (inherited) <a name="MechaPilots2219V1-Withdrawn-address-uint256-" id="MechaPilots2219V1-Withdrawn-address-uint256-"></a>
Event emitted when native coin were removed from the contract



_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `TokenWithdrawn(address to, address token, uint256 amount)` (inherited) <a name="MechaPilots2219V1-TokenWithdrawn-address-address-uint256-" id="MechaPilots2219V1-TokenWithdrawn-address-address-uint256-"></a>
Event emitted when some ERC20 were removed from the contract



_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `Upgraded(address implementation)` (inherited) <a name="ERC1967UpgradeUpgradeable-Upgraded-address-" id="ERC1967UpgradeUpgradeable-Upgraded-address-"></a>

Emitted when the implementation is upgraded.


_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol`_.


### `AdminChanged(address previousAdmin, address newAdmin)` (inherited) <a name="ERC1967UpgradeUpgradeable-AdminChanged-address-address-" id="ERC1967UpgradeUpgradeable-AdminChanged-address-address-"></a>

Emitted when the admin account has changed.


_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol`_.


### `BeaconUpgraded(address beacon)` (inherited) <a name="ERC1967UpgradeUpgradeable-BeaconUpgraded-address-" id="ERC1967UpgradeUpgradeable-BeaconUpgraded-address-"></a>

Emitted when the beacon is upgraded.


_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol`_.


### `OperatorFilterRegistryAddressUpdated(address newRegistry)` (inherited) <a name="UpdatableOperatorFiltererUpgradeable-OperatorFilterRegistryAddressUpdated-address-" id="UpdatableOperatorFiltererUpgradeable-OperatorFilterRegistryAddressUpdated-address-"></a>
Emitted when the operator filter registry address is changed by the owner of the contract



_Inherited from `libs/operator-filter-registry-v1.4.1/src/upgradeable/UpdatableOperatorFiltererUpgradeable.sol`_.


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


### `RoleAdminChanged(bytes32 role, bytes32 previousAdminRole, bytes32 newAdminRole)` (inherited) <a name="IAccessControlUpgradeable-RoleAdminChanged-bytes32-bytes32-bytes32-" id="IAccessControlUpgradeable-RoleAdminChanged-bytes32-bytes32-bytes32-"></a>

Emitted when `newAdminRole` is set as ``role``'s admin role, replacing `previousAdminRole`
`DEFAULT_ADMIN_ROLE` is the starting admin for all roles, despite
{RoleAdminChanged} not being emitted signaling this.
_Available since v3.1._


_Inherited from `../@openzeppelin/contracts-upgradeable/access/IAccessControlUpgradeable.sol`_.


### `RoleGranted(bytes32 role, address account, address sender)` (inherited) <a name="IAccessControlUpgradeable-RoleGranted-bytes32-address-address-" id="IAccessControlUpgradeable-RoleGranted-bytes32-address-address-"></a>

Emitted when `account` is granted `role`.
`sender` is the account that originated the contract call, an admin role
bearer except when using {AccessControl-_setupRole}.


_Inherited from `../@openzeppelin/contracts-upgradeable/access/IAccessControlUpgradeable.sol`_.


### `RoleRevoked(bytes32 role, address account, address sender)` (inherited) <a name="IAccessControlUpgradeable-RoleRevoked-bytes32-address-address-" id="IAccessControlUpgradeable-RoleRevoked-bytes32-address-address-"></a>

Emitted when `account` is revoked `role`.
`sender` is the account that originated the contract call:
  - if using `revokeRole`, it is the admin role bearer
  - if using `renounceRole`, it is the role bearer (i.e. `account`)


_Inherited from `../@openzeppelin/contracts-upgradeable/access/IAccessControlUpgradeable.sol`_.


### `Initialized(uint8 version)` (inherited) <a name="Initializable-Initialized-uint8-" id="Initializable-Initialized-uint8-"></a>

Triggered when the contract has been initialized or reinitialized.


_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol`_.



## PUBLIC FUNCTIONS

### `initializeV2()` (public) <a name="MechaPilots2219V2-initializeV2--" id="MechaPilots2219V2-initializeV2--"></a>
========================
         Public
========================





### `constructor()` (public) (inherited)<a name="MechaPilots2219V1-constructor--" id="MechaPilots2219V1-constructor--"></a>




_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `initialize()` (public) (inherited)<a name="MechaPilots2219V1-initialize--" id="MechaPilots2219V1-initialize--"></a>
Initialize contract



_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `mint(uint256 roundId, uint256 factionId, uint256 amount)` (external) (inherited)<a name="MechaPilots2219V1-mint-uint256-uint256-uint256-" id="MechaPilots2219V1-mint-uint256-uint256-uint256-"></a>
Mint the `amount` of `factionId` token in a round without validator


Call {MechaPilots2219V1-_roundMint}.
Requirements:
- Round must not have a validator
- View {MechaPilots2219V1-_roundMint} requirements



Parameters:
- `roundId`: The mint round index

- `factionId`: The token faction

- `amount`: The number of tokens to mint

_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `mintWithValidation(uint256 roundId, uint256 factionId, uint256 amount, uint256 maxMint, uint256 payloadExpiration, bytes sig)` (external) (inherited)<a name="MechaPilots2219V1-mintWithValidation-uint256-uint256-uint256-uint256-uint256-bytes-" id="MechaPilots2219V1-mintWithValidation-uint256-uint256-uint256-uint256-uint256-bytes-"></a>
Mint the `amount` of tokens with the signature of the round validator.


Requirements:
- Total minted for the user during this round must be less than `maxMint`.
- `sig` must be signed by the validator of the round and contains all information to check.
- `payloadExpiration` must be less than the block timestamp.
- View {MechaPilots2219V1-_roundMint} requirements.



Parameters:
- `roundId`: The mint round index (verified in `sig`)

- `factionId`: The token faction (verified in `sig`)

- `amount`: The number of tokens to mint

- `maxMint`: The maximum token that the user is allowed to mint in the round (verified in `sig`)

- `payloadExpiration`: The maximum timestamp before the signature is considered invalid (verified in `sig`)

- `sig`: The EC signature generated by the round validator

_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `revealToken(uint256 tokenId, string uri, uint256 payloadExpiration, bytes sig)` (external) (inherited)<a name="MechaPilots2219V1-revealToken-uint256-string-uint256-bytes-" id="MechaPilots2219V1-revealToken-uint256-string-uint256-bytes-"></a>
Reveals a user's token using the signature of a URI_UPDATER_ROLE


Requirements:
- The caller must own `tokenId` or be an approved operator.
- `sig` must be signed by a URI_UPDATER_ROLE of the round and contains all information to check.
- `payloadExpiration` must be less than the block timestamp.



Parameters:
- `tokenId`: The tokenId (verified in `sig`)

- `uri`: The revealed token uri (verified in `sig`)

- `payloadExpiration`: The maximum timestamp before the signature is considered invalid (verified in `sig`)

- `sig`: The EC signature generated by the round validator

_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `setTokenURI(uint256 tokenId, string uri)` (external) (inherited)<a name="MechaPilots2219V1-setTokenURI-uint256-string-" id="MechaPilots2219V1-setTokenURI-uint256-string-"></a>
Change the tokenURI of a token


Requirements:
- Only for URI_UPDATER_ROLE.



Parameters:
- `tokenId`: The tokenId

- `uri`: The new token uri

_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `setTokenURIPerBatch(uint256[] tokenIds, string[] uri)` (external) (inherited)<a name="MechaPilots2219V1-setTokenURIPerBatch-uint256---string---" id="MechaPilots2219V1-setTokenURIPerBatch-uint256---string---"></a>
Change tokenURI of each token


Requirements:
- Only for URI_UPDATER_ROLE.



Parameters:
- `tokenIds`: List of tokenIds

- `uri`: List of new token URI

_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `airdrop(address wallet, uint256 factionId, uint256 amount)` (external) (inherited)<a name="MechaPilots2219V1-airdrop-address-uint256-uint256-" id="MechaPilots2219V1-airdrop-address-uint256-uint256-"></a>
Mint the `amount` of token and transfers it to `wallet`.


Call {MechaPilots2219V1-_safeMint}.
Requirements:
- Only owner.
- View {MechaPilots2219V1-_safeMint} requirements.



Parameters:
- `wallet`: The wallet to transfer new tokens

- `factionId`: The faction

- `amount`: The number of tokens to mint

_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `setupMintRound(uint256 roundId, uint32[2] supply, uint64 startTime, uint64 duration, address validator, uint256 price)` (public) (inherited)<a name="MechaPilots2219V1-setupMintRound-uint256-uint32-2--uint64-uint64-address-uint256-" id="MechaPilots2219V1-setupMintRound-uint256-uint32-2--uint64-uint64-address-uint256-"></a>
Create or edit a mint round


Requirements:
- `roundId` must exist or increment `roundsLength` for create one.
- `roundId` can't be 0.



Parameters:
- `roundId`: The index of the mint round.

- `supply`: Number of tokens that can be minted in this round by faction. Can be 0 for use the total faction supply

- `startTime`: The start time of the round in unix seconds timestamp. 0 if not set.

- `duration`: The duration of the round in seconds. 0 if ends at sold out.

- `validator`: The address of the whitelist validator. Can be 'address(0)' for no whitelist.

- `price`: The price in wei

_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `pause()` (public) (inherited)<a name="MechaPilots2219V1-pause--" id="MechaPilots2219V1-pause--"></a>
Pause the contract : disables mints, transactions and burns until `unpause`



_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `unpause()` (public) (inherited)<a name="MechaPilots2219V1-unpause--" id="MechaPilots2219V1-unpause--"></a>
Unpause the contract



_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `setBaseURI(string newBaseURI)` (external) (inherited)<a name="MechaPilots2219V1-setBaseURI-string-" id="MechaPilots2219V1-setBaseURI-string-"></a>
Change the baseURI for unrevealed tokens



_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `setBaseExtension(string newBaseExtension)` (external) (inherited)<a name="MechaPilots2219V1-setBaseExtension-string-" id="MechaPilots2219V1-setBaseExtension-string-"></a>
Change the URI base extension for unrevealed tokens



_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `setBurnable(bool newBurnable)` (public) (inherited)<a name="MechaPilots2219V1-setBurnable-bool-" id="MechaPilots2219V1-setBurnable-bool-"></a>
Activate burnable option



Parameters:
- `newBurnable`: If users are authorized to burn their tokens or not

_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `setMaxMintsPerWallet(uint256 newMaxMints)` (external) (inherited)<a name="MechaPilots2219V1-setMaxMintsPerWallet-uint256-" id="MechaPilots2219V1-setMaxMintsPerWallet-uint256-"></a>
Change number of tokens that a wallet can mint in a public round



_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `burn(uint256 tokenId)` (public) (inherited)<a name="MechaPilots2219V1-burn-uint256-" id="MechaPilots2219V1-burn-uint256-"></a>

Burns `tokenId`. See {ERC721-_burn}.

Requirements:
- The burnable feature must be active.
- The caller must own `tokenId` or be an approved operator.


_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `withdraw(address payable to, uint256 amount)` (public) (inherited)<a name="MechaPilots2219V1-withdraw-address-payable-uint256-" id="MechaPilots2219V1-withdraw-address-payable-uint256-"></a>
Withdraw network native coins




Parameters:
- `to`: The address of the tokens/coins receiver.

- `amount`: Amount to claim.

_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `withdrawTokens(address to, address token, uint256 amount)` (public) (inherited)<a name="MechaPilots2219V1-withdrawTokens-address-address-uint256-" id="MechaPilots2219V1-withdrawTokens-address-address-uint256-"></a>
Withdraw ERC20




Parameters:
- `to`: The address of the tokens/coins receiver.

- `token`: The address of the token contract.

- `amount`: Amount to claim.

_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `setDefaultRoyalty(address receiver, uint96 feeNumerator)` (external) (inherited)<a name="MechaPilots2219V1-setDefaultRoyalty-address-uint96-" id="MechaPilots2219V1-setDefaultRoyalty-address-uint96-"></a>
Sets the royalty information that all ids in this contract will default to.

Requirements:
- `receiver` cannot be the zero address.
- `feeNumerator` cannot be greater than the fee denominator: 10000.




Parameters:
- `receiver`: The address who should receive the fee.

- `feeNumerator`: The fee numerator (out of 10000)

_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `deleteDefaultRoyalty()` (external) (inherited)<a name="MechaPilots2219V1-deleteDefaultRoyalty--" id="MechaPilots2219V1-deleteDefaultRoyalty--"></a>
Remove default royalty information



_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `setApprovalForAll(address operator, bool approved)` (public) (inherited)<a name="MechaPilots2219V1-setApprovalForAll-address-bool-" id="MechaPilots2219V1-setApprovalForAll-address-bool-"></a>

See {IERC721-setApprovalForAll}.
     Check if the operator is allowed by the operator-filter-registry.


_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `approve(address operator, uint256 tokenId)` (public) (inherited)<a name="MechaPilots2219V1-approve-address-uint256-" id="MechaPilots2219V1-approve-address-uint256-"></a>

See {IERC721-approve}.
     Check if the operator is allowed by the operator-filter-registry.


_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `transferFrom(address from, address to, uint256 tokenId)` (public) (inherited)<a name="MechaPilots2219V1-transferFrom-address-address-uint256-" id="MechaPilots2219V1-transferFrom-address-address-uint256-"></a>

See {IERC721-transferFrom}.
     Check if the operator is allowed by the operator-filter-registry.


_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `safeTransferFrom(address from, address to, uint256 tokenId)` (public) (inherited)<a name="MechaPilots2219V1-safeTransferFrom-address-address-uint256-" id="MechaPilots2219V1-safeTransferFrom-address-address-uint256-"></a>

See {IERC721-safeTransferFrom}.
     Check if the operator is allowed by the operator-filter-registry.


_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `safeTransferFrom(address from, address to, uint256 tokenId, bytes data)` (public) (inherited)<a name="MechaPilots2219V1-safeTransferFrom-address-address-uint256-bytes-" id="MechaPilots2219V1-safeTransferFrom-address-address-uint256-bytes-"></a>

See {IERC721-safeTransferFrom}.
     Check if the operator is allowed by the operator-filter-registry.


_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `tokenURI(uint256 tokenId) → string` (public) (inherited)<a name="MechaPilots2219V1-tokenURI-uint256-" id="MechaPilots2219V1-tokenURI-uint256-"></a>
Returns the URI of `tokenId`, according to its condition (revealed or not)



_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `isRevealed(uint256 tokenId) → bool` (public) (inherited)<a name="MechaPilots2219V1-isRevealed-uint256-" id="MechaPilots2219V1-isRevealed-uint256-"></a>
Returns true if the `tokenId` is not revealed yet



_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `rounds(uint256 roundId) → struct MechaPilots2219V1.MintRound` (external) (inherited)<a name="MechaPilots2219V1-rounds-uint256-" id="MechaPilots2219V1-rounds-uint256-"></a>
Returns the MintRound structure of `roundId`


Better web3 accessibility that a public variable (includes arrays)


_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `totalSupply() → uint256` (public) (inherited)<a name="MechaPilots2219V1-totalSupply--" id="MechaPilots2219V1-totalSupply--"></a>
Returns the total balances of tokens. Takes into account the burned ones.



_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `totalSupplyByFaction(uint256 factionId) → uint256` (public) (inherited)<a name="MechaPilots2219V1-totalSupplyByFaction-uint256-" id="MechaPilots2219V1-totalSupplyByFaction-uint256-"></a>
Returns the total balances of tokens for `factionId`. Takes into account the burned ones.



_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `totalMintedByFaction(uint256 factionId) → uint256` (public) (inherited)<a name="MechaPilots2219V1-totalMintedByFaction-uint256-" id="MechaPilots2219V1-totalMintedByFaction-uint256-"></a>
Returns the total amount of tokens minted for `factionId`.



_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `totalBurnedByFaction(uint256 factionId) → uint256` (public) (inherited)<a name="MechaPilots2219V1-totalBurnedByFaction-uint256-" id="MechaPilots2219V1-totalBurnedByFaction-uint256-"></a>
Returns the total amount of tokens burned for `factionId`.



_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `totalMintedBy(address wallet, uint256 roundId) → uint256` (public) (inherited)<a name="MechaPilots2219V1-totalMintedBy-address-uint256-" id="MechaPilots2219V1-totalMintedBy-address-uint256-"></a>
Returns the total amount of tokens minted by `wallet` for `roundId`.



_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `owner() → address` (public) (inherited)<a name="MechaPilots2219V1-owner--" id="MechaPilots2219V1-owner--"></a>

Returns the address of the current owner.


_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `supportsInterface(bytes4 interfaceId) → bool` (public) (inherited)<a name="MechaPilots2219V1-supportsInterface-bytes4-" id="MechaPilots2219V1-supportsInterface-bytes4-"></a>




_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `receive()` (external) (inherited)<a name="MechaPilots2219V1-receive--" id="MechaPilots2219V1-receive--"></a>




_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `proxiableUUID() → bytes32` (external) (inherited)<a name="UUPSUpgradeable-proxiableUUID--" id="UUPSUpgradeable-proxiableUUID--"></a>

Implementation of the ERC1822 {proxiableUUID} function. This returns the storage slot used by the
implementation. It is used to validate the implementation's compatibility when performing an upgrade.
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


### `updateOperatorFilterRegistryAddress(address newRegistry)` (public) (inherited)<a name="UpdatableOperatorFiltererUpgradeable-updateOperatorFilterRegistryAddress-address-" id="UpdatableOperatorFiltererUpgradeable-updateOperatorFilterRegistryAddress-address-"></a>
Update the address that the contract will make OperatorFilter checks against. When set to the zero
        address, checks will be bypassed. OnlyOwner.



Parameters:
- `newRegistry`: The address of the registry that will be used for this contract

_Inherited from `libs/operator-filter-registry-v1.4.1/src/upgradeable/UpdatableOperatorFiltererUpgradeable.sol`_.


### `operatorFilterRegistry() → address` (public) (inherited)<a name="UpdatableOperatorFiltererUpgradeable-operatorFilterRegistry--" id="UpdatableOperatorFiltererUpgradeable-operatorFilterRegistry--"></a>

Helper function to return the value of the currently used registry address


_Inherited from `libs/operator-filter-registry-v1.4.1/src/upgradeable/UpdatableOperatorFiltererUpgradeable.sol`_.


### `hasRole(bytes32 role, address account) → bool` (public) (inherited)<a name="AccessControlUpgradeable-hasRole-bytes32-address-" id="AccessControlUpgradeable-hasRole-bytes32-address-"></a>

Returns `true` if `account` has been granted `role`.


_Inherited from `../@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol`_.


### `getRoleAdmin(bytes32 role) → bytes32` (public) (inherited)<a name="AccessControlUpgradeable-getRoleAdmin-bytes32-" id="AccessControlUpgradeable-getRoleAdmin-bytes32-"></a>

Returns the admin role that controls `role`. See {grantRole} and
{revokeRole}.
To change a role's admin, use {_setRoleAdmin}.


_Inherited from `../@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol`_.


### `grantRole(bytes32 role, address account)` (public) (inherited)<a name="AccessControlUpgradeable-grantRole-bytes32-address-" id="AccessControlUpgradeable-grantRole-bytes32-address-"></a>

Grants `role` to `account`.
If `account` had not been already granted `role`, emits a {RoleGranted}
event.
Requirements:
- the caller must have ``role``'s admin role.
May emit a {RoleGranted} event.


_Inherited from `../@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol`_.


### `revokeRole(bytes32 role, address account)` (public) (inherited)<a name="AccessControlUpgradeable-revokeRole-bytes32-address-" id="AccessControlUpgradeable-revokeRole-bytes32-address-"></a>

Revokes `role` from `account`.
If `account` had been granted `role`, emits a {RoleRevoked} event.
Requirements:
- the caller must have ``role``'s admin role.
May emit a {RoleRevoked} event.


_Inherited from `../@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol`_.


### `renounceRole(bytes32 role, address account)` (public) (inherited)<a name="AccessControlUpgradeable-renounceRole-bytes32-address-" id="AccessControlUpgradeable-renounceRole-bytes32-address-"></a>

Revokes `role` from the calling account.
Roles are often managed via {grantRole} and {revokeRole}: this function's
purpose is to provide a mechanism for accounts to lose their privileges
if they are compromised (such as when a trusted device is misplaced).
If the calling account had been revoked `role`, emits a {RoleRevoked}
event.
Requirements:
- the caller must be `account`.
May emit a {RoleRevoked} event.


_Inherited from `../@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol`_.


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


### `getApproved(uint256 tokenId) → address` (public) (inherited)<a name="ERC721Upgradeable-getApproved-uint256-" id="ERC721Upgradeable-getApproved-uint256-"></a>

See {IERC721-getApproved}.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `isApprovedForAll(address owner, address operator) → bool` (public) (inherited)<a name="ERC721Upgradeable-isApprovedForAll-address-address-" id="ERC721Upgradeable-isApprovedForAll-address-address-"></a>

See {IERC721-isApprovedForAll}.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `royaltyInfo(uint256 _tokenId, uint256 _salePrice) → address, uint256` (public) (inherited)<a name="ERC2981Upgradeable-royaltyInfo-uint256-uint256-" id="ERC2981Upgradeable-royaltyInfo-uint256-uint256-"></a>

Returns how much royalty is owed and to whom, based on a sale price that may be denominated in any unit of
exchange. The royalty amount is denominated and should be paid in that same unit of exchange.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol`_.


## INTERNAL FUNCTIONS

### `_roundMint(address wallet, uint256 roundId, uint256 factionId, uint256 amount)` (internal) (inherited) <a name="MechaPilots2219V1-_roundMint-address-uint256-uint256-uint256-" id="MechaPilots2219V1-_roundMint-address-uint256-uint256-uint256-"></a>
Safely mint the `amount` of token for `wallet` in a `round`
If `faction` is sold out, automatically mint the other


Call {MechaPilots2219V1-_safeMint}.
Requirements:
- round must be active
- msg.value must contain the price
- The supply of the round for the `faction` must not be exceeded with amount
- msg.sender must not be a smart contract
- View {MechaPilots2219V1-_safeMint} Requirements

Increase `ownerToRoundTotalMinted`



Parameters:
- `wallet`: The wallet to transfer new tokens

- `roundId`: The mint round index

- `factionId`: The faction

- `amount`: The number of tokens to mint

_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `_safeMint(address wallet, uint256 factionId, uint256 amount)` (internal) (inherited) <a name="MechaPilots2219V1-_safeMint-address-uint256-uint256-" id="MechaPilots2219V1-_safeMint-address-uint256-uint256-"></a>
Safely mint the `amount` of token for `wallet`.
If `faction` is sold out, automatically mint the other


Requirements:
- `amount` must be above 0
- `faction` must exist
- The supply of the faction must not be exceeded with amount

Increase `_totalMinted` and `_totalMintedByFaction`



Parameters:
- `wallet`: The wallet to transfer new tokens

- `factionId`: The faction

- `amount`: The number of tokens to mint

_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `_getRandomToken(address wallet, uint256 totalMinted) → uint256` (internal) (inherited) <a name="MechaPilots2219V1-_getRandomToken-address-uint256-" id="MechaPilots2219V1-_getRandomToken-address-uint256-"></a>
Gives a identifier from a pseudo random function (inspired by Cyberkongs VX)




Parameters:
- `wallet`: The wallet to complexify the random

- `totalMinted`: Updated total minted

_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `_checkSignature(uint256 payloadExpiration, bytes data, bytes sig, address signer)` (internal) (inherited) <a name="MechaPilots2219V1-_checkSignature-uint256-bytes-bytes-address-" id="MechaPilots2219V1-_checkSignature-uint256-bytes-bytes-address-"></a>
Reverts if the data does not correspond to the signature, to the correct signer or if it has expired


Requirements:
- `payloadExpiration` must be less than the block timestamp
- `sig` must be a hash of `data`
- `sig` must be signed by `signer`



Parameters:
- `payloadExpiration`: The maximum timestamp before the signature is considered invalid

- `data`: All encoded pack data in order

- `sig`: The EC signature generated by the signatory

- `signer`: The address that is supposed to be the signatory

_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `_checkSignatureFromRole(uint256 payloadExpiration, bytes data, bytes sig, bytes32 role)` (internal) (inherited) <a name="MechaPilots2219V1-_checkSignatureFromRole-uint256-bytes-bytes-bytes32-" id="MechaPilots2219V1-_checkSignatureFromRole-uint256-bytes-bytes-bytes32-"></a>
Reverts if the data does not correspond to the signature, the signer has not corresponding `role` or if it has expired


Requirements:
- `payloadExpiration` must be less than the block timestamp
- `sig` must be a hash of `data`
- `sig` must be signed by `signer`



Parameters:
- `payloadExpiration`: The maximum timestamp before the signature is considered invalid

- `data`: All encoded pack data in order

- `sig`: The EC signature generated by the signatory

- `role`: The role that the signer must have

_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `_burn(uint256 tokenId)` (internal) (inherited) <a name="MechaPilots2219V1-_burn-uint256-" id="MechaPilots2219V1-_burn-uint256-"></a>




_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `_beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)` (internal) (inherited) <a name="MechaPilots2219V1-_beforeTokenTransfer-address-address-uint256-uint256-" id="MechaPilots2219V1-_beforeTokenTransfer-address-address-uint256-uint256-"></a>




_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `_authorizeUpgrade(address)` (internal) (inherited) <a name="MechaPilots2219V1-_authorizeUpgrade-address-" id="MechaPilots2219V1-_authorizeUpgrade-address-"></a>




_Inherited from `ERC721/MechaPilots2219V1.sol`_.


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


### `__UpdatableOperatorFiltererUpgradeable_init(address _registry, address subscriptionOrRegistrantToCopy, bool subscribe)` (internal) (inherited) <a name="UpdatableOperatorFiltererUpgradeable-__UpdatableOperatorFiltererUpgradeable_init-address-address-bool-" id="UpdatableOperatorFiltererUpgradeable-__UpdatableOperatorFiltererUpgradeable_init-address-address-bool-"></a>
Initialization function in accordance with the upgradable pattern

The upgradeable initialize function specific to proxied contracts


Parameters:
- `_registry`: Registry address to which to register to for blocking operators that do not respect royalties

- `subscriptionOrRegistrantToCopy`: Subscription address to use as a template for when
                                      imitating/copying blocked addresses and codehashes

- `subscribe`: If to subscribe to the subscriptionOrRegistrantToCopy address or just copy entries from it

_Inherited from `libs/operator-filter-registry-v1.4.1/src/upgradeable/UpdatableOperatorFiltererUpgradeable.sol`_.


### `_checkFilterOperator(address operator)` (internal) (inherited) <a name="UpdatableOperatorFiltererUpgradeable-_checkFilterOperator-address-" id="UpdatableOperatorFiltererUpgradeable-_checkFilterOperator-address-"></a>

A helper function to check if the operator is allowed


_Inherited from `libs/operator-filter-registry-v1.4.1/src/upgradeable/UpdatableOperatorFiltererUpgradeable.sol`_.


### `__OperatorFilterer_init(address subscriptionOrRegistrantToCopy, bool subscribe)` (internal) (inherited) <a name="OperatorFiltererUpgradeable-__OperatorFilterer_init-address-bool-" id="OperatorFiltererUpgradeable-__OperatorFilterer_init-address-bool-"></a>

The upgradeable initialize function that should be called when the contract is being upgraded.


_Inherited from `libs/operator-filter-registry-v1.4.1/src/upgradeable/OperatorFiltererUpgradeable.sol`_.


### `__AccessControl_init()` (internal) (inherited) <a name="AccessControlUpgradeable-__AccessControl_init--" id="AccessControlUpgradeable-__AccessControl_init--"></a>




_Inherited from `../@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol`_.


### `__AccessControl_init_unchained()` (internal) (inherited) <a name="AccessControlUpgradeable-__AccessControl_init_unchained--" id="AccessControlUpgradeable-__AccessControl_init_unchained--"></a>




_Inherited from `../@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol`_.


### `_checkRole(bytes32 role)` (internal) (inherited) <a name="AccessControlUpgradeable-_checkRole-bytes32-" id="AccessControlUpgradeable-_checkRole-bytes32-"></a>

Revert with a standard message if `_msgSender()` is missing `role`.
Overriding this function changes the behavior of the {onlyRole} modifier.
Format of the revert message is described in {_checkRole}.
_Available since v4.6._


_Inherited from `../@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol`_.


### `_checkRole(bytes32 role, address account)` (internal) (inherited) <a name="AccessControlUpgradeable-_checkRole-bytes32-address-" id="AccessControlUpgradeable-_checkRole-bytes32-address-"></a>

Revert with a standard message if `account` is missing `role`.
The format of the revert reason is given by the following regular expression:
 /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/


_Inherited from `../@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol`_.


### `_setupRole(bytes32 role, address account)` (internal) (inherited) <a name="AccessControlUpgradeable-_setupRole-bytes32-address-" id="AccessControlUpgradeable-_setupRole-bytes32-address-"></a>

Grants `role` to `account`.
If `account` had not been already granted `role`, emits a {RoleGranted}
event. Note that unlike {grantRole}, this function doesn't perform any
checks on the calling account.
May emit a {RoleGranted} event.
[WARNING]
====
This function should only be called from the constructor when setting
up the initial roles for the system.
Using this function in any other way is effectively circumventing the admin
system imposed by {AccessControl}.
====
NOTE: This function is deprecated in favor of {_grantRole}.


_Inherited from `../@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol`_.


### `_setRoleAdmin(bytes32 role, bytes32 adminRole)` (internal) (inherited) <a name="AccessControlUpgradeable-_setRoleAdmin-bytes32-bytes32-" id="AccessControlUpgradeable-_setRoleAdmin-bytes32-bytes32-"></a>

Sets `adminRole` as ``role``'s admin role.
Emits a {RoleAdminChanged} event.


_Inherited from `../@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol`_.


### `_grantRole(bytes32 role, address account)` (internal) (inherited) <a name="AccessControlUpgradeable-_grantRole-bytes32-address-" id="AccessControlUpgradeable-_grantRole-bytes32-address-"></a>

Grants `role` to `account`.
Internal function without access restriction.
May emit a {RoleGranted} event.


_Inherited from `../@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol`_.


### `_revokeRole(bytes32 role, address account)` (internal) (inherited) <a name="AccessControlUpgradeable-_revokeRole-bytes32-address-" id="AccessControlUpgradeable-_revokeRole-bytes32-address-"></a>

Revokes `role` from `account`.
Internal function without access restriction.
May emit a {RoleRevoked} event.


_Inherited from `../@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol`_.


### `__Ownable_init()` (internal) (inherited) <a name="OwnableUpgradeable-__Ownable_init--" id="OwnableUpgradeable-__Ownable_init--"></a>

Initializes the contract setting the deployer as the initial owner.


_Inherited from `../@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol`_.


### `__Ownable_init_unchained()` (internal) (inherited) <a name="OwnableUpgradeable-__Ownable_init_unchained--" id="OwnableUpgradeable-__Ownable_init_unchained--"></a>




_Inherited from `../@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol`_.


### `_checkOwner()` (internal) (inherited) <a name="OwnableUpgradeable-_checkOwner--" id="OwnableUpgradeable-_checkOwner--"></a>

Throws if the sender is not the owner.


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


### `_requireNotPaused()` (internal) (inherited) <a name="PausableUpgradeable-_requireNotPaused--" id="PausableUpgradeable-_requireNotPaused--"></a>

Throws if the contract is paused.


_Inherited from `../@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol`_.


### `_requirePaused()` (internal) (inherited) <a name="PausableUpgradeable-_requirePaused--" id="PausableUpgradeable-_requirePaused--"></a>

Throws if the contract is not paused.


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


### `__ERC721Royalty_init()` (internal) (inherited) <a name="ERC721RoyaltyUpgradeable-__ERC721Royalty_init--" id="ERC721RoyaltyUpgradeable-__ERC721Royalty_init--"></a>




_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721RoyaltyUpgradeable.sol`_.


### `__ERC721Royalty_init_unchained()` (internal) (inherited) <a name="ERC721RoyaltyUpgradeable-__ERC721Royalty_init_unchained--" id="ERC721RoyaltyUpgradeable-__ERC721Royalty_init_unchained--"></a>




_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721RoyaltyUpgradeable.sol`_.


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
by default, can be overridden in child contracts.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `_safeTransfer(address from, address to, uint256 tokenId, bytes data)` (internal) (inherited) <a name="ERC721Upgradeable-_safeTransfer-address-address-uint256-bytes-" id="ERC721Upgradeable-_safeTransfer-address-address-uint256-bytes-"></a>

Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
are aware of the ERC721 protocol to prevent tokens from being forever locked.
`data` is additional data, it has no specified format and it is sent in call to `to`.
This internal function is equivalent to {safeTransferFrom}, and can be used to e.g.
implement alternative mechanisms to perform token transfer, such as signature-based.
Requirements:
- `from` cannot be the zero address.
- `to` cannot be the zero address.
- `tokenId` token must exist and be owned by `from`.
- If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
Emits a {Transfer} event.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `_ownerOf(uint256 tokenId) → address` (internal) (inherited) <a name="ERC721Upgradeable-_ownerOf-uint256-" id="ERC721Upgradeable-_ownerOf-uint256-"></a>

Returns the owner of the `tokenId`. Does NOT revert if token doesn't exist


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


### `_safeMint(address to, uint256 tokenId, bytes data)` (internal) (inherited) <a name="ERC721Upgradeable-_safeMint-address-uint256-bytes-" id="ERC721Upgradeable-_safeMint-address-uint256-bytes-"></a>

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
Emits an {Approval} event.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `_setApprovalForAll(address owner, address operator, bool approved)` (internal) (inherited) <a name="ERC721Upgradeable-_setApprovalForAll-address-address-bool-" id="ERC721Upgradeable-_setApprovalForAll-address-address-bool-"></a>

Approve `operator` to operate on all of `owner` tokens
Emits an {ApprovalForAll} event.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `_requireMinted(uint256 tokenId)` (internal) (inherited) <a name="ERC721Upgradeable-_requireMinted-uint256-" id="ERC721Upgradeable-_requireMinted-uint256-"></a>

Reverts if the `tokenId` has not been minted yet.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `_afterTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize)` (internal) (inherited) <a name="ERC721Upgradeable-_afterTokenTransfer-address-address-uint256-uint256-" id="ERC721Upgradeable-_afterTokenTransfer-address-address-uint256-uint256-"></a>

Hook that is called after any token transfer. This includes minting and burning. If {ERC721Consecutive} is
used, the hook may be called as part of a consecutive (batch) mint, as indicated by `batchSize` greater than 1.
Calling conditions:
- When `from` and `to` are both non-zero, ``from``'s tokens were transferred to `to`.
- When `from` is zero, the tokens were minted for `to`.
- When `to` is zero, ``from``'s tokens were burned.
- `from` and `to` are never both zero.
- `batchSize` is non-zero.
To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `__unsafe_increaseBalance(address account, uint256 amount)` (internal) (inherited) <a name="ERC721Upgradeable-__unsafe_increaseBalance-address-uint256-" id="ERC721Upgradeable-__unsafe_increaseBalance-address-uint256-"></a>

Unsafe write access to the balances, used by extensions that "mint" tokens using an {ownerOf} override.
WARNING: Anyone calling this MUST ensure that the balances remain consistent with the ownership. The invariant
being that for any address `a` the value returned by `balanceOf(a)` must be equal to the number of tokens such
that `ownerOf(tokenId)` is `a`.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`_.


### `__ERC2981_init()` (internal) (inherited) <a name="ERC2981Upgradeable-__ERC2981_init--" id="ERC2981Upgradeable-__ERC2981_init--"></a>




_Inherited from `../@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol`_.


### `__ERC2981_init_unchained()` (internal) (inherited) <a name="ERC2981Upgradeable-__ERC2981_init_unchained--" id="ERC2981Upgradeable-__ERC2981_init_unchained--"></a>




_Inherited from `../@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol`_.


### `_feeDenominator() → uint96` (internal) (inherited) <a name="ERC2981Upgradeable-_feeDenominator--" id="ERC2981Upgradeable-_feeDenominator--"></a>

The denominator with which to interpret the fee set in {_setTokenRoyalty} and {_setDefaultRoyalty} as a
fraction of the sale price. Defaults to 10000 so fees are expressed in basis points, but may be customized by an
override.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol`_.


### `_setDefaultRoyalty(address receiver, uint96 feeNumerator)` (internal) (inherited) <a name="ERC2981Upgradeable-_setDefaultRoyalty-address-uint96-" id="ERC2981Upgradeable-_setDefaultRoyalty-address-uint96-"></a>

Sets the royalty information that all ids in this contract will default to.
Requirements:
- `receiver` cannot be the zero address.
- `feeNumerator` cannot be greater than the fee denominator.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol`_.


### `_deleteDefaultRoyalty()` (internal) (inherited) <a name="ERC2981Upgradeable-_deleteDefaultRoyalty--" id="ERC2981Upgradeable-_deleteDefaultRoyalty--"></a>

Removes default royalty information.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol`_.


### `_setTokenRoyalty(uint256 tokenId, address receiver, uint96 feeNumerator)` (internal) (inherited) <a name="ERC2981Upgradeable-_setTokenRoyalty-uint256-address-uint96-" id="ERC2981Upgradeable-_setTokenRoyalty-uint256-address-uint96-"></a>

Sets the royalty information for a specific token id, overriding the global default.
Requirements:
- `receiver` cannot be the zero address.
- `feeNumerator` cannot be greater than the fee denominator.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol`_.


### `_resetTokenRoyalty(uint256 tokenId)` (internal) (inherited) <a name="ERC2981Upgradeable-_resetTokenRoyalty-uint256-" id="ERC2981Upgradeable-_resetTokenRoyalty-uint256-"></a>

Resets royalty information for the token id back to the global default.


_Inherited from `../@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol`_.


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


### `_disableInitializers()` (internal) (inherited) <a name="Initializable-_disableInitializers--" id="Initializable-_disableInitializers--"></a>

Locks the contract, preventing any future reinitialization. This cannot be part of an initializer call.
Calling this in the constructor of a contract will prevent that contract from being initialized or reinitialized
to any version. It is recommended to use this to lock implementation contracts that are designed to be called
through proxies.
Emits an {Initialized} event the first time it is successfully executed.


_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol`_.


### `_getInitializedVersion() → uint8` (internal) (inherited) <a name="Initializable-_getInitializedVersion--" id="Initializable-_getInitializedVersion--"></a>

Returns the highest version that has been initialized. See {reinitializer}.


_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol`_.


### `_isInitializing() → bool` (internal) (inherited) <a name="Initializable-_isInitializing--" id="Initializable-_isInitializing--"></a>

Returns `true` if the contract is currently initializing. See {onlyInitializing}.


_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol`_.



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


### `onlyAllowedOperator(address from)` (inherited) <a name="OperatorFiltererUpgradeable-onlyAllowedOperator-address-" id="OperatorFiltererUpgradeable-onlyAllowedOperator-address-"></a>


A helper modifier to check if the operator is allowed.


_Inherited from `libs/operator-filter-registry-v1.4.1/src/upgradeable/OperatorFiltererUpgradeable.sol`_.


### `onlyAllowedOperatorApproval(address operator)` (inherited) <a name="OperatorFiltererUpgradeable-onlyAllowedOperatorApproval-address-" id="OperatorFiltererUpgradeable-onlyAllowedOperatorApproval-address-"></a>


A helper modifier to check if the operator approval is allowed.


_Inherited from `libs/operator-filter-registry-v1.4.1/src/upgradeable/OperatorFiltererUpgradeable.sol`_.


### `onlyRole(bytes32 role)` (inherited) <a name="AccessControlUpgradeable-onlyRole-bytes32-" id="AccessControlUpgradeable-onlyRole-bytes32-"></a>


Modifier that checks that an account has a specific role. Reverts
with a standardized message including the required role.
The format of the revert reason is given by the following regular expression:
 /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
_Available since v4.1._


_Inherited from `../@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol`_.


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


A modifier that defines a protected initializer function that can be invoked at most once. In its scope,
`onlyInitializing` functions can be used to initialize parent contracts.
Similar to `reinitializer(1)`, except that functions marked with `initializer` can be nested in the context of a
constructor.
Emits an {Initialized} event.


_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol`_.


### `reinitializer(uint8 version)` (inherited) <a name="Initializable-reinitializer-uint8-" id="Initializable-reinitializer-uint8-"></a>


A modifier that defines a protected reinitializer function that can be invoked at most once, and only if the
contract hasn't been initialized to a greater version before. In its scope, `onlyInitializing` functions can be
used to initialize parent contracts.
A reinitializer may be used after the original initialization step. This is essential to configure modules that
are added through upgrades and that require initialization.
When `version` is 1, this modifier is similar to `initializer`, except that functions marked with `reinitializer`
cannot be nested. If one is invoked in the context of another, execution will revert.
Note that versions can jump in increments greater than 1; this implies that if multiple reinitializers coexist in
a contract, executing them in the right order is up to the developer or operator.
WARNING: setting the version to 255 will prevent any future reinitialization.
Emits an {Initialized} event.


_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol`_.


### `onlyInitializing()` (inherited) <a name="Initializable-onlyInitializing--" id="Initializable-onlyInitializing--"></a>


Modifier to protect an initialization function so that it can only be invoked by functions with the
{initializer} and {reinitializer} modifiers, directly or indirectly.


_Inherited from `../@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol`_.


## STRUCTS

### `MintRound` (inherited) <a name="MechaPilots2219V1-MintRound" id="MechaPilots2219V1-MintRound"></a>
- uint64 startTime
- uint64 duration
- uint32[2] supply
- uint32[2] totalMinted
- address validator
- uint256 price

_Inherited from `ERC721/MechaPilots2219V1.sol`_.


### `RoleData` (inherited) <a name="AccessControlUpgradeable-RoleData" id="AccessControlUpgradeable-RoleData"></a>
- mapping(address => bool) members
- bytes32 adminRole

_Inherited from `../@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol`_.


### `RoyaltyInfo` (inherited) <a name="ERC2981Upgradeable-RoyaltyInfo" id="ERC2981Upgradeable-RoyaltyInfo"></a>
- address receiver
- uint96 royaltyFraction

_Inherited from `../@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol`_.


## ENUMS

### `Faction` (inherited) <a name="MechaPilots2219V1-Faction" id="MechaPilots2219V1-Faction"></a>



_Inherited from `ERC721/MechaPilots2219V1.sol`_.

