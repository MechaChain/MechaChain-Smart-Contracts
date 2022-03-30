// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
Questions : 
- burnable ?
- max per round or max per transaction ?
- Name of the ERC721
- Withdraw  
- Storage gap ?
- Airdrop ?
 */

/**
TODO : burnable with option
TODO : withdraw 
 */
contract MechaLandsV1 is
    Initializable,
    ERC721Upgradeable,
    PausableUpgradeable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable
{
    using Strings for uint256;
    using ECDSA for bytes32;
    /**
     * ========================
     *          Events
     * ========================
     */

    /**
     * @notice Event emitted when a planet is created or edited
     */
    event PlanetSetup(
        uint256 indexed planetId,
        uint16 typesNumber,
        uint32[] supplyPerType,
        string[] notRevealUriPerType
    );

    /**
     * @notice Event emitted when a mint round of a planet is created or edited
     */
    event PlanetMintRoundSetup(
        uint256 indexed roundId,
        uint256 planetId,
        uint64 startTime,
        uint64 duration,
        address validator,
        bool limitedPerType,
        uint256[] pricePerType,
        uint256[] supplyPerType,
        uint256[] maxMintPerType
    );

    /**
     * @notice Event emitted when a planet has been revealed
     */
    event PlanetRevealed(uint256 indexed planetId, string baseURI);

    /**
     * @notice Event emitted when the baseURI of all lands of a planet has been changed
     */
    event PlanetBaseURIChanged(uint256 indexed planetId, string baseURI);

    /**
     * ========================
     *          Struct
     * ========================
     */

    /**
     * @notice Container for packing the information of a planet.
     * @member revealed If the lands of the planet are revealed (add the id after token URI).
     * @member baseURI The base token URI use after reveal.
     * @member typesNumber Number of land types for this planet.
     * @member supplyPerType Maximum number of land by type.
     * @member totalMinted Number of minted tokens by land type.
     * @member notRevealUriPerType The not reveal token URI by land type.
     */
    struct Planet {
        bool revealed;
        uint16 typesNumber;
        string baseURI;
        mapping(uint256 => uint256) supplyPerType;
        mapping(uint256 => uint256) totalMintedPerType;
        mapping(uint256 => string) notRevealUriPerType;
    }

    /**
     * @notice Container for packing the information of a planet mint round.
     * @member limitedPerType If the max mint limitation per wallet is defined par type or far all types.
     * @member planetId The planet index for which users can mint during the current round.
     * @member startTime The start time of the round in unix timestamp. 0 if not set.
     * @member duration The duration of the round in seconds. 0 if ends at sold out.
     * @member validator The address of the whitelist validator. Can be 'address(0)' for no whitelist.
     * @member pricePerType The price by land type of the round in wei.
     * @member supplyPerType The round supply by land type.
     * @member maxMintPerType The maximum number of tokens that a user can mint per type during the round.
     * @member totalMintedPerType The round total minted token by land type.
     * @member totalMintedPerUser The round total minted token by wallet.
     * @member totalMintedPerTypePerUser Number of mint per land type and per user during the round.
     */
    struct MintRound {
        bool limitedPerType;
        uint64 planetId;
        uint64 startTime;
        uint64 duration;
        address validator;
        mapping(uint256 => uint256) pricePerType;
        mapping(uint256 => uint256) supplyPerType;
        mapping(uint256 => uint256) maxMintPerType;
        mapping(uint256 => uint256) totalMintedPerType;
        mapping(address => uint256) totalMintedPerUser;
        mapping(address => mapping(uint256 => uint256)) totalMintedPerTypePerUser;
    }

    /**
     * ========================
     *         Storage
     * ========================
     */

    /// Contract version
    uint256 public version;

    /// Last minted token id
    uint256 internal _tokenIdCounter;

    /// Number of existing planets
    uint256 public planetsLength;

    /// Number of existing mint rounds
    uint256 public roundsLength;

    /// Base extension for the end of token id
    string public baseExtension;

    /// All MechaChain planets (starts at index 1)
    mapping(uint256 => Planet) public planets;

    /// All mint rounds (starts at index 1)
    mapping(uint256 => MintRound) public rounds;

    /// Land type per token
    mapping(uint256 => uint256) public tokenType;

    /// Planet per token
    mapping(uint256 => uint256) public tokenPlanet;

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
        __ERC721_init("MechaLands", "ML");
        __Pausable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
        baseExtension = ".json";
        version = 1;
    }

    /**
     * @notice Mint the `amount` of planet land type in a round without validator
     *
     * @dev Call {MechaLandsV1-_roundMint}.
     * @dev Requirements:
     * - Round must not have a validator
     * - View {MechaLandsV1-_roundMint} requirements
     *
     * @param roundId The mint round index
     * @param landType The type of the land
     * @param amount The number of lands to mint
     */
    function mint(
        uint256 roundId,
        uint256 landType,
        uint256 amount
    ) external payable whenNotPaused nonReentrant {
        require(rounds[roundId].validator == address(0), "Need a sig");

        _roundMint(msg.sender, roundId, landType, amount);
    }

    /**
     * @notice Mint the `amount` of planet land type with the signature of the round validator.
     *
     * @dev Requirements:
     * - Total minted for the user during this round must be less than `maxMint`.
     *   If round is `limitedPerType`, the condition is only for the `landType` total.
     * - `sig` must be signed by the validator of the round and contains all information to check.
     * - `payloadExpiration` must be less than the block timestamp.
     * - View {MechaLandsV1-_roundMint} requirements.
     *
     * @param roundId The mint round index (verified in `sig`)
     * @param landType The type of the land (verified in `sig`)
     * @param amount The number of lands to mint
     * @param maxMint The maximum token that the user is allowed to mint in the round for this landType (verified in `sig`)
     * @param payloadExpiration The maximum timestamp before the signature is considered invalid (verified in `sig`)
     * @param sig The EC signature generated by the round validator
     */
    function mintWithValidation(
        uint256 roundId,
        uint256 landType,
        uint256 amount,
        uint256 maxMint,
        uint256 payloadExpiration,
        bytes memory sig
    ) external payable whenNotPaused nonReentrant {
        _checkSignature(
            msg.sender,
            payloadExpiration,
            maxMint,
            landType,
            roundId,
            sig,
            rounds[roundId].validator
        );

        uint256 totalRoundMinted = rounds[roundId].limitedPerType
            ? rounds[roundId].totalMintedPerTypePerUser[msg.sender][landType]
            : rounds[roundId].totalMintedPerUser[msg.sender];
        require(totalRoundMinted + amount <= maxMint, "Validator max allowed");

        _roundMint(msg.sender, roundId, landType, amount);
    }

    /**
     * @notice Create or edit a planet.
     *
     * @dev Requirements:
     * - `planetId` must exist or increment `planetsLength` for create one.
     * - `planetId` can be 0.
     * - The number of types cannot be lower than the previous one.
     * - `supplyPerType` and `notRevealUriPerType` must have a length of `typesNumber`.
     * - A supply can by lower than the number of mint for the same type.
     *
     * @param planetId The index of the planet.
     * @param typesNumber Number of land types for this planet.
     * @param supplyPerType Maximum number of land by type.
     * @param notRevealUriPerType The base token URI by land type (or all the not reveal URI if not revealed).
     */
    function setupPlanet(
        uint256 planetId,
        uint16 typesNumber,
        uint32[] memory supplyPerType,
        string[] memory notRevealUriPerType
    ) public onlyOwner {
        require(planetId > 0, "Can be 0");
        require(
            planets[planetId].typesNumber <= typesNumber,
            "Can decrease types"
        );
        require(
            supplyPerType.length == typesNumber &&
                notRevealUriPerType.length == typesNumber &&
                typesNumber > 0,
            "Incorrect length"
        );

        if (planetId == planetsLength + 1) {
            planetsLength += 1;
        } else {
            require(planetId <= planetsLength, "Invalid planetId");
        }

        planets[planetId].typesNumber = typesNumber;
        for (uint256 i; i < typesNumber; i++) {
            require(
                planets[planetId].totalMintedPerType[i + 1] <= supplyPerType[i],
                "Supply lower than already minted"
            );

            planets[planetId].supplyPerType[i + 1] = supplyPerType[i];
            planets[planetId].notRevealUriPerType[i + 1] = notRevealUriPerType[
                i
            ];
        }

        emit PlanetSetup(
            planetId,
            typesNumber,
            supplyPerType,
            notRevealUriPerType
        );
    }

    /**
     * @notice Activate token revelation for a planet and set his base URI
     *
     * @dev Can be called only once per planet
     *
     * @param planetId The index of the planet.
     * @param baseURI The baseURI for all lands on this planet.
     */
    function revealPlanet(uint256 planetId, string memory baseURI)
        public
        onlyOwner
    {
        require(!planets[planetId].revealed, "Already revealed");
        planets[planetId].revealed = true;
        planets[planetId].baseURI = baseURI;
        emit PlanetRevealed(planetId, baseURI);
    }

    /**
     * @notice Change the base URI of a planet
     *
     * @param planetId The index of the planet.
     * @param baseURI The baseURI for all lands on this planet.
     */
    function setPlanetBaseURI(uint256 planetId, string memory baseURI)
        public
        onlyOwner
    {
        planets[planetId].baseURI = baseURI;
        emit PlanetBaseURIChanged(planetId, baseURI);
    }

    /**
     * @notice Create or edit a mint round for a planet
     *
     * @dev `supplyPerType` of the round can be greater than the one of the planet. In this case,
     *       it is the supply of the planet that will be taken into account.
     *
     * @dev Requirements:
     * - `roundId` must exist or increment `roundsLength` for create one.
     * - `roundId` can be 0.
     * - The number of types cannot be lower than the previous one.
     * - `supplyPerType` and `pricePerType` must have a length of planet's `typesNumber`.
     * - A supply can by lower than the number of round mint for the same type.
     *
     * @param roundId The index of the planet mint round.
     * @param planetId The index of the planet.
     * @param startTime The start time of the round in unix timestamp. 0 if not set.
     * @param duration The duration of the round in seconds. 0 if ends at sold out.
     * @param validator The address of the whitelist validator. Can be 'address(0)' for no whitelist.
     * @param limitedPerType If the max mint limitation per wallet is defined par type or far all types.
     * @param pricePerType The price by land type of the round in wei.
     * @param supplyPerType The round supply by land type.
     * @param maxMintPerType The maximum number of tokens that a user can mint per type during the round. If `limitedPerType`, all values should be the same.
     */

    function setupMintRound(
        uint256 roundId,
        uint256 planetId,
        uint64 startTime,
        uint64 duration,
        address validator,
        bool limitedPerType,
        uint256[] memory pricePerType,
        uint256[] memory supplyPerType,
        uint256[] memory maxMintPerType
    ) public onlyOwner {
        require(roundId > 0, "Can be 0");

        if (roundId == roundsLength + 1) {
            roundsLength += 1;
        } else {
            require(roundId <= roundsLength, "Invalid roundId");
        }

        MintRound storage round = rounds[roundId];
        round.startTime = startTime;
        round.duration = duration;
        round.validator = validator;
        round.limitedPerType = limitedPerType;

        require(
            pricePerType.length == planets[planetId].typesNumber &&
                pricePerType.length == planets[planetId].typesNumber &&
                maxMintPerType.length == planets[planetId].typesNumber,
            "Incorrect length"
        );

        for (uint256 i; i < supplyPerType.length; i++) {
            require(
                round.totalMintedPerType[i + 1] <= supplyPerType[i],
                "Supply lower than already minted"
            );
            round.pricePerType[i + 1] = pricePerType[i];
            round.supplyPerType[i + 1] = supplyPerType[i];
            round.maxMintPerType[i + 1] = maxMintPerType[i];
        }

        emit PlanetMintRoundSetup(
            roundId,
            planetId,
            startTime,
            duration,
            validator,
            limitedPerType,
            pricePerType,
            supplyPerType,
            maxMintPerType
        );
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    /*
     * ========================
     *          Views
     * ========================
     */

    /**
     * @notice Returns the URI of `tokenId` or the not revealed uri, according to its planet and land type
     */
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        uint256 planetId = tokenPlanet[tokenId];

        if (!planets[planetId].revealed) {
            uint256 landType = tokenType[tokenId];
            return planets[planetId].notRevealUriPerType[landType];
        } else {
            string memory currentBaseURI = planets[planetId].baseURI;
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
    }

    /**
     * @notice Returns the total amount of tokens minted.
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter; // TODO remove burned tokens
    }

    /**
     * @notice Return the supply of `landType` for `planetId`
     */
    function planetSupplyByType(uint256 planetId, uint256 landType)
        public
        view
        returns (uint256)
    {
        return planets[planetId].supplyPerType[landType];
    }

    /**
     * @notice Return the total minted of `landType` for `planetId`
     */
    function planetTotalMintedByType(uint256 planetId, uint256 landType)
        public
        view
        returns (uint256)
    {
        return planets[planetId].totalMintedPerType[landType];
    }

    /**
     * @notice Return the not reveal URI of `landType` for `planetId`
     */
    function planetNotRevealUriByType(uint256 planetId, uint256 landType)
        public
        view
        returns (string memory)
    {
        return planets[planetId].notRevealUriPerType[landType];
    }

    /**
     * @notice Return the supply of `landType` for `roundId`
     */
    function roundSupplyByType(uint256 roundId, uint256 landType)
        public
        view
        returns (uint256)
    {
        return rounds[roundId].supplyPerType[landType];
    }

    /**
     * @notice Return the price of a single `landType` for `roundId`
     */
    function roundPriceByType(uint256 roundId, uint256 landType)
        public
        view
        returns (uint256)
    {
        return rounds[roundId].pricePerType[landType];
    }

    /**
     * @notice Return the total minted of `landType` for `roundId`
     */
    function roundTotalMintedByType(uint256 roundId, uint256 landType)
        public
        view
        returns (uint256)
    {
        return rounds[roundId].totalMintedPerType[landType];
    }

    /**
     * @notice Return the total minted of `landType` for `user` in `roundId`
     */
    function roundTotalMintedByTypeForUser(
        address user,
        uint256 roundId,
        uint256 landType
    ) public view returns (uint256) {
        return rounds[roundId].totalMintedPerTypePerUser[user][landType];
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
     * @notice Safely mint the `amount` of planet land type for `wallet` in a `round`
     *
     * @dev Call {MechaLandsV1-_safeMint}.
     * @dev Requirements:
     * - round must be active
     * - msg.value must contain the price
     * - The supply of the round for the land type must not be exceeded with amount
     * - View {MechaLandsV1-_safeMint} Requirements
     *
     * @dev Increase `totalMintedPerType` and `totalMintedPerTypePerUser` of the round
     *
     * @param wallet The wallet to transfer new tokens
     * @param roundId The mint round index
     * @param landType The type of the land
     * @param amount The number of lands to mint
     */
    function _roundMint(
        address wallet,
        uint256 roundId,
        uint256 landType,
        uint256 amount
    ) internal {
        MintRound storage round = rounds[roundId];
        require(
            block.timestamp > round.startTime &&
                round.startTime > 0 &&
                (round.duration == 0 ||
                    block.timestamp < round.startTime + round.duration),
            "Round not in progress"
        );
        require(
            round.pricePerType[landType] * amount <= msg.value,
            "Wrong price"
        );
        require(
            round.totalMintedPerType[landType] + amount <=
                round.supplyPerType[landType],
            "Round supply exceeded"
        );

        uint256 totalRoundMinted = round.limitedPerType
            ? round.totalMintedPerTypePerUser[msg.sender][landType]
            : round.totalMintedPerUser[msg.sender];
        require(
            totalRoundMinted + amount <= round.maxMintPerType[landType],
            "Round max allowed"
        );

        _safeMint(wallet, round.planetId, landType, amount);

        // Increase round total minted
        round.totalMintedPerType[landType] += amount;
        round.totalMintedPerTypePerUser[wallet][landType] += amount;
        round.totalMintedPerUser[msg.sender] += amount;
    }

    /**
     * @notice Safely mint the `amount` of planet land type for `wallet`
     *
     * @dev Requirements:
     * - `amount` must be above 0
     * - `landType` must exist
     * - The supply of the planet's land type must not be exceeded with amount
     *
     * @dev Increase `totalMintedPerType` of the planet
     *
     * @param wallet The wallet to transfer new tokens
     * @param planetId The planet index
     * @param landType The type of the land
     * @param amount The number of lands to mint
     */
    function _safeMint(
        address wallet,
        uint256 planetId,
        uint256 landType,
        uint256 amount
    ) internal {
        Planet storage planet = planets[planetId];
        require(landType < planet.typesNumber, "Incorrect type");
        require(amount > 0, "Zero amount");
        require(
            planet.totalMintedPerType[landType] + amount <=
                planet.supplyPerType[landType],
            "Planet supply exceeded"
        );
        // Mint
        uint256 tokenId = _tokenIdCounter;
        for (uint256 i = 0; i < amount; i++) {
            tokenId++;
            _safeMint(wallet, tokenId);
            tokenType[tokenId] = landType;
            tokenPlanet[tokenId] = planetId;
        }
        _tokenIdCounter = tokenId;

        // Increase planet total minted
        planet.totalMintedPerType[landType] += amount;
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
     * @param landType The landType that is allowed to mint
     * @param roundId The roundId that is allowed to mint
     * @param sig The EC signature generated by the signatory
     * @param signer The address that is supposed to be the signatory
     */
    function _checkSignature(
        address wallet,
        uint256 payloadExpiration,
        uint256 maxMint,
        uint256 landType,
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
                    landType,
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
    {}
}
