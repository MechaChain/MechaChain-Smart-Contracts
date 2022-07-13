// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

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
    PausableUpgradeable,
    OwnableUpgradeable,
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
        address validator
    );

    /**
     * @notice Event emitted when a user mint for the Fair Dutch Auction
     */
    event MintPaid(
        uint256 indexed roundId,
        address indexed wallet,
        uint256 amount,
        uint256 payement
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
     * @notice Event emitted when `burnable` option has been modified
     */
    event BurnableChanged(bool newBurnable);

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
     * @member price The price configuration for a single token in the round
     */
    struct MintRound {
        uint64 startTime;
        uint64 duration;
        uint32[2] supply;
        uint32[2] totalMinted;
        address validator;
        MintPrice price;
    }

    /**
     * @notice Container for packing the configuration of a price variation
     * @member max The maximum price which will be decreasing in wei
     * @member min The minimum price after which it no longer decreases in wei
     * @member decreaseAmount The number of wei that will be subtracted from the price every `decreaseTime` (0 if no decrease)
     * @member decreaseTime The number of seconds to wait between each decreasing
     */
    struct MintPrice {
        uint256 max;
        uint256 min;
        uint256 decreaseTime;
        uint256 decreaseAmount;
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

    /// Maximum supply of all contract
    uint256 public constant MAX_SUPPLY = 2219;

    /// Maximum supply for each faction
    uint256[] public MAX_SUPPLY_BY_FACTION = [1109, 1110];

    /// Contract version
    uint256 public version;

    /// Total of minted token
    uint256 private _totalMinted;

    /// Total of minted token by faction
    uint256[] private _totalMintedByFaction;

    /// Burned token counter
    uint256 public burnedCounter;

    /// Number of existing mint rounds
    uint256 public roundsLength;

    /// Map of faction by tokenId
    mapping(uint256 => Faction) public tokenFaction;

    /// All mint rounds (starts at index 1)
    mapping(uint256 => MintRound) public rounds;

    /// Identifier that can still be minted
    mapping(uint256 => uint256) private availableIds;

    /// Total of minted token by address and round
    mapping(address => mapping(uint256 => uint256)) ownerToRoundTotalMinted;

    /**
     * ========================
     *          Public
     * ========================
     */

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    /**
     * @notice Initialize contract
     */
    function initialize() public initializer {
        __ERC721_init("2219", "2219");
        __ERC721Burnable_init();
        __Pausable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
        version = 1;
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
    ) external payable whenNotPaused {
        require(rounds[roundId].validator == address(0), "Need a sig");
        // TODO check max
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
    ) external payable whenNotPaused {
        require(rounds[roundId].validator != address(0), "No round validator");
        require(
            ownerToRoundTotalMinted[msg.sender][roundId] + amount <= maxMint,
            "Validator max allowed"
        );
        _checkSignature(
            msg.sender,
            payloadExpiration,
            maxMint,
            factionId,
            roundId,
            sig,
            rounds[roundId].validator
        );

        _roundMint(msg.sender, roundId, factionId, amount);
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
     * - `roundId` can be 0.
     *
     * @param roundId The index of the mint round.
     * @param supply Number of tokens that can be minted in this round by faction. Can be 0 for use the total faction supply
     * @param startTime The start time of the round in unix seconds timestamp. 0 if not set.
     * @param duration The duration of the round in seconds. 0 if ends at sold out.
     * @param validator The address of the whitelist validator. Can be 'address(0)' for no whitelist.
     * @param maxPrice The maximum price which will be decreasing in wei
     * @param minPrice The minimum price after which it no longer decreases in wei
     * @param priceDecreaseTime The number of wei that will be subtracted from the price every `decreaseTime` (0 if no decrease)
     * @param priceDecreaseAmount The number of seconds to wait between each decreasing (must be > 900)
     */
    function setupMintRound(
        uint256 roundId,
        uint32[2] memory supply,
        uint64 startTime,
        uint64 duration,
        address validator,
        uint256 maxPrice,
        uint256 minPrice,
        uint256 priceDecreaseTime,
        uint256 priceDecreaseAmount
    ) public onlyOwner {
        require(roundId > 0, "Id can't be 0");
        require(roundId <= roundsLength + 1, "Invalid roundId");
        require(maxPrice >= minPrice, "Wrong price");

        // Create a new round
        if (roundId == roundsLength + 1) {
            roundsLength += 1;
        }

        MintRound storage round = rounds[roundId];
        round.startTime = startTime;
        round.supply = supply;
        round.duration = duration;
        round.validator = validator;
        round.price = MintPrice({
            max: maxPrice,
            min: minPrice,
            decreaseTime: priceDecreaseTime,
            decreaseAmount: priceDecreaseAmount
        });

        emit MintRoundSetup(roundId, supply, startTime, duration, validator);
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
     * @dev Burns `tokenId`. See {ERC721-_burn}.
     *
     * Requirements:
     * - The planet of `tokenId` must be burnable.
     * - The caller must own `tokenId` or be an approved operator.
     */
    function burn(uint256 tokenId) public virtual override whenNotPaused {
        // uint256 planetId = tokenPlanet[tokenId];
        // require(planets[planetId].burnable, "Planet not burnable");
        // burnedCounter++;
        // TODO
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

    /*
     * ========================
     *          Views
     * ========================
     */

    /**
     * @notice Returns the URI of `tokenId`, according to its condition (revealed or not)
     */
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        // TODO
        return "";
    }

    /**
     * @notice Returns the total amount of tokens minted.
     */
    function totalSupply() public view returns (uint256) {
        return _totalMinted - burnedCounter;
    }

    /**
     * @notice Returns the total amount of tokens minted by `wallet` for `roundId`.
     */
    function totalMintedBy(address wallet, uint256 roundId)
        public
        view
        returns (uint256)
    {
        return ownerToRoundTotalMinted[wallet][roundId];
    }

    /**
     * @notice Get the round price according to the Dutch Auction configuration
     * @param roundId The round index
     */
    function roundPrice(uint256 roundId) public view returns (uint256) {
        MintRound memory round = rounds[roundId];
        MintPrice memory price = round.price;

        if (price.decreaseTime == 0 || block.timestamp < round.startTime) {
            return price.max;
        }
        uint256 decreaseBy = ((block.timestamp - round.startTime) /
            price.decreaseTime) * price.decreaseAmount;

        if (decreaseBy > price.max || price.max - decreaseBy <= price.min) {
            return price.min;
        }
        return price.max - decreaseBy;
    }

    function chainid() public view returns (uint256) {
        return block.chainid;
    }

    /**
     * ========================
     *          Internal
     * ========================
     */

    /**
     * @notice Safely mint the `amount` of token for `wallet` in a `round`
     *
     * @dev Call {MechaPilots2219V1-_safeMint}.
     * @dev Requirements:
     * - round must be active
     * - msg.value must contain the price
     * - The supply of the round for the `faction` must not be exceeded with amount
     * - msg.sender must not be a smart contract
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
        MintRound storage round = rounds[roundId];

        // No smart contract
        require(
            msg.sender == tx.origin,
            "Minting from smart contracts is disallowed"
        );

        // Round active
        require(
            block.timestamp >= round.startTime &&
                round.startTime > 0 &&
                (round.duration == 0 ||
                    block.timestamp < round.startTime + round.duration),
            "Round not in progress"
        );

        // Correct price
        require(roundPrice(roundId) * amount <= msg.value, "Wrong price");

        // Round supply requirements
        require(
            (round.supply[factionId] == 0 ||
                round.totalMinted[factionId] + amount <=
                round.supply[factionId]),
            "Wave supply exceeded"
        );

        // Increase `totalMinted` if needed
        if (round.supply[factionId] != 0) {
            round.totalMinted[factionId] += uint32(amount);
        }

        // Safe mint
        _safeMint(wallet, factionId, amount);

        // TODO emit MintPaid

        // Increase round total minted
        ownerToRoundTotalMinted[msg.sender][roundId] += amount;
    }

    /**
     * @notice Safely mint the `amount` of token for `wallet`
     *
     * @dev Requirements:
     * - `amount` must be above 0
     * - `faction` must exist
     * - The supply of the faction must not be exceeded with amount
     *
     * @dev Increase `_totalMinted`
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
        require(
            _totalMintedByFaction[factionId] + amount <=
                MAX_SUPPLY_BY_FACTION[factionId],
            "Faction supply exceeded"
        );

        // Mint
        for (uint256 i = 0; i < amount; i++) {
            uint256 tokenId = _getRandomToken(wallet, _totalMinted + i);
            _mint(wallet, tokenId);
            tokenFaction[tokenId] = faction;
        }
        _totalMinted += amount;
        _totalMintedByFaction[factionId] += amount;
    }

    /**
     * @notice Gives a identifier from a pseudo random function (inspired by Cyberkongs VX)
     *
     * @param wallet The wallet to complexify the random
     * @param totalMinted Updated total minted
     */
    function _getRandomToken(address wallet, uint256 totalMinted)
        internal
        returns (uint256)
    {
        uint256 remaining = MAX_SUPPLY - totalMinted;
        uint256 rand = (uint256(
            keccak256(
                abi.encodePacked(
                    wallet,
                    block.difficulty,
                    block.timestamp,
                    remaining
                )
            )
        ) % remaining) + 1;
        uint256 value = rand;

        if (availableIds[rand] != 0) {
            value = availableIds[rand];
        }

        if (availableIds[remaining - 1] == 0) {
            availableIds[rand] = remaining - 1;
        } else {
            availableIds[rand] = availableIds[remaining - 1];
        }

        return value;
    }

    /**
     * @notice Reverts if the data does not correspond to the signature, to the correct validator or if it has expired
     *
     * @dev Requirements:
     * - `payloadExpiration` must be less than the block timestamp
     * - `sig` must be a hash of the concatenation of `wallet`, `payloadExpiration`, contract's address and contract's chainid
     * - `sig` must be signed by `signer`
     *
     * @param wallet The user wallet
     * @param payloadExpiration The maximum timestamp before the signature is considered invalid
     * @param maxMint The maximum token that the user is allowed to mint in the round
     * @param factionId The faction that is allowed to mint
     * @param roundId The roundId that is allowed to mint
     * @param sig The EC signature generated by the signatory
     * @param signer The address that is supposed to be the signatory
     */
    function _checkSignature(
        address wallet,
        uint256 payloadExpiration,
        uint256 maxMint,
        uint256 factionId,
        uint256 roundId,
        bytes memory sig,
        address signer
    ) internal view {
        require(payloadExpiration >= block.timestamp, "Signature expired");
        require(
            keccak256(
                abi.encodePacked(
                    wallet,
                    payloadExpiration,
                    maxMint,
                    factionId,
                    roundId,
                    address(this),
                    block.chainid
                )
            ).toEthSignedMessageHash().recover(sig) == signer,
            "Invalid signature"
        );
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {
        version++;
    }

    receive() external payable {}
}
