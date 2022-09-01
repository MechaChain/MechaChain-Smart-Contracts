// Load modules
const { time, expectRevert, snapshot } = require("@openzeppelin/test-helpers");
const cliProgress = require("cli-progress");

// Load artifacts
const MechaPilots2219V1 = artifacts.require("MechaPilots2219V1");
const DummyMintConstructor = artifacts.require("DummyMintConstructor");
const MechaPilots2219V2 = artifacts.require("MechaPilots2219V2");

// Load utils
const {
  getAmount,
  getBN,
  gasTracker,
  getSignature,
  getRandom,
} = require("../utils");
const web3Utils = require("web3-utils");
const { upgradeProxy, deployProxy } = require("@openzeppelin/truffle-upgrades");

contract("MechaPilots2219V1", async (accounts) => {
  const [owner, ...users] = accounts;

  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  let instance,
    testStartTime,
    chainid,
    maxMintsPerWallet,
    MAX_SUPPLY_BY_FACTION,
    MAX_SUPPLY,
    URI_UPDATER_ROLE;
  let contractBalance = getAmount(0);
  let mintedTokens = [];
  let usersTokens = {};
  let usersFDAData = {};

  const defaultPublicRound = {
    supplyInPercentage: 80, // Percentage of the total supply in %
    price: {
      max: getAmount(1),
      min: getAmount(0.2),
      decreaseAmount: getAmount(0.1),
      decreaseTime: time.duration.hours(1),
    },
    decreaseNumber: 5, // Number of decrease
  };

  const defaultWhitelistRound = {
    // Supply is the rest
    price: getAmount(0.2), // Fixed
  };

  // Table of mints to be performed randomly
  const mintsAmountsArray = [1, 2, 3, 4, 5, 10];

  // Number of transfers that will be made to the same user
  const transfersNumber = 500;

  const URIForRevealed = (id) => "ipfs://xxxxxxxxxx/revealed/" + id;

  const validator = "0x6F76846f7C90EcEC371e1d96cA93bfE9d36eEb83";
  const validator_private_key =
    "0xfeae30926cea7dfa8fb803c348aef7f06941b9af7770e6b62c0dcb543d3391a7";
  const tokenURIUpdater = "0x6F76846f7C90EcEC371e1d96cA93bfE9d36eEb83";
  const tokenURIUpdaterPrivateKey =
    "0xfeae30926cea7dfa8fb803c348aef7f06941b9af7770e6b62c0dcb543d3391a7";

  /**
   * ========================
   *        FUNCTIONS
   * ========================
   */

  /**
   * Return the array of transferred tokens from transaction data
   *
   * @param {*} txData
   * @param boolean updateArrays If we have to update `mintedTokens` and `usersTokens`
   * @returns
   */
  const getTokensFromTransferEvent = (txData, updateArrays = true) => {
    let tokens = [];
    txData.logs.map((log) => {
      if (log.event === "Transfer") {
        const { to, from, tokenId } = log.args;
        tokens.push(tokenId.toNumber());

        if (updateArrays) {
          // Update `mintedTokens`
          mintedTokens.push(tokenId);

          // Update usersTokens for `to`
          usersTokens[to] = usersTokens[to]
            ? [...usersTokens[to], tokenId]
            : [tokenId];

          if (from !== ZERO_ADDRESS) {
            // Update usersTokens for `from`
            usersTokens[from] = [
              ...usersTokens[from].filter(
                (id) => id.toString() !== tokenId.toString()
              ),
            ];

            if (!usersTokens[from].length) {
              delete usersTokens[from];
            }
          }
        }
      }
    });
    return tokens;
  };

  /**
   * Mint tokens according to round data (or `overrideData`)
   * Test data and add cost to `gasTracker`
   *
   * @returns array of minted tokens
   */
  const mint = async (
    { roundId, factionId, amount, maxMint },
    user,
    overrideData = {}
  ) => {
    const round = await instance.rounds(roundId);
    const unitPrice = await instance.roundPrice(roundId);
    const price = overrideData?.price || unitPrice.mul(getBN(amount));
    let tx;
    if (round.validator === ZERO_ADDRESS) {
      // mint without validator
      tx = await instance.mint(roundId, factionId, amount, {
        from: user,
        value: price,
      });
      await gasTracker.addCost(`Public mint x${amount}`, tx);
    } else {
      // mint with validator
      const latestTime = await time.latest();

      const payloadExpiration =
        overrideData?.payloadExpiration ||
        latestTime.add(time.duration.minutes(30));

      const signature = getSignature(
        overrideData?.validator_private_key || validator_private_key,
        [
          user,
          payloadExpiration,
          maxMint,
          overrideData?.signatureFactionId || factionId,
          roundId,
          instance.address,
          chainid,
        ]
      );
      tx = await instance.mintWithValidation(
        roundId,
        factionId,
        amount,
        maxMint,
        payloadExpiration,
        signature,
        {
          from: user,
          value: price,
        }
      );
      await gasTracker.addCost(`Whitelist mint x${amount}`, tx);
    }

    // Increase contractBalance
    contractBalance = contractBalance.add(price);

    // Tokens
    const mintedTokens = getTokensFromTransferEvent(tx);
    return mintedTokens;
  };

  /**
   * Reveal token with signature according to round data (or `overrideData`)
   * Test data and add cost to `gasTracker`
   */
  const reveal = async (tokenId, user, overrideData = {}) => {
    const uri = URIForRevealed(tokenId);
    const latestTime = await time.latest();
    const payloadExpiration = latestTime.add(time.duration.minutes(30));
    const signature = getSignature(
      overrideData.updater_private_key || tokenURIUpdaterPrivateKey,
      [user, payloadExpiration, tokenId, uri, instance.address, chainid]
    );

    const tx = await instance.revealToken(
      tokenId,
      overrideData.uri || uri,
      payloadExpiration,
      signature,
      {
        from: user,
      }
    );
    await gasTracker.addCost(`Reveal Token x1`, tx);

    const newUri = await instance.tokenURI(tokenId);
    assert.equal(newUri, uri, "Bad URI");

    const isRevealed = await instance.isRevealed(tokenId);
    assert.equal(isRevealed, true, "Not revealed");
  };

  /**
   * Get random token of an user
   */
  const getUserRandomToken = (user) =>
    usersTokens[user][getRandom(0, usersTokens[user].length - 1)];

  /**
   * ========================
   *          TESTS
   * ========================
   */

  /**
   * CONFIGURATION
   */
  describe("\n CONFIGURATION", () => {
    it(`MechaPilots2219V1 should be deployed`, async () => {
      testStartTime = await time.latest();

      //instance = await MechaPilots2219V1.deployed();
      instance = await deployProxy(MechaPilots2219V1, [], {
        initializer: "initialize",
      });
      assert(instance.address !== "");

      const version = await instance.version();
      assert.equal(version.toString(), "1", "Bad version");
      // chainid = await web3.eth.getChainId();
      chainid = 1;
      maxMintsPerWallet = await instance.maxMintsPerWallet();
      maxMintsPerWallet = maxMintsPerWallet.toNumber();
      MAX_SUPPLY = await instance.MAX_SUPPLY();
      MAX_SUPPLY_BY_FACTION = [
        await instance.MAX_SUPPLY_BY_FACTION(0),
        await instance.MAX_SUPPLY_BY_FACTION(1),
      ];
      URI_UPDATER_ROLE = await instance.URI_UPDATER_ROLE();

      console.log(`
        SCOPE
          - MAX_SUPPLY_BY_FACTION = [${MAX_SUPPLY_BY_FACTION.map((e) =>
            e.toNumber()
          ).join(", ")}]
          - USERS = ${accounts.length}`);
    });

    it(`Create the public FDA round`, async () => {
      defaultPublicRound.supply = MAX_SUPPLY_BY_FACTION.map((supply) =>
        Math.ceil(
          (supply.toNumber() * defaultPublicRound.supplyInPercentage) / 100
        )
      );
      const latestTime = await time.latest();

      await instance.setupMintRound(
        1,
        defaultPublicRound.supply,
        latestTime, // Start now
        0, // Infinite
        ZERO_ADDRESS,
        defaultPublicRound.price.max,
        defaultPublicRound.price.min,
        defaultPublicRound.price.decreaseTime,
        defaultPublicRound.price.decreaseAmount
      );

      console.log(`
        PUBLIC FDA ROUND
          - RoundId = 1
          - Supply = [${defaultPublicRound.supply.join(", ")}] (${
        defaultPublicRound.supplyInPercentage
      }% of the supply)
          - Max Price = ${web3Utils.fromWei(defaultPublicRound.price.max)} Eth
          - Min Price = ${web3Utils.fromWei(defaultPublicRound.price.min)} Eth
          - Decrease = ${web3Utils.fromWei(
            defaultPublicRound.price.decreaseAmount
          )} Eth`);
    });

    it(`Create the Whitelist round`, async () => {
      defaultWhitelistRound.supply = MAX_SUPPLY_BY_FACTION.map(
        (supply, idx) => supply.toNumber() - defaultPublicRound.supply[idx]
      );

      await instance.setupMintRound(
        2,
        defaultWhitelistRound.supply,
        1, // Start now
        0, // Infinite
        validator,
        defaultWhitelistRound.price,
        defaultWhitelistRound.price,
        0,
        0
      );

      console.log(`
        WHITELIST ROUND
          - RoundId = 2 
          - Supply = [${defaultWhitelistRound.supply.join(", ")}] (${
        100 - defaultPublicRound.supplyInPercentage
      }% of the supply)
          - Fixed Price = ${web3Utils.fromWei(
            defaultWhitelistRound.price
          )} Eth`);
    });

    it("Set maxMintsPerWallet to 99999", async () => {
      await instance.setMaxMintsPerWallet(99999, {
        from: owner,
      });
    });
  });

  /**
   * PUBLIC FDA MINT
   */
  describe("\n PUBLIC FDA MINT", () => {
    for (let i = 0; i < defaultPublicRound.decreaseNumber; i++) {
      const price = defaultPublicRound.price.max.sub(
        defaultPublicRound.price.decreaseAmount.mul(getBN(i))
      );

      // Mint all decreased batch by faction
      ["PURE_GENE", "ASSIMILEE"].forEach((factionName, factionId, arr) => {
        it(`Mint ${factionName} tokens for ${web3Utils.fromWei(
          price
        )} Eth`, async () => {
          // Calculate supply
          const mintPerDecrease = Math.ceil(
            defaultPublicRound.supply[factionId] /
              defaultPublicRound.decreaseNumber
          );
          const lastMintPerDecrease =
            defaultPublicRound.supply[factionId] -
            mintPerDecrease * (defaultPublicRound.decreaseNumber - 1);

          const supply =
            i === defaultPublicRound.decreaseNumber - 1
              ? lastMintPerDecrease
              : mintPerDecrease;

          let remainingTokens = supply;

          // Progress bar
          const progressBar = new cliProgress.SingleBar(
            {
              clearOnComplete: true,
              format:
                "\tMint in public (" +
                factionName +
                "): [{bar}] {percentage}% | {value}/{total} tokens | ETA: {eta}s | Duration: {duration_formatted}",
            },
            cliProgress.Presets.shades_classic
          );
          progressBar.start(supply, 0);

          // Mint all supply
          while (remainingTokens > 0) {
            const user = accounts[getRandom(1, accounts.length - 1)];
            let amount =
              mintsAmountsArray[getRandom(0, mintsAmountsArray.length - 1)];

            if (amount > remainingTokens) {
              amount = remainingTokens;
            }

            const payement = price.mul(getBN(amount));

            // Mint
            await mint({ roundId: 1, factionId, amount }, user, {
              price: payement,
            });

            // Add to FDA data
            if (!usersFDAData[user]) {
              usersFDAData[user] = {
                totalMinted: amount,
                totalPayement: payement,
              };
            } else {
              usersFDAData[user].totalMinted += amount;
              usersFDAData[user].totalPayement =
                usersFDAData[user].totalPayement.add(payement);
            }

            // Progress
            progressBar.increment(amount);
            remainingTokens -= amount;
          }

          progressBar.stop();
        });
      });

      // Decrease price
      if (i !== defaultPublicRound.decreaseNumber) {
        it(`Decrease Price of ${web3Utils.fromWei(
          defaultPublicRound.price.decreaseAmount
        )} Eth`, async () => {
          await time.increase(
            defaultPublicRound.price.decreaseTime.add(getBN(1))
          );
          const actualPrice = await instance.roundPrice(1);
          const expectedPrice = defaultPublicRound.price.max.sub(
            defaultPublicRound.price.decreaseAmount.mul(getBN(i + 1))
          );
          assert.equal(
            actualPrice.toString(),
            expectedPrice.toString(),
            "Incorrect price decrease"
          );
        });
      }
    }

    it(`All factions are now sold out for the round`, async () => {
      const round = await instance.rounds(1);

      assert.equal(
        round.supply[0],
        round.totalMinted[0],
        "Incorrect totalMinted"
      );

      assert.equal(
        round.supply[1],
        round.totalMinted[1],
        "Incorrect totalMinted"
      );
    });

    it(`Calculate reimbursement data for script testing`, async () => {
      const lastPrice = defaultPublicRound.price.max.sub(
        defaultPublicRound.price.decreaseAmount.mul(
          getBN(defaultPublicRound.decreaseNumber - 1)
        )
      );
      const totalSupply = await instance.totalSupply();
      const totalToRefound = contractBalance.sub(lastPrice.mul(totalSupply));

      let userToRefound = 0;

      // totalToRefound by user and count
      Object.keys(usersFDAData).forEach(function (key) {
        const toRefound = usersFDAData[key].totalPayement.sub(
          lastPrice.mul(getBN(usersFDAData[key].totalMinted))
        );
        usersFDAData[key].totalToRefound = toRefound;
        if (toRefound.toString() !== "0") {
          userToRefound++;
        }
      });

      console.log(`
        Sold out Price = ${web3Utils.fromWei(lastPrice)} Eth
        Total to refound = ${web3Utils.fromWei(totalToRefound)} Eth
        Total user to refound = ${userToRefound}
        Total user who minted = ${Object.keys(usersFDAData).length}
      `);
    });
  });

  /**
   * WHITELIST MINT
   */
  describe("\n WHITELIST MINT", () => {
    // Mint all decreased batch by faction
    ["PURE_GENE", "ASSIMILEE"].forEach((factionName, factionId, arr) => {
      it(`Mint ${factionName} tokens for ${web3Utils.fromWei(
        defaultWhitelistRound.price
      )} Eth`, async () => {
        const supply = defaultWhitelistRound.supply[factionId];
        let remainingTokens = supply;

        // Progress bar
        const progressBar = new cliProgress.SingleBar(
          {
            clearOnComplete: true,
            format:
              "\tMint in whitelist (" +
              factionName +
              "): [{bar}] {percentage}% | {value}/{total} tokens | ETA: {eta}s | Duration: {duration_formatted}",
          },
          cliProgress.Presets.shades_classic
        );
        progressBar.start(supply, 0);

        // Mint all supply
        while (remainingTokens > 0) {
          const user = accounts[getRandom(1, accounts.length - 1)];
          let amount =
            mintsAmountsArray[getRandom(0, mintsAmountsArray.length - 1)];

          if (amount > remainingTokens) {
            amount = remainingTokens;
          }

          // Mint
          await mint({ roundId: 2, factionId, amount, maxMint: 99999 }, user);

          // Progress
          progressBar.increment(amount);
          remainingTokens -= amount;
        }

        progressBar.stop();
      });
    });

    it(`All factions are now sold out for the round`, async () => {
      const round = await instance.rounds(2);

      assert.equal(
        round.supply[0],
        round.totalMinted[0],
        "Incorrect totalMinted"
      );

      assert.equal(
        round.supply[1],
        round.totalMinted[1],
        "Incorrect totalMinted"
      );
    });

    it(`All factions and contract are totally sold out`, async () => {
      const totalSupplyByFaction = [
        await instance.totalSupplyByFaction(0),
        await instance.totalSupplyByFaction(1),
      ];

      const totalSupply = await instance.totalSupply();

      assert.equal(
        totalSupplyByFaction[0].toNumber(),
        MAX_SUPPLY_BY_FACTION[0].toNumber(),
        "Incorrect totalSupplyByFaction 0"
      );

      assert.equal(
        totalSupplyByFaction[1].toNumber(),
        MAX_SUPPLY_BY_FACTION[1].toNumber(),
        "Incorrect totalSupplyByFaction 1"
      );

      assert.equal(
        totalSupply.toNumber(),
        MAX_SUPPLY.toNumber(),
        "Incorrect totalSupply"
      );
    });
  });

  /**
   * TOKEN REVEAL
   */
  describe("\n TOKEN REVEAL", () => {
    it("Admin set URI_UPDATER_ROLE", async () => {
      await instance.grantRole(URI_UPDATER_ROLE, tokenURIUpdater);
      const hasRole = await instance.hasRole(URI_UPDATER_ROLE, tokenURIUpdater);
      assert(hasRole);
    });

    it(`All users reveal their tokens 1 by 1`, async () => {
      const totalSupply = await instance.totalSupply();
      const progressBar = new cliProgress.SingleBar(
        {
          clearOnComplete: true,
          format:
            "\tReveals: [{bar}] {percentage}% | {value}/{total} reveals | ETA: {eta}s | Duration: {duration_formatted}",
        },
        cliProgress.Presets.shades_classic
      );
      progressBar.start(totalSupply.toNumber(), 0);

      for (const user in usersTokens) {
        for (const tokenId of usersTokens[user]) {
          await reveal(tokenId, user);

          // Progress
          progressBar.increment();
        }
      }
      progressBar.stop();
    });
  });

  /**
   * TRANSFERS
   */
  describe("\n TRANSFERS", () => {
    it(`${transfersNumber} tokens are transfered to the first address by random users`, async () => {
      const to = accounts[0];
      const progressBar = new cliProgress.SingleBar(
        {
          clearOnComplete: true,
          format:
            "\tTransfers: [{bar}] {percentage}% | {value}/{total} transfers | ETA: {eta}s | Duration: {duration_formatted}",
        },
        cliProgress.Presets.shades_classic
      );
      progressBar.start(transfersNumber, 0);
      for (let i = 0; i < transfersNumber; i++) {
        const usersWithoutFirst = Object.keys(usersTokens).filter(
          (address) => address !== to && address && usersTokens[address].length
        );
        const user =
          usersWithoutFirst[getRandom(0, usersWithoutFirst.length - 1)];

        const tokenId =
          usersTokens[user].length > 1
            ? usersTokens[user][getRandom(0, usersTokens[user].length - 1)]
            : usersTokens[user][0];

        const txData = await instance.transferFrom(user, to, tokenId, {
          from: user,
        });
        getTokensFromTransferEvent(txData);
        await gasTracker.addCost(`Transfer x1`, txData);

        // Progress
        progressBar.increment();
      }
      progressBar.stop();
    });
  });

  /**
   * TOKENS NUMBER AND ORDER
   */
  describe("\n TOKENS NUMBER AND ORDER", () => {
    it("Tokens are minted randomly (less than 10% of coherency)", async () => {
      let coherencesNb = 0;
      for (let i = 0; i++; i < mintedTokens.length) {
        if (mintedTokens[i] === i || mintedTokens[i] === i + 1) {
          coherencesNb++;
        }
      }
      assert.equal(
        coherencesNb < mintedTokens.length * 0.1,
        true,
        `More than 10% of coherency (${coherencesNb} for ${mintedTokens.length})`
      );
    });

    it("First token is 1", async () => {
      const min = Math.min(...mintedTokens);
      assert.equal(min, 1, `Minimum is ${min} not 1`);
    });

    it(`Last token is MAX_SUPPLY`, async () => {
      const max = Math.max(...mintedTokens);
      assert.equal(
        max,
        MAX_SUPPLY.toNumber(),
        `Maximum is ${max} not ${MAX_SUPPLY.toNumber()}`
      );
    });
  });

  /**
   * WITHDRAW ETH
   */
  describe("\n WITHDRAW ETH", () => {
    it(`Contract has the correct eth amount according to the mints`, async () => {
      const balance = await web3.eth.getBalance(instance.address);
      assert.equal(
        balance.toString(),
        contractBalance.toString(),
        "Incorrect ETH balance"
      );
    });
  });

  /**
   * GAS STATS
   */
  describe("\n GAS STATS", () => {
    it(`Get stats on gas`, async () => {
      gasTracker.consoleStats();
    });
  });
});
