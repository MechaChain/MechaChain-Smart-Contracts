// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

interface INFT {
    function mint(
        uint256 roundId,
        uint256 factionId,
        uint256 amount
    ) external payable;
}

contract DummyMintConstructor {
    constructor(
        address contractAddress,
        uint256 roundId,
        uint256 factionId,
        uint256 amount
    ) {
        INFT nftContract = INFT(contractAddress);
        nftContract.mint(roundId, factionId, amount);
    }
}
