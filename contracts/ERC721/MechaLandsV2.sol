// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol";
import "./MechaLandsV1.sol";
import "../../libs/operator-filter-registry-v1.4.1/src/upgradeable/UpdatableOperatorFiltererUpgradeable.sol";

/**
 * @title MechaLands - Collection of unique lands on the surface of the planets of the MechaChain universe ; at the heart of space colonization
 * @author MechaChain - <https://mechachain.io/>
 * @custom:project-website  https://mechachain.io/
 * @custom:security-contact contracts@ethernalhorizons.com
 */
contract MechaLandsV2 is
    MechaLandsV1,
    ERC2981Upgradeable,
    UpdatableOperatorFiltererUpgradeable
{
    using Strings for uint256;
    using ECDSA for bytes32;
    using SafeERC20Upgradeable for IERC20Upgradeable;

    /**
     * ========================
     *         Storage
     * ========================
     */

    /// ERC20 mechanium token for payment
    IERC20Upgradeable public mechaniumToken;

    /// Payment type per round (0 = network native coins / 1 = mechanium)
    mapping(uint256 => uint256) public roundPaymentType;

    /**
     * ========================
     *          Events
     * ========================
     */

    /**
     * @notice Event emitted when owner set or change the ERC20 mechanium address
     */
    event MechaniumTokenChanged(address indexed token);

    /**
     * @notice Event emitted when owner set or change the payment type of a round
     */
    event PlanetRoundPaymentTypeChanged(
        uint256 indexed roundId,
        uint256 paymentType
    );

    /**
     * ========================
     *          Public
     * ========================
     */

    function initializeV2() public reinitializer(2) {
        // Subscribe to the operator filterer
        __UpdatableOperatorFiltererUpgradeable_init(
            0x000000000000AAeB6D7670E522A718067333cd4E,
            0x3cc6CddA760b79bAfa08dF41ECFA224f810dCeB6,
            true
        );

        // Set default royalty to 5% (denominator out of 10000).
        _setDefaultRoyalty(0x3cCC90302A4c9d21AC18D9a6b6666B59Ae459416, 500);
    }

    /**
     * @notice Create or edit a mint round for a planet with mechanium payment
     *
     * @dev Requirements:
     * - 'mechaniumToken' has to be set.
     * - View {MechaLandsV1-setupMintRound} requirements.
     *
     * @param roundId The index of the planet mint round.
     * @param planetId The index of the planet.
     * @param startTime The start time of the round in unix seconds timestamp. 0 if not set.
     * @param duration The duration of the round in seconds. 0 if ends at sold out.
     * @param validator The address of the whitelist validator. Can be 'address(0)' for no whitelist.
     * @param limitedPerType If the max mint limitation per wallet is defined par type or far all types.
     * @param pricePerType The price by land type of the round in wei.
     * @param supplyPerType The round supply by land type.
     * @param maxMintPerType The maximum number of tokens that a user can mint per type during the round. If `limitedPerType`, all values should be the same.
     */
    function setupMechaniumMintRound(
        uint256 roundId,
        uint64 planetId,
        uint64 startTime,
        uint64 duration,
        address validator,
        bool limitedPerType,
        uint256[] memory pricePerType,
        uint256[] memory supplyPerType,
        uint256[] memory maxMintPerType
    ) public onlyOwner {
        require(
            address(mechaniumToken) != address(0),
            "Mechanium token not set"
        );

        MechaLandsV1.setupMintRound(
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
        roundPaymentType[roundId] = 1;
        emit PlanetRoundPaymentTypeChanged(roundId, 1);
    }

    /**
     * @notice Change the payment type of a round
     *
     * @dev Requirements:
     * - `roundId` must exist
     * - `roundId` can be 0.
     * - 'mechaniumToken' has to be set.
     * - View {MechaLandsV1-setupMintRound} requirements.
     *
     * @param roundId The index of the planet mint round.
     * @param paymentType The payment type (0 = network native coins / 1 = mechanium)
     */
    function setRoundPaymentType(
        uint256 roundId,
        uint256 paymentType
    ) public onlyOwner {
        require(roundId > 0, "Id can't be 0");
        require(roundId <= roundsLength, "Invalid roundId");
        if (paymentType == 1) {
            require(
                address(mechaniumToken) != address(0),
                "Mechanium token not set"
            );
        }
        roundPaymentType[roundId] = paymentType;
        emit PlanetRoundPaymentTypeChanged(roundId, paymentType);
    }

    /**
     * @notice Set the mechanium token address for all mechanium payment
     *
     * @param token The address of the token contract.
     */
    function setMechaniumToken(address token) public onlyOwner {
        mechaniumToken = IERC20Upgradeable(token);
        emit MechaniumTokenChanged(token);
    }

    /**
     * @notice Withdraw mechanium
     *
     * @param to The address of the tokens/coins receiver.
     * @param amount Amount to claim.
     */
    function withdrawMechaniumToken(
        address to,
        uint256 amount
    ) public onlyOwner {
        withdrawTokens(to, address(mechaniumToken), amount);
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
     * - if the round payment type is 0, msg.value must contain the price
     * - if the round payment type is 1, 'safeTransfer' the price from the msg.sender account (must be approved before)
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
    ) internal override {
        MintRound storage round = rounds[roundId];
        require(round.planetId > 0, "Invalid round");
        require(
            block.timestamp >= round.startTime &&
                round.startTime > 0 &&
                (round.duration == 0 ||
                    block.timestamp < round.startTime + round.duration),
            "Round not in progress"
        );
        require(
            round.totalMintedPerType[landType] + amount <=
                round.supplyPerType[landType],
            "Round supply exceeded"
        );

        uint256 price = round.pricePerType[landType] * amount;
        if (roundPaymentType[roundId] == 1) {
            // Mechanium payment
            require(
                address(mechaniumToken) != address(0),
                "Mechanium token not set"
            );

            mechaniumToken.safeTransferFrom(msg.sender, address(this), price);
        } else {
            // Native coins payment
            require(price <= msg.value, "Wrong price");
        }

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
     * @dev Override {supportsInterface}
     */
    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721Upgradeable, ERC2981Upgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
