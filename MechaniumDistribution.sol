// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./IMechaniumDistribution.sol";

/**
 * @title MechaniumDistribution - Pre-sale distribution smart contract
 */
contract MechaniumDistribution is AccessControl, IMechaniumDistribution {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    /**
     * ========================
     *          Events
     * ========================
     */

    event AllocationAddition(address indexed to, uint256 amount);
    event DistributedTokens(
        address indexed be,
        address indexed to,
        uint256 amount
    );
    event DistributedTokensToAll(
        address indexed be,
        uint256 beneficiariesNb,
        uint256 tokensUnlockNb
    );
    event VestingStartingTimeChanged(uint256 vestingStartingTime);
    event TransferToPTEPool(uint256 amount);
    event TransferToStakingPool(address indexed account, uint256 amount);

    /**
     * ========================
     *  Constants & Immutables
     * ========================
     */

    /// Role who can call allocate function
    bytes32 public constant ALLOCATOR_ROLE = keccak256("ALLOCATOR_ROLE");

    /// ERC20 basic token contract being held
    IERC20 private immutable _token;

    /// Max vesting starting time
    uint256 private immutable _maxVestingStartingTime;

    /// Percentage of unlocked tokens per month once the vesting schedule has started
    uint256 private immutable _vestingPerMonth;

    /**
     * ========================
     *         Storage
     * ========================
     */

    /// List of all the addresses that have allocations
    address[] public beneficiaryList;
    /// Mapping of address/amount of allocated toknes
    mapping(address => uint256) public allocatedTokens;
    /// Total allocated tokens for all the addresses
    uint256 public totalAllocatedTokens = 0;

    /// Mapping of address/amount of transfered tokens
    mapping(address => uint256) private _releasedTokens;
    /// Total transfered tokens for all the addresses
    uint256 public totalReleasedTokens = 0;

    /// Starting time of the vesting schedule
    uint256 public vestingStartingTime;

    /// Play to earn pool address
    address public _ptePoolAddress;

    /// Staking pool address
    address public _stakingPoolAddress;

    /**
     * ========================
     *         Modifiers
     * ========================
     */

    /**
     * @dev Check if the contract has the amount of tokens to allocate
     * @param amount The amount of tokens to allocate
     */
    modifier tokensAvailable(uint256 amount) {
        require(
            totalAllocatedTokens.add(amount) <= totalSupply(),
            "The contract does not have enough available token to allocate"
        );
        _;
    }

    /**
     * @dev Check if the vesting has started
     */
    modifier vestingStarted() {
        require(
            hasVestingStarted(),
            "The vesting schedule has not started yet"
        );
        _;
    }

    /**
     * @dev Check if the vesting has not started
     */
    modifier vestingNotStarted() {
        require(
            !hasVestingStarted(),
            "The vesting schedule has already started"
        );
        _;
    }

    /**
     * ========================
     *     Public Functions
     * ========================
     */

    /**
     * @dev Contract constructor sets immutable IERC20 token address, this address cannot be changed later
     * @param token_ address of the ERC20 token contract
     */
    constructor(IERC20 token_) {
        _token = token_;
        _vestingPerMonth = 20;

        vestingStartingTime = block.timestamp + 180 days;
        _maxVestingStartingTime = block.timestamp + 180 days;

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ALLOCATOR_ROLE, msg.sender);
    }

    /**
     * @notice Allocate 'amount' token 'to' address
     * @param to Address of the beneficiary
     * @param amount Total token to be allocated
     */
    function allocateTokens(address to, uint256 amount)
        public
        override
        onlyRole(ALLOCATOR_ROLE)
        tokensAvailable(amount)
        vestingNotStarted
        returns (bool)
    {
        require(amount > 0, "Amount must be superior to 0");
        require(to != address(0), "Address must not be address(0)");

        if (allocatedTokens[to] == 0) {
            /// first allocation
            beneficiaryList.push(to);
        }

        allocatedTokens[to] = allocatedTokens[to].add(amount);
        totalAllocatedTokens = totalAllocatedTokens.add(amount);

        emit AllocationAddition(to, amount);
        return true;
    }

    /**
     * @notice Start the vesting immediately
     */
    function startVesting()
        public
        override
        vestingNotStarted
        onlyRole(DEFAULT_ADMIN_ROLE)
        returns (bool)
    {
        vestingStartingTime = block.timestamp;

        emit VestingStartingTimeChanged(vestingStartingTime);
        return true;
    }

    /**
     * @notice Set the vesting start time
     * @param startTime vesting start time
     */
    function startVesting(uint256 startTime)
        public
        override
        vestingNotStarted
        onlyRole(DEFAULT_ADMIN_ROLE)
        returns (bool)
    {
        require(
            startTime <= _maxVestingStartingTime,
            "Vesting start time must not be more than 6 months"
        );
        vestingStartingTime = startTime;

        emit VestingStartingTimeChanged(vestingStartingTime);
        return true;
    }

    /**
     * @notice Set the play to earn pool address
     * @param ptePoolAddress PTE pool address
     */
    function setPTEPool(address ptePoolAddress)
        public
        override
        onlyRole(DEFAULT_ADMIN_ROLE)
        returns (bool)
    {
        _ptePoolAddress = ptePoolAddress;
        return true;
    }

    /**
     * @notice Transfer unclaimed tokens to PTE pool
     */
    function transfertToPTEPool()
        public
        override
        onlyRole(DEFAULT_ADMIN_ROLE)
        vestingStarted
        returns (bool)
    {
        require(
            _ptePoolAddress != address(0),
            "Play to earn pool address is not set"
        );
        uint256 amount = totalUnallocatedTokens();
        require(amount > 0);

        _token.safeTransfer(_ptePoolAddress, amount);

        emit TransferToPTEPool(amount);

        return true;
    }

    /**
     * @notice Set staking pool address
     * @param stakingPoolAddress The staking pool address
     */
    function setStakingPool(address stakingPoolAddress)
        public
        override
        onlyRole(DEFAULT_ADMIN_ROLE)
        returns (bool)
    {
        _stakingPoolAddress = stakingPoolAddress;
        return true;
    }

    /**
     * @notice Transfer account's token to the staking pool
     * @param account the account to transfer tokens from
     */
    function transfertToStakingPool(address account)
        public
        override
        onlyRole(DEFAULT_ADMIN_ROLE)
        returns (bool)
    {
        require(
            _stakingPoolAddress != address(0),
            "Staking pool address is not set"
        );
        /// TODO: Transfer account's tokens to staking pool
        uint256 amount = 0; /// Get the amount to transfer from account
        require(amount > 0);
        emit TransferToStakingPool(account, amount);
        return true;
    }

    /**
     * @notice Claim the account's token
     * @param account the account to claim tokens
     */
    function claimTokens(address account)
        public
        override
        vestingStarted
        returns (bool)
    {
        uint256 pendingTokens = unlockableTokens(account);
        require(pendingTokens > 0, "No token can be unlocked for this account");

        _releaseTokens(account, pendingTokens);

        emit DistributedTokens(msg.sender, account, pendingTokens);
        return true;
    }

    /**
     * @notice Claim all the accounts tokens
     */
    function claimTokensForAll() public override vestingStarted returns (bool) {
        uint256 beneficiariesNb = 0;
        uint256 tokensUnlockNb = 0;
        for (uint256 i = 0; i < beneficiaryList.length; i++) {
            address beneficiary = beneficiaryList[i];
            uint256 pendingTokens = unlockableTokens(beneficiary);
            if (pendingTokens > 0) {
                _releaseTokens(beneficiary, pendingTokens);
                beneficiariesNb = beneficiariesNb.add(1);
                tokensUnlockNb = tokensUnlockNb.add(pendingTokens);
            }
        }
        emit DistributedTokensToAll(
            msg.sender,
            beneficiariesNb,
            tokensUnlockNb
        );
        return true;
    }

    /**
     * ========================
     *    Private functions
     * ========================
     */

    /**
     * @notice Send 'amount' token 'to' address
     * @dev 'amount' must imperatively be less or equal to the number of allocated tokens, throw an assert (loss of transaction fees)
     * @param to Address of the beneficiary
     * @param amount Total token to send
     */
    function _releaseTokens(address to, uint256 amount) private {
        assert(releasedTokensOf(to).add(amount) <= allocatedTokens[to]);

        _token.safeTransfer(to, amount);

        // if transfer succeeded
        _releasedTokens[to] = releasedTokensOf(to).add(amount);
        totalReleasedTokens = totalReleasedTokens.add(amount);
    }

    /**
     * ========================
     *          Views
     * ========================
     */

    /**
     * @return the amount of tokens locked for `account`
     */
    function balanceOf(address account) public view override returns (uint256) {
        return allocatedTokens[account].sub(releasedTokensOf(account));
    }

    /**
     * @return the amount of tokens that the `account` can unlock in real time
     */
    function pendingTokensOf(address account)
        public
        view
        override
        returns (uint256)
    {
        if (!hasVestingStarted()) {
            return 0;
        }
        uint256 decimals = 12;
        uint256 percentage = diffInHours(vestingStartingTime, block.timestamp); // number of hours since vesting has started
        percentage = percentage.mul(_vestingPerMonth * 10**(decimals - 2)); // x _vestingPerMonth/100
        percentage = percentage.div(30 * 24); // /hours in month
        percentage = percentage.add(_vestingPerMonth * 10**(decimals - 2)); // + vesting of the first month
        if (percentage > 10**decimals) {
            // percentage has to be <= to 100%
            percentage = 10**decimals;
        }
        return
            allocatedTokens[account].mul(percentage).div(10**decimals).sub(
                releasedTokensOf(account)
            );
    }

    /**
     * @return the amount of tokens that the `account` can unlock per month
     */
    function unlockableTokens(address account)
        public
        view
        override
        returns (uint256)
    {
        if (!hasVestingStarted()) {
            return 0;
        }
        uint256 percentage = diffInMonths(vestingStartingTime, block.timestamp)
            .add(1); // number of months since vesting has started
        percentage = percentage.mul(_vestingPerMonth); // x _vestingPerMonth/100
        if (percentage > 100) {
            // percentage has to be <= to 100%
            percentage = 100;
        }
        return
            allocatedTokens[account].mul(percentage).div(100).sub(
                releasedTokensOf(account)
            );
    }

    function releasedTokensOf(address account) public view override returns (uint256) {
        return _releasedTokens[account];
    }

    /**
     * @return the total token hold by the contract
     */
    function tokenBalance() public view returns (uint256) {
        return _token.balanceOf(address(this));
    }

    /**
     * @return the total supply of tokens
     */
    function totalSupply() public view override returns (uint256) {
        return tokenBalance().add(totalReleasedTokens);
    }

    /**
     * @return the total token unallocated by the contract
     */
    function totalUnallocatedTokens() public view override returns (uint256) {
        return totalSupply().sub(totalAllocatedTokens);
    }

    /**
     * @return true if the vesting schedule has started
     */
    function hasVestingStarted() public view override returns (bool) {
        return block.timestamp >= vestingStartingTime;
    }

    /**
     * ========================
     *          Pures
     * ========================
     */

    /**
     * @return the number of hours between the two timestamps
     */
    function diffInHours(uint256 startDate, uint256 endDate)
        internal
        pure
        returns (uint256)
    {
        return endDate.sub(startDate).div(60).div(60);
    }

    /**
     * @return the number of months between the two timestamps
     */
    function diffInMonths(uint256 startDate, uint256 endDate)
        internal
        pure
        returns (uint256)
    {
        return diffInHours(startDate, endDate).div(24).div(30);
    }
}
