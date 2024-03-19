// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721RoyaltyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "../../libs/operator-filter-registry-v1.4.1/src/upgradeable/UpdatableOperatorFiltererUpgradeable.sol";

/**
 * @title MechaPilots2219 - TODO
 * @author MechaChain - <https://mechachain.io/>
 * @custom:project-website  https://mechachain.io/
 * @custom:security-contact contracts@ethernalhorizons.com
 */
contract MechaPilots2219V1 is
    Initializable,
    ERC721Upgradeable,
    ERC721BurnableUpgradeable,
    ERC721RoyaltyUpgradeable,
    PausableUpgradeable,
    OwnableUpgradeable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    UpdatableOperatorFiltererUpgradeable,
    UUPSUpgradeable
{
    using Strings for uint256;
    using ECDSA for bytes32;
    using SafeERC20Upgradeable for IERC20Upgradeable;

    /**
     * ========================
     *          Events
     * ========================
     */

    /**
     * @notice Event emitted when a mint round is created or edited
     */
    event MintRoundSetup(
        uint256 indexed roundId,
        uint32[2] supply,
        uint64 startTime,
        uint64 duration,
        address validator,
        uint256 price
    );

    /**
     * @notice Event emitted when a token has been revealed
     */
    event TokenRevealed(
        uint256 indexed tokenId,
        address indexed by,
        string uri
    );

    /**
     * @notice Event emitted when `baseURI` has been modified
     */
    event BaseURIChanged(string newBaseURI);

    /**
     * @notice Event emitted when `revealedBaseURI` has been modified
     */
    event RevealedBaseURIChanged(string newBaseURI);

    /**
     * @notice Event emitted when `baseExtension` has been modified
     */
    event BaseExtensionChanged(string newBaseExtension);

    /**
     * @notice Event emitted when `burnable` option has been modified
     */
    event BurnableChanged(bool newBurnable);

    /**
     * @notice Event emitted when `maxMintsPerWallet` has been modified
     */
    event MaxMintsPerWalletChanged(uint256 newMaxMintsPerWallet);

    /**
     * @notice Event emitted when native coin were removed from the contract
     */
    event Withdrawn(address indexed to, uint256 amount);

    /**
     * @notice Event emitted when some ERC20 were removed from the contract
     */
    event TokenWithdrawn(address indexed to, address token, uint256 amount);

    /**
     * ========================
     *          Struct
     * ========================
     */

    /**
     * @notice Container for packing the information of a mint round.
     * @member startTime The start date of the round in seconds
     * @member duration The duration of the round in seconds. Can be 0 for no time limitation
     * @member price The price of the round in ETH (can be 0)
     * @member supply Number of tokens that can be minted in this round by faction. Can be 0 for use the total faction supply
     * @member totalMinted Number of token minted in this round by faction
     * @member validator The address of the whitelist validator. Can be 'address(0)' for no whitelist
     * @member price The price in wei for the round
     */
    struct MintRound {
        uint64 startTime;
        uint64 duration;
        uint32[2] supply;
        uint32[2] totalMinted;
        address validator;
        uint256 price;
    }

    /**
     * ========================
     *          Enums
     * ========================
     */

    enum Faction {
        PURE_GENE,
        ASSIMILEE
    }

    /**
     * ========================
     *         Storage
     * ========================
     */

    /// Role that has the right to manage the URIs for reveal
    bytes32 public constant URI_UPDATER_ROLE = keccak256("URI_UPDATER_ROLE");

    /// Maximum supply for each faction
    uint256[] public MAX_SUPPLY_BY_FACTION;

    /// Maximum supply of all contract
    uint256 public MAX_SUPPLY;

    /// Contract version
    uint256 public version;

    /// Number of tokens that a wallet can mint in a public round
    uint256 public maxMintsPerWallet;

    /// Number of existing mint rounds
    uint256 public roundsLength;

    /// Burned token counter
    uint256 public totalBurned;

    /// If tokens are burnable
    bool public burnable;

    /// The base token URI to add before unrevealed token id
    string public baseURI;

    /// The base token URI to add before revealed token id
    string public revealedBaseURI;

    /// Base extension for the end of token id in `tokenURI` for unrevealed tokens
    string public baseExtension;

    /// Total of minted token
    uint256 internal _totalMinted;

    /// Total of minted token by faction
    uint256[] internal _totalMintedByFaction;

    /// Total of burned token by faction
    uint256[] internal _totalBurnedByFaction;

    /// Map of faction by tokenId
    mapping(uint256 => Faction) public tokenFaction;

    /// All mint rounds (starts at index 1)
    mapping(uint256 => MintRound) internal _rounds;

    // Optional mapping for token reveal URIs
    mapping(uint256 => string) internal _tokenURIs;

    /// Total of minted token by address and round
    mapping(address => mapping(uint256 => uint256))
        public ownerToRoundTotalMinted;

    /// Identifier that can still be minted by faction
    mapping(uint256 => mapping(uint256 => uint256))
        internal _availableIdsByFaction;

    /**
     * ========================
     *          Public
     * ========================
     */

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @notice Initialize contract
     */
    function initialize() public initializer {
        __ERC721_init("2219", "2219");
        __ERC721Burnable_init();
        __AccessControl_init();
        __Pausable_init();
        __Ownable_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();

        // Subscribe to the operator filterer
        __UpdatableOperatorFiltererUpgradeable_init(
            0x000000000000AAeB6D7670E522A718067333cd4E,
            0x3cc6CddA760b79bAfa08dF41ECFA224f810dCeB6,
            true
        );

        // Roles
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(URI_UPDATER_ROLE, msg.sender);

        // Set default royalty to 5% (denominator out of 10000).
        _setDefaultRoyalty(0x3cCC90302A4c9d21AC18D9a6b6666B59Ae459416, 500);

        // Storage initialisation
        version = 2;
        // TO-DO : I removed init of storage ; is that ocrrect ?
        // _totalMintedByFaction = [0, 0];
        // _totalBurnedByFaction = [0, 0];
        // baseExtension = ".json";
        // maxMintsPerWallet = 2;
        // MAX_SUPPLY_BY_FACTION = [1110, 1109];
        // MAX_SUPPLY = 2219;
    }

    /**
     * @notice Mint the `amount` of `factionId` token in a round without validator
     *
     * @dev Call {MechaPilots2219V1-_roundMint}.
     * @dev Requirements:
     * - Round must not have a validator
     * - View {MechaPilots2219V1-_roundMint} requirements
     *
     * @param roundId The mint round index
     * @param factionId The token faction
     * @param amount The number of tokens to mint
     */
    function mint(
        uint256 roundId,
        uint256 factionId,
        uint256 amount
    ) external payable whenNotPaused nonReentrant {
        require(_rounds[roundId].validator == address(0), "Need a sig");
        require(
            ownerToRoundTotalMinted[msg.sender][roundId] + amount <=
                maxMintsPerWallet,
            "Max allowed"
        );
        _roundMint(msg.sender, roundId, factionId, amount);
    }

    /**
     * @notice Mint the `amount` of tokens with the signature of the round validator.
     *
     * @dev Requirements:
     * - Total minted for the user during this round must be less than `maxMint`.
     * - `sig` must be signed by the validator of the round and contains all information to check.
     * - `payloadExpiration` must be less than the block timestamp.
     * - View {MechaPilots2219V1-_roundMint} requirements.
     *
     * @param roundId The mint round index (verified in `sig`)
     * @param factionId The token faction (verified in `sig`)
     * @param amount The number of tokens to mint
     * @param maxMint The maximum token that the user is allowed to mint in the round (verified in `sig`)
     * @param payloadExpiration The maximum timestamp before the signature is considered invalid (verified in `sig`)
     * @param sig The EC signature generated by the round validator
     */
    function mintWithValidation(
        uint256 roundId,
        uint256 factionId,
        uint256 amount,
        uint256 maxMint,
        uint256 payloadExpiration,
        bytes memory sig
    ) external payable whenNotPaused nonReentrant {
        require(_rounds[roundId].validator != address(0), "No round validator");
        require(
            ownerToRoundTotalMinted[msg.sender][roundId] + amount <= maxMint,
            "Max allowed"
        );
        _checkSignature(
            payloadExpiration,
            abi.encodePacked(
                msg.sender,
                payloadExpiration,
                maxMint,
                factionId,
                roundId,
                address(this),
                block.chainid
            ),
            sig,
            _rounds[roundId].validator
        );

        _roundMint(msg.sender, roundId, factionId, amount);
    }

    /**
     * @notice Reveals a user's token using the signature of a URI_UPDATER_ROLE
     *
     * @dev Requirements:
     * - The caller must own `tokenId` or be an approved operator.
     * - `sig` must be signed by a URI_UPDATER_ROLE of the round and contains all information to check.
     * - `payloadExpiration` must be less than the block timestamp.
     *
     * @param tokenId The tokenId (verified in `sig`)
     * @param uri The revealed token uri (verified in `sig`)
     * @param payloadExpiration The maximum timestamp before the signature is considered invalid (verified in `sig`)
     * @param sig The EC signature generated by the round validator
     */
    function revealToken(
        uint256 tokenId,
        string memory uri,
        uint256 payloadExpiration,
        bytes memory sig
    ) external whenNotPaused {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "Not owner nor approved"
        );
        _checkSignatureFromRole(
            payloadExpiration,
            abi.encodePacked(
                msg.sender,
                payloadExpiration,
                tokenId,
                uri,
                address(this),
                block.chainid
            ),
            sig,
            URI_UPDATER_ROLE
        );

        _tokenURIs[tokenId] = uri;
        emit TokenRevealed(tokenId, msg.sender, uri);
    }

    /**
     * @notice Change the tokenURI of a token
     *
     * @dev Requirements:
     * - Only for URI_UPDATER_ROLE.
     *
     * @param tokenId The tokenId
     * @param uri The new token uri
     */
    function setTokenURI(
        uint256 tokenId,
        string memory uri
    ) external onlyRole(URI_UPDATER_ROLE) {
        _requireMinted(tokenId);
        _tokenURIs[tokenId] = uri;
        emit TokenRevealed(tokenId, msg.sender, uri);
    }

    /**
     * @notice Change tokenURI of each token
     *
     * @dev Requirements:
     * - Only for URI_UPDATER_ROLE.
     *
     * @param tokenIds List of tokenIds
     * @param uri List of new token URI
     */
    function setTokenURIPerBatch(
        uint256[] memory tokenIds,
        string[] memory uri
    ) external onlyRole(URI_UPDATER_ROLE) {
        for (uint256 i; i < tokenIds.length; i++) {
            _requireMinted(tokenIds[i]);
            _tokenURIs[tokenIds[i]] = uri[i];
            emit TokenRevealed(tokenIds[i], msg.sender, uri[i]);
        }
    }

    /**
     * @notice Mint the `amount` of token and transfers it to `wallet`.
     *
     * @dev Call {MechaPilots2219V1-_safeMint}.
     * @dev Requirements:
     * - Only owner.
     * - View {MechaPilots2219V1-_safeMint} requirements.
     *
     * @param wallet The wallet to transfer new tokens
     * @param factionId The faction
     * @param amount The number of tokens to mint
     */
    function airdrop(
        address wallet,
        uint256 factionId,
        uint256 amount
    ) external onlyOwner {
        _safeMint(wallet, factionId, amount);
    }

    /**
     * @notice Create or edit a mint round
     *
     * @dev Requirements:
     * - `roundId` must exist or increment `roundsLength` for create one.
     * - `roundId` can't be 0.
     *
     * @param roundId The index of the mint round.
     * @param supply Number of tokens that can be minted in this round by faction. Can be 0 for use the total faction supply
     * @param startTime The start time of the round in unix seconds timestamp. 0 if not set.
     * @param duration The duration of the round in seconds. 0 if ends at sold out.
     * @param validator The address of the whitelist validator. Can be 'address(0)' for no whitelist.
     * @param price The price in wei
     */
    function setupMintRound(
        uint256 roundId,
        uint32[2] memory supply,
        uint64 startTime,
        uint64 duration,
        address validator,
        uint256 price
    ) public onlyOwner {
        require(roundId > 0, "Id can't be 0");
        require(roundId <= roundsLength + 1, "Invalid roundId");

        // Create a new round
        if (roundId == roundsLength + 1) {
            roundsLength++;
        }

        MintRound storage round = _rounds[roundId];
        round.startTime = startTime;
        round.supply = supply;
        round.duration = duration;
        round.validator = validator;
        round.price = price;

        emit MintRoundSetup(
            roundId,
            supply,
            startTime,
            duration,
            validator,
            price
        );
    }

    /**
     * @notice Pause the contract : disables mints, transactions and burns until `unpause`
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause the contract
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @notice Change the baseURI for unrevealed tokens
     */
    function setBaseURI(string memory newBaseURI) external virtual onlyOwner {
        baseURI = newBaseURI;
        emit BaseURIChanged(newBaseURI);
    }

    /**
     * @notice Change the baseURI for revealed tokens
     */
    function setRevealedBaseURI(string memory newBaseURI) external virtual onlyOwner {
        revealedBaseURI = newBaseURI;
        emit RevealedBaseURIChanged(newBaseURI);
    }

    /**
     * @notice Change the URI base extension for unrevealed tokens
     */
    function setBaseExtension(
        string memory newBaseExtension
    ) external onlyOwner {
        baseExtension = newBaseExtension;
        emit BaseExtensionChanged(newBaseExtension);
    }

    /**
     * @notice Activate burnable option
     * @param newBurnable If users are authorized to burn their tokens or not
     */
    function setBurnable(bool newBurnable) public virtual onlyOwner {
        burnable = newBurnable;
        emit BurnableChanged(newBurnable);
    }

    /**
     * @notice Change number of tokens that a wallet can mint in a public round
     */
    function setMaxMintsPerWallet(
        uint256 newMaxMints
    ) external virtual onlyOwner {
        maxMintsPerWallet = newMaxMints;
        emit MaxMintsPerWalletChanged(newMaxMints);
    }

    /**
     * @dev Burns `tokenId`. See {ERC721-_burn}.
     *
     * Requirements:
     * - The burnable feature must be active.
     * - The caller must own `tokenId` or be an approved operator.
     */
    function burn(uint256 tokenId) public virtual override whenNotPaused {
        require(burnable, "Not burnable");
        totalBurned++;
        Faction faction = tokenFaction[tokenId];
        _totalBurnedByFaction[uint256(faction)]++;
        super.burn(tokenId);
    }

    /**
     * @notice Withdraw network native coins
     *
     * @param to The address of the tokens/coins receiver.
     * @param amount Amount to claim.
     */
    function withdraw(address payable to, uint256 amount) public onlyOwner {
        (bool succeed, ) = to.call{value: amount}("");
        require(succeed, "Failed to withdraw");
        emit Withdrawn(to, amount);
    }

    /**
     * @notice Withdraw ERC20
     *
     * @param to The address of the tokens/coins receiver.
     * @param token The address of the token contract.
     * @param amount Amount to claim.
     */
    function withdrawTokens(
        address to,
        address token,
        uint256 amount
    ) public onlyOwner {
        IERC20Upgradeable customToken = IERC20Upgradeable(token);
        customToken.safeTransfer(to, amount);
        emit TokenWithdrawn(to, token, amount);
    }

    /**
     * @notice Sets the royalty information that all ids in this contract will default to.
     *
     * Requirements:
     * - `receiver` cannot be the zero address.
     * - `feeNumerator` cannot be greater than the fee denominator: 10000.
     *
     * @param receiver The address who should receive the fee.
     * @param feeNumerator The fee numerator (out of 10000)
     */
    function setDefaultRoyalty(
        address receiver,
        uint96 feeNumerator
    ) external onlyOwner {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    /**
     * @notice Remove default royalty information
     */
    function deleteDefaultRoyalty() external onlyOwner {
        _deleteDefaultRoyalty();
    }

    /**
     * @dev See {IERC721-setApprovalForAll}.
     *      Check if the operator is allowed by the operator-filter-registry.
     */
    function setApprovalForAll(
        address operator,
        bool approved
    ) public override onlyAllowedOperatorApproval(operator) {
        super.setApprovalForAll(operator, approved);
    }

    /**
     * @dev See {IERC721-approve}.
     *      Check if the operator is allowed by the operator-filter-registry.
     */
    function approve(
        address operator,
        uint256 tokenId
    ) public override onlyAllowedOperatorApproval(operator) {
        super.approve(operator, tokenId);
    }

    /**
     * @dev See {IERC721-transferFrom}.
     *      Check if the operator is allowed by the operator-filter-registry.
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override onlyAllowedOperator(from) {
        super.transferFrom(from, to, tokenId);
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     *      Check if the operator is allowed by the operator-filter-registry.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override onlyAllowedOperator(from) {
        super.safeTransferFrom(from, to, tokenId);
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     *      Check if the operator is allowed by the operator-filter-registry.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public override onlyAllowedOperator(from) {
        super.safeTransferFrom(from, to, tokenId, data);
    }

    /*
     * ========================
     *          Views
     * ========================
     */

    /**
     * @notice Returns the URI of `tokenId`, according to its condition (revealed or not)
     */
    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        _requireMinted(tokenId);

        // If mass reveal
        string memory _revealedBaseURI = revealedBaseURI;
        if (bytes(_revealedBaseURI).length > 0) {
            return string(
                    abi.encodePacked(
                        _revealedBaseURI,
                        tokenId.toString(),
                        baseExtension
                    ));
        }

        // Revealed token
        string memory _tokenURI = _tokenURIs[tokenId];
        if (bytes(_tokenURI).length > 0) {
            return _tokenURI;
        }

        // Not revealed token
        string memory currentBaseURI = baseURI;
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                )
                : "";
    }

    /**
     * @notice Returns true if the `tokenId` is not revealed yet
     */
    function isRevealed(uint256 tokenId) public view virtual returns (bool) {
        string memory _tokenURI = _tokenURIs[tokenId];
        return bytes(_tokenURI).length > 0;
    }

    /**
     * @notice Returns the MintRound structure of `roundId`
     *
     * @dev Better web3 accessibility that a public variable (includes arrays)
     */
    function rounds(uint256 roundId) external view returns (MintRound memory) {
        return _rounds[roundId];
    }

    /**
     * @notice Returns the total balances of tokens. Takes into account the burned ones.
     */
    function totalSupply() public view returns (uint256) {
        return _totalMinted - totalBurned;
    }

    /**
     * @notice Returns the total balances of tokens for `factionId`. Takes into account the burned ones.
     */
    function totalSupplyByFaction(
        uint256 factionId
    ) public view returns (uint256) {
        return
            _totalMintedByFaction[factionId] - _totalBurnedByFaction[factionId];
    }

    /**
     * @notice Returns the total amount of tokens minted for `factionId`.
     */
    function totalMintedByFaction(
        uint256 factionId
    ) public view returns (uint256) {
        return _totalMintedByFaction[factionId];
    }

    /**
     * @notice Returns the total amount of tokens burned for `factionId`.
     */
    function totalBurnedByFaction(
        uint256 factionId
    ) public view returns (uint256) {
        return _totalBurnedByFaction[factionId];
    }

    /**
     * @notice Returns the total amount of tokens minted by `wallet` for `roundId`.
     */
    function totalMintedBy(
        address wallet,
        uint256 roundId
    ) public view returns (uint256) {
        return ownerToRoundTotalMinted[wallet][roundId];
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner()
        public
        view
        override(OwnableUpgradeable, UpdatableOperatorFiltererUpgradeable)
        returns (address)
    {
        return OwnableUpgradeable.owner();
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(
            ERC721Upgradeable,
            ERC721RoyaltyUpgradeable,
            AccessControlUpgradeable
        )
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * ========================
     *          Internal
     * ========================
     */

    /**
     * @notice Safely mint the `amount` of token for `wallet` in a `round`
     * If `faction` is sold out, automatically mint the other
     *
     * @dev Call {MechaPilots2219V1-_safeMint}.
     * @dev Requirements:
     * - round must be active
     * - msg.value must contain the price
     * - The supply of the round for the `faction` must not be exceeded with amount
     * - View {MechaPilots2219V1-_safeMint} Requirements
     *
     * @dev Increase `ownerToRoundTotalMinted`
     *
     * @param wallet The wallet to transfer new tokens
     * @param roundId The mint round index
     * @param factionId The faction
     * @param amount The number of tokens to mint
     */
    function _roundMint(
        address wallet,
        uint256 roundId,
        uint256 factionId,
        uint256 amount
    ) internal {
        MintRound storage round = _rounds[roundId];

        // Round active
        require(
            block.timestamp >= round.startTime &&
                round.startTime > 0 &&
                (round.duration == 0 ||
                    block.timestamp < round.startTime + round.duration),
            "Round not in progress"
        );

        // Correct price
        require(round.price * amount <= msg.value, "Wrong price");

        // If faction supply is sold out, try the other supply
        if (
            round.supply[factionId] != 0 &&
            round.totalMinted[factionId] + amount > round.supply[factionId]
        ) {
            factionId = factionId == 1 ? 0 : 1;
            require(
                (round.supply[factionId] == 0 ||
                    round.totalMinted[factionId] + amount <=
                    round.supply[factionId]),
                "Round supply exceeded"
            );
        }

        // Increase `totalMinted`
        round.totalMinted[factionId] += uint32(amount);

        // Increase round total minted
        ownerToRoundTotalMinted[msg.sender][roundId] += amount;

        // Safe mint
        _safeMint(wallet, factionId, amount);
    }

    /**
     * @notice Safely mint the `amount` of token for `wallet`.
     * If `faction` is sold out, automatically mint the other
     *
     * @dev Requirements:
     * - `amount` must be above 0
     * - `faction` must exist
     * - The supply of the faction must not be exceeded with amount
     *
     * @dev Increase `_totalMinted` and `_totalMintedByFaction`
     *
     * @param wallet The wallet to transfer new tokens
     * @param factionId The faction
     * @param amount The number of tokens to mint
     */
    function _safeMint(
        address wallet,
        uint256 factionId,
        uint256 amount
    ) internal {
        Faction faction = Faction(factionId);
        require(amount > 0, "Zero amount");
        require(_totalMinted + amount <= MAX_SUPPLY, "Supply exceeded");

        // If faction supply is sold out, try the other supply
        if (
            _totalMintedByFaction[factionId] + amount >
            MAX_SUPPLY_BY_FACTION[factionId]
        ) {
            factionId = factionId == 1 ? 0 : 1;
            require(
                _totalMintedByFaction[factionId] + amount <=
                    MAX_SUPPLY_BY_FACTION[factionId],
                "All factions supply exceeded"
            );
        }

        // Increase totalMinted
        uint256 beforeMintTotalMintedByFaction = _totalMintedByFaction[
            factionId
        ];
        _totalMinted += amount;
        _totalMintedByFaction[factionId] += amount;

        // Mint
        for (uint256 i = 0; i < amount; i++) {
            uint256 tokenId = _getRandomToken(
                wallet,
                beforeMintTotalMintedByFaction + i,
                factionId
            );
            _mint(wallet, tokenId);
            if (factionId != 0) {
                tokenFaction[tokenId] = faction;
            }
        }
    }

    /**
     * @notice Gives a identifier from a pseudo random function (inspired by Cyberkongs VX)
     *
     * @param wallet The wallet to complexify the random
     * @param totalMinted Updated total minted
     * @param factionId The faction
     */
    function _getRandomToken(
        address wallet,
        uint256 totalMinted,
        uint256 factionId
    ) internal returns (uint256) {
        uint256 remaining = MAX_SUPPLY_BY_FACTION[factionId] - totalMinted;
        mapping(uint256 => uint256)
            storage availableIds = _availableIdsByFaction[factionId];

        uint256 rand = (uint256(
            keccak256(
                abi.encodePacked(
                    wallet,
                    block.difficulty,
                    block.timestamp,
                    remaining
                )
            )
        ) % remaining);
        uint256 value = rand;

        if (availableIds[rand] != 0) {
            value = availableIds[rand];
        }

        if (availableIds[remaining - 1] == 0) {
            availableIds[rand] = remaining - 1;
        } else {
            availableIds[rand] = availableIds[remaining - 1];
            delete availableIds[remaining - 1];
        }

        // Add the max supply of the previous faction if it exists
        if (factionId > 0) {
            return value + 1 + MAX_SUPPLY_BY_FACTION[factionId - 1];
        }
        return value + 1;
    }

    /**
     * @notice Reverts if the data does not correspond to the signature, to the correct signer or if it has expired
     *
     * @dev Requirements:
     * - `payloadExpiration` must be less than the block timestamp
     * - `sig` must be a hash of `data`
     * - `sig` must be signed by `signer`
     *
     * @param payloadExpiration The maximum timestamp before the signature is considered invalid
     * @param data All encoded pack data in order
     * @param sig The EC signature generated by the signatory
     * @param signer The address that is supposed to be the signatory
     */
    function _checkSignature(
        uint256 payloadExpiration,
        bytes memory data,
        bytes memory sig,
        address signer
    ) internal view {
        require(payloadExpiration >= block.timestamp, "Signature expired");
        require(
            keccak256(data).toEthSignedMessageHash().recover(sig) == signer,
            "Invalid signature"
        );
    }

    /**
     * @notice Reverts if the data does not correspond to the signature, the signer has not corresponding `role` or if it has expired
     *
     * @dev Requirements:
     * - `payloadExpiration` must be less than the block timestamp
     * - `sig` must be a hash of `data`
     * - `sig` must be signed by `signer`
     *
     * @param payloadExpiration The maximum timestamp before the signature is considered invalid
     * @param data All encoded pack data in order
     * @param sig The EC signature generated by the signatory
     * @param role The role that the signer must have
     */
    function _checkSignatureFromRole(
        uint256 payloadExpiration,
        bytes memory data,
        bytes memory sig,
        bytes32 role
    ) internal view {
        require(payloadExpiration >= block.timestamp, "Signature expired");
        require(
            hasRole(
                role,
                keccak256(data).toEthSignedMessageHash().recover(sig)
            ),
            "Invalid signature"
        );
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721Upgradeable, ERC721RoyaltyUpgradeable) {
        ERC721Upgradeable._burn(tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _authorizeUpgrade(address) internal override onlyOwner {
        version++;
    }

    receive() external payable {}
}
