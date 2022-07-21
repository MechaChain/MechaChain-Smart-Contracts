// Load modules
const { time, expectRevert, snapshot } = require("@openzeppelin/test-helpers");
const cliProgress = require("cli-progress");

// Load artifacts
const MechaPilots2219V1 = artifacts.require("MechaPilots2219V1");

// Load utils
const {
  getAmount,
  getBN,
  getBNRange,
  gasTracker,
  getSignature,
} = require("../utils");
const { upgradeProxy, deployProxy } = require("@openzeppelin/truffle-upgrades");

contract("MechaPilots2219V1", async (accounts) => {
  const [owner, user1, user2, ...users] = accounts;

  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  let instance,
    testStartTime,
    chainid,
    maxMintsPerWallet,
    MAX_SUPPLY_BY_FACTION,
    MAX_SUPPLY,
    lastMintedTokens;
  let contractBalance = getAmount(0);
  let mintedTokens = [];
  let usersTokens = {};

  const rounds = [
    {}, // 0 not possible
    {
      // Public sale (with FDA)
      roundId: 1,
      supply: [40, 40],
      startTime: time.duration.days(1), // to add to `testStartTime`
      duration: time.duration.days(2),
      // no validator
      price: {
        // Fixed to 2 Eth
        max: getAmount(2),
        min: getAmount(0.2),
        decreaseAmount: getAmount(0.1),
        decreaseTime: time.duration.hours(1),
      },
    },
    {
      // Whitelist tier 1
      roundId: 2,
      supply: [40, 40],
      startTime: time.duration.days(4), // to add to `testStartTime`
      duration: time.duration.hours(10),
      validator: "0x6F76846f7C90EcEC371e1d96cA93bfE9d36eEb83",
      validator_private_key:
        "0xfeae30926cea7dfa8fb803c348aef7f06941b9af7770e6b62c0dcb543d3391a7",
      price: {
        // Fixed to 0.2
        max: getAmount(0.002),
        min: getAmount(0.002),
        decreaseAmount: getAmount(0),
        decreaseTime: time.duration.hours(0),
      },
    },
    {
      // Whitelist tier 2
      roundId: 3,
      supply: [40, 40],
      startTime: time.duration.days(4), // to add to `testStartTime`
      duration: time.duration.hours(10),
      validator: "0x6F76846f7C90EcEC371e1d96cA93bfE9d36eEb83",
      validator_private_key:
        "0xfeae30926cea7dfa8fb803c348aef7f06941b9af7770e6b62c0dcb543d3391a7",
      price: {
        // Fixed to 0.002
        max: getAmount(0.002),
        min: getAmount(0.002),
        decreaseAmount: getAmount(0),
        decreaseTime: time.duration.hours(0),
      },
    },
    {
      // Free for sold out tests
      roundId: 4,
      supply: [0, 0],
      startTime: time.duration.hours(0), // to add to `testStartTime`
      duration: time.duration.hours(0), // infinite
      validator: "0x6F76846f7C90EcEC371e1d96cA93bfE9d36eEb83",
      validator_private_key:
        "0xfeae30926cea7dfa8fb803c348aef7f06941b9af7770e6b62c0dcb543d3391a7",
      price: {
        max: getAmount(0),
        min: getAmount(0),
        decreaseAmount: getAmount(0),
        decreaseTime: time.duration.hours(0),
      },
    },
  ];

  const baseURI = "ipfs://xxxxxxxxxx/";
  const notRevealedUri = "ipfs://yyyyyyyyyy/";
  const baseExtension = ".json";

  const otherPrivateKey =
    "0x253d7333eba154ef8fc973ee4ae2e5f35d4cc8da5db8a9e6aaa51417902c2501";

  /**
   * ========================
   *        FUNCTIONS
   * ========================
   */

  /**
   * Setup a round
   * Test data and add cost to `gasTracker`
   */
  const setupMintRound = async (
    { roundId, supply, startTime, duration, validator, price },
    from = owner
  ) => {
    validator = validator || ZERO_ADDRESS;

    const tx = await instance.setupMintRound(
      roundId,
      supply,
      testStartTime.add(startTime),
      duration,
      validator,
      price.max,
      price.min,
      price.decreaseTime,
      price.decreaseAmount,
      { from: from }
    );
    await gasTracker.addCost("Setup Mint Round", tx);
    const round = await instance.rounds(roundId);
    assert.equal(round.supply.toString(), supply.toString(), "Bad supply");
    assert.equal(
      round.startTime.toString(),
      testStartTime.add(startTime).toString(),
      "Bad startTime"
    );
    assert.equal(
      round.duration.toString(),
      duration.toString(),
      "Bad duration"
    );
    assert.equal(
      round.validator.toString(),
      validator.toString(),
      "Bad validator"
    );
    assert.equal(
      round.price.max.toString(),
      price.max.toString(),
      "Bad max price"
    );
    assert.equal(
      round.price.min.toString(),
      price.min.toString(),
      "Bad min price"
    );
    assert.equal(
      round.price.decreaseTime.toString(),
      price.decreaseTime.toString(),
      "Bad decreaseTime price"
    );
    assert.equal(
      round.price.decreaseAmount.toString(),
      price.decreaseAmount.toString(),
      "Bad decreaseAmount price"
    );
  };

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
            usersTokens[from] = usersTokens[from].filter(
              (id) => id.toString() !== tokenId.toString()
            );
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
    const oldBalance = await instance.balanceOf(user);
    let oldRoundTotalMinted,
      oldUserRoundTotalMinted,
      oldTotalSupply,
      oldTotalSupplyByFaction;
    if (factionId < round.totalMinted.length) {
      oldRoundTotalMinted = round.totalMinted[factionId];

      oldUserRoundTotalMinted = await instance.totalMintedBy(user, roundId);
      oldTotalSupply = await instance.totalSupply();
      oldTotalSupplyByFaction = await instance.totalSupplyByFaction(factionId);
    }
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
        overrideData?.validator_private_key ||
          rounds[roundId].validator_private_key,
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

    const newRound = await instance.rounds(roundId);

    // Increase contractBalance
    contractBalance = contractBalance.add(price);

    // Balances tests
    const newBalance = await instance.balanceOf(user);

    const newRoundTotalMinted = newRound.totalMinted[factionId];
    const newUserRoundTotalMinted = await instance.totalMintedBy(user, roundId);
    const newTotalSupply = await instance.totalSupply();
    const newTotalSupplyByFaction = await instance.totalSupplyByFaction(
      factionId
    );

    assert.equal(
      newBalance.toString(),
      oldBalance.add(getBN(amount)).toString(),
      "User balance not valid"
    );

    assert.equal(
      newRoundTotalMinted,
      getBN(oldRoundTotalMinted).add(getBN(amount)).toString(),
      "Round total minted not valid"
    );

    assert.equal(
      newUserRoundTotalMinted.toString(),
      oldUserRoundTotalMinted.add(getBN(amount)).toString(),
      "User round total minted not valid"
    );

    assert.equal(
      newTotalSupply.toString(),
      oldTotalSupply.add(getBN(amount)).toString(),
      "Total supply not valid"
    );

    assert.equal(
      newTotalSupplyByFaction.toString(),
      oldTotalSupplyByFaction.add(getBN(amount)).toString(),
      "Faction total supply not valid"
    );

    // Token test
    const mintedTokens = getTokensFromTransferEvent(tx);
    for (tokenId of mintedTokens) {
      const tokenFaction = await instance.tokenFaction(tokenId);
      assert.equal(
        tokenFaction.toString(),
        factionId,
        "tokenFaction not valid"
      );

      const tokenOwner = await instance.ownerOf(tokenId);
      assert.equal(
        tokenOwner.toString(),
        user.toString(),
        "User is not owner of the new token"
      );
    }
    return mintedTokens;
  };

  /**
   * Airdrop tokens for an user
   * Test data and add cost to `gasTracker`
   */
  const airdrop = async ({ factionId, amount }, user, { from } = {}) => {
    let oldBalance, oldTotalSupply, oldFactionSupply;
    if (factionId <= 1) {
      oldBalance = await instance.balanceOf(user);
      oldTotalSupply = await instance.totalSupply();
      oldFactionSupply = await instance.totalSupplyByFaction(factionId);
    }
    const tx = await instance.airdrop(user, factionId, amount, {
      from: from || owner,
    });
    await gasTracker.addCost(`Airdrop x${amount}`, tx);

    // Balances tests
    const newBalance = await instance.balanceOf(user);
    const newTotalSupply = await instance.totalSupply();
    const newFactionSupply = await instance.totalSupplyByFaction(factionId);

    assert.equal(
      newBalance.toString(),
      oldBalance.add(getBN(amount)).toString(),
      "User balance not valid"
    );

    assert.equal(
      newTotalSupply.toString(),
      oldTotalSupply.add(getBN(amount)).toString(),
      "Total supply not valid"
    );

    assert.equal(
      newFactionSupply.toString(),
      oldFactionSupply.add(getBN(amount)).toString(),
      "Faction total supply not valid"
    );

    // Token test
    const mintedTokens = getTokensFromTransferEvent(tx);
    for (tokenId of mintedTokens) {
      const tokenFaction = await instance.tokenFaction(tokenId);
      assert.equal(
        tokenFaction.toString(),
        factionId,
        "tokenFaction not valid"
      );

      const tokenOwner = await instance.ownerOf(tokenId);
      assert.equal(
        tokenOwner.toString(),
        user.toString(),
        "User is not owner of the new token"
      );
    }
  };

  /**
   * ========================
   *          TESTS
   * ========================
   */

  describe("\n DEPLOYEMENT", () => {
    it(`MechaPilots2219V1 should be deployed`, async () => {
      testStartTime = await time.latest();

      //instance = await MechaPilots2219V1.deployed();
      instance = await deployProxy(MechaPilots2219V1, [], {
        initializer: "initialize",
      });
      assert(instance.address !== "");

      const version = await instance.version();
      assert.equal(version.toString(), "1", "Bad version");
      chainid = 1;

      maxMintsPerWallet = await instance.maxMintsPerWallet();
      maxMintsPerWallet = maxMintsPerWallet.toNumber();
      MAX_SUPPLY = await instance.MAX_SUPPLY();
      MAX_SUPPLY_BY_FACTION = [
        await instance.MAX_SUPPLY_BY_FACTION(0),
        await instance.MAX_SUPPLY_BY_FACTION(1),
      ];
    });
  });

  /**
   * ROUND CREATION
   */
  describe("\n ROUND CREATION", () => {
    it(`Owner can't create a mint round (Reason: Id can't be 0)`, async () => {
      await expectRevert(
        setupMintRound({
          ...rounds[1],
          roundId: 0,
        }),
        `Id can't be 0`
      );
    });

    it(`Owner can't create the first round at id >= 2 (Reason: Invalid roundId)`, async () => {
      for (let i = 2; i <= 5; i++) {
        await expectRevert(
          setupMintRound({
            ...rounds[1],
            roundId: i,
          }),
          `Invalid roundId`
        );
      }
    });

    it(`User can't create a mint round (Reason: caller is not the owner)`, async () => {
      await expectRevert(
        setupMintRound(rounds[1], user1),
        `Ownable: caller is not the owner`
      );
    });

    it(`Owner can create round 1 (public FDA)`, async () => {
      await setupMintRound(rounds[1]);
    });

    it("User1 can't create or change a round configuration (Reason: Not owner)", async () => {
      await expectRevert(
        setupMintRound(rounds[1], user1),
        `Ownable: caller is not the owner`
      );
      await expectRevert(
        setupMintRound(rounds[2], user1),
        `Ownable: caller is not the owner`
      );
    });

    it(`Owner can create round 2 (Whitelist tiers 1)`, async () => {
      await setupMintRound(rounds[2]);
    });

    it(`Owner can create round 3 at the same time as the round 2 (Whitelist tiers 2)`, async () => {
      await setupMintRound(rounds[3]);
    });

    it(`Owner can't create or edit a round with a supply for 3 factions (Reason: too many arguments)`, async () => {
      await expectRevert(
        setupMintRound({
          ...rounds[2],
          supply: [100, 100, 100],
        }),
        `too many arguments`
      );
      await expectRevert(
        setupMintRound({
          ...rounds[3],
          roundId: 4,
          supply: [100, 100, 100],
        }),
        `too many arguments`
      );
    });

    it(`Owner can't create or edit a round with a supply for 1 faction (Reason: missing argument)`, async () => {
      await expectRevert(
        setupMintRound({
          ...rounds[2],
          supply: [100],
        }),
        `missing argument`
      );
      await expectRevert(
        setupMintRound({
          ...rounds[3],
          roundId: 4,
          supply: [100],
        }),
        `missing argument`
      );
    });
  });

  /**
   * BEFORE ROUNDS
   */
  describe("\n BEFORE ROUNDS", () => {
    it(`User can't mint in round 1 if not started (Reason: Round not in progress)`, async () => {
      await expectRevert(
        mint({ roundId: 1, factionId: 1, amount: 1, maxMint: 5 }, users[0]),
        `Round not in progress`
      );
    });

    it(`User can't mint in a non existing round (Reason: Round not in progress)`, async () => {
      await expectRevert(
        mint({ roundId: 10, factionId: 1, amount: 1, maxMint: 5 }, users[0]),
        `Round not in progress`
      );
    });

    it(`User can't mint in round 0 (Reason: Round not in progress)`, async () => {
      await expectRevert(
        mint({ roundId: 0, factionId: 1, amount: 1, maxMint: 5 }, users[0]),
        `Round not in progress`
      );
    });
  });

  /**
   * ROUND 1 - FDA PUBLIC MINT
   */
  describe("\n ROUND 1 - FDA PUBLIC MINT", () => {
    it(`Round 1 started`, async () => {
      await time.increaseTo(testStartTime.add(rounds[1].startTime));
      const latestTime = await time.latest();
      const round = await instance.rounds(1);
      assert.equal(
        round.startTime >= latestTime.toNumber(),
        true,
        "Start time not correct"
      );
    });

    it(`User can't mint with validator (Reason: No round validator)`, async () => {
      const user = user1;
      const factionId = 1;
      const maxMint = 10;
      const roundId = 1;
      const amount = 2;
      const price = getAmount(0.001);
      const latestTime = await time.latest();
      const payloadExpiration = latestTime.add(time.duration.minutes(30));
      const signature = getSignature(rounds[2].validator_private_key, [
        user,
        payloadExpiration,
        factionId,
        roundId,
        maxMint,
        instance.address,
        chainid,
      ]);

      await expectRevert(
        instance.mintWithValidation(
          roundId,
          factionId,
          amount,
          maxMint,
          payloadExpiration,
          signature,
          {
            from: user,
            value: price.mul(getBN(amount)),
          }
        ),
        `No round validator`
      );
    });

    it(`User can't mint more tokens than the maximum (Reason: Max allowed)`, async () => {
      await expectRevert(
        mint(
          {
            roundId: 1,
            factionId: 1,
            amount: 3,
          },
          user1
        ),
        `Max allowed`
      );
    });

    it(`User can't mint with the minimum price for now (Reason: Wrong price)`, async () => {
      await expectRevert(
        mint({ roundId: 1, amount: 1, factionId: 1 }, user1, {
          price: rounds[1].price.min,
        }),
        `Wrong price`
      );
    });

    it(`User can't mint 0 tokens (Reason: Zero amount)`, async () => {
      await expectRevert(
        mint({ roundId: 1, amount: 0, factionId: 1 }, user1),
        `Zero amount`
      );
    });

    it(`User can't mint a non-existing faction, like faction 2 or 3  (Reason: Panic: Index out of bounds)`, async () => {
      await expectRevert(
        mint({ roundId: 1, amount: 1, factionId: 2 }, user1),
        `Panic: Index out of bounds`
      );
      await expectRevert(
        mint({ roundId: 1, amount: 1, factionId: 3 }, user1),
        `Panic: Index out of bounds`
      );
    });

    it(`User1 can mint his maximum of tokens in two transaction (faction ASSIMILEE)`, async () => {
      const lastMintAmount = maxMintsPerWallet - 1;

      // first mint
      lastMintedTokens = await mint(
        { roundId: 1, factionId: 1, amount: 1 },
        user1
      );

      // last mint
      if (lastMintAmount > 0) {
        lastMintedTokens = [
          ...lastMintedTokens,
          ...(await mint(
            {
              roundId: 1,
              factionId: 1,
              amount: lastMintAmount,
            },
            user1
          )),
        ];
      }
    });

    it(`Last minted tokens (User1) are all ASSIMILEE`, async () => {
      for (tokenId of lastMintedTokens) {
        const tokenFaction = await instance.tokenFaction(tokenId);
        assert.equal(tokenFaction.toString(), "1", "tokenFaction not valid");
      }
    });

    it(`User2 can mint his maximum of tokens in one transaction (faction PURE_GENE)`, async () => {
      // first mint
      lastMintedTokens = await mint(
        { roundId: 1, factionId: 0, amount: maxMintsPerWallet },
        user2
      );
    });

    it(`Last minted tokens (User2) are all PURE_GENE`, async () => {
      for (tokenId of lastMintedTokens) {
        const tokenFaction = await instance.tokenFaction(tokenId);
        assert.equal(tokenFaction.toString(), "0", "tokenFaction not valid");
      }
    });

    it("Price should have decreased of 2 decreaseAmount after 2 hours", async () => {
      const round = rounds[1];
      await time.increase(round.price.decreaseTime.mul(getBN(2)));
      const latestTime = await time.latest();

      const actualPrice = await instance.roundPrice(1);
      const timePassed = latestTime.sub(testStartTime.add(round.startTime));
      const decreaseNb = timePassed.div(round.price.decreaseTime);
      const expectedPrice = round.price.max.sub(
        decreaseNb.mul(round.price.decreaseAmount)
      );
      assert.equal(
        actualPrice.toString(),
        expectedPrice.toString(),
        "Incorrect price decrease"
      );
    });

    it(`User can mint with the new price`, async () => {
      const actualPrice = await instance.roundPrice(1);
      await mint({ roundId: 1, factionId: 0, amount: 1 }, users[0], {
        price: actualPrice,
      });
    });

    it("Price should now be the minimum", async () => {
      const round = rounds[1];

      const oldPrice = await instance.roundPrice(1);
      const remainingDecrease = oldPrice
        .sub(round.price.min)
        .div(round.price.decreaseAmount)
        .add(getBN(1));

      await time.increase(round.price.decreaseTime.mul(remainingDecrease));
      const newPrice = await instance.roundPrice(1);
      assert.equal(
        newPrice.toString(),
        round.price.min.toString(),
        "Incorrect price decrease"
      );
    });

    it(`User can mint with the minimum price`, async () => {
      await mint({ roundId: 1, factionId: 0, amount: 1 }, users[0], {
        price: rounds[1].price.min,
      });
    });

    it(`Round 1 ended, users can't mint anymore (Reason: Round not in progress)`, async () => {
      const roundEndTime = testStartTime
        .add(rounds[1].startTime)
        .add(rounds[1].duration);
      await time.increaseTo(roundEndTime);
      const latestTime = await time.latest();
      assert.equal(roundEndTime.lte(latestTime), true, "End time not correct");

      await expectRevert(
        mint({ roundId: 1, factionId: 1, amount: 1 }, users[3]),
        `Round not in progress`
      );
    });

    it(`Owner can edit round 1 for change duration, now infinite for SOLD OUT tests`, async () => {
      rounds[1].duration = 0;
      await setupMintRound(rounds[1]);
    });
  });

  /**
   * ROUND 1 - SOLD OUT
   */
  describe("\n ROUND 1 - SOLD OUT", () => {
    it(`User can't set maxMintsPerWallet for public round (Reason: caller is not the owner)`, async () => {
      await expectRevert(
        instance.setMaxMintsPerWallet(99999, {
          from: user1,
        }),
        `Ownable: caller is not the owner`
      );
    });

    it("Owner should be able to set maxMintsPerWallet to 99999 for sold out tests", async () => {
      await instance.setMaxMintsPerWallet(99999, {
        from: owner,
      });

      const newMaxMintsPerWallet = await instance.maxMintsPerWallet();
      assert.equal(
        newMaxMintsPerWallet.toString(),
        "99999",
        "Incorrect newMaxMintsPerWallet"
      );
    });

    ["PURE_GENE", "ASSIMILEE"].forEach((factionName, factionId) => {
      it(`All remaining tokens are minted for faction ${factionName} in round 1`, async () => {
        const roundId = 1;
        const round = await instance.rounds(roundId);
        const supply = round.supply[factionId];
        const totalMinted = round.totalMinted[factionId];

        const remaining = supply - totalMinted;
        const batchSize = 10;

        const mintPerBatchNb = Math.floor(remaining / batchSize);
        const rest = remaining % batchSize;

        // Set progress bar
        console.log(`\tWait while users mint ${remaining} tokens...`);
        const progressBar = new cliProgress.SingleBar(
          {
            format:
              "\tMint: [{bar}] {percentage}% | {value}/{total} tokens | ETA: {eta}s | Duration: {duration_formatted}",
          },
          cliProgress.Presets.shades_classic
        );
        progressBar.start(remaining, 0);
        for (let i = 0; i < mintPerBatchNb; i++) {
          await mint(
            {
              roundId: roundId,
              factionId: factionId,
              amount: batchSize,
            },
            users[Math.floor(Math.random() * users.length)]
          );
          progressBar.increment(batchSize);
        }
        if (rest) {
          await mint(
            {
              roundId: roundId,
              factionId: factionId,
              amount: rest,
            },
            user2
          );
        }
        progressBar.increment(rest);
        progressBar.stop();
      });

      it(`${factionName} is now sold out for round 1`, async () => {
        const round = await instance.rounds(1);

        assert.equal(
          round.supply[factionId],
          round.totalMinted[factionId],
          "Incorrect totalMinted"
        );
      });

      it(`Users can't mint ${factionName} in round 1 anymore (Reason: Round supply exceeded)`, async () => {
        await expectRevert(
          mint({ roundId: 1, factionId, amount: 1 }, users[3]),
          `Round supply exceeded`
        );
      });
    });
  });

  /**
   * ROUNDS 2 & 3 - WHITELISTS TIERS 1 & 2
   */
  describe("\n ROUNDS 2 & 3 - WHITELISTS TIERS 1 & 2", () => {
    it(`Round 2 and round 3 started at the same time `, async () => {
      await time.increaseTo(testStartTime.add(rounds[2].startTime));
      const latestTime = await time.latest();
      const round2 = await instance.rounds(2);
      assert.equal(
        round2.startTime >= latestTime.toNumber(),
        true,
        "Start time not correct"
      );

      const round3 = await instance.rounds(3);
      assert.equal(
        round3.startTime >= latestTime.toNumber(),
        true,
        "Start time not correct"
      );
    });

    it(`User can't mint in a whitelist round after payload (Reason: Signature expired)`, async () => {
      const latestTime = await time.latest();
      await expectRevert(
        mint({ roundId: 2, amount: 1, factionId: 1, maxMint: 5 }, user1, {
          payloadExpiration: latestTime.sub(time.duration.seconds(30)),
        }),
        `Signature expired`
      );
    });

    it(`User can't mint in a whitelist round with an other validator (Reason: Invalid signature)`, async () => {
      await expectRevert(
        mint({ roundId: 3, amount: 1, factionId: 1, maxMint: 5 }, user1, {
          validator_private_key: otherPrivateKey,
        }),
        `Invalid signature`
      );
    });

    it(`User can't mint in a whitelist round without validator (Reason: Need a sig)`, async () => {
      await expectRevert(
        instance.mint(2, 1, 1, {
          from: user1,
        }),
        `Need a sig`
      );
    });

    it(`User can't mint more tokens than maximum authorized by the validator (Reason: Max allowed)`, async () => {
      await expectRevert(
        mint({ roundId: 3, factionId: 1, amount: 5, maxMint: 4 }, user1),
        `Max allowed`
      );
    });

    it(`User can't mint with a lower price (Reason: Wrong price)`, async () => {
      await expectRevert(
        mint({ roundId: 2, factionId: 1, amount: 2, maxMint: 2 }, user1, {
          price: getAmount(0.001),
        }),
        `Wrong price`
      );
    });

    it(`User can't mint 0 tokens (Reason: Zero amount)`, async () => {
      await expectRevert(
        mint({ roundId: 3, amount: 0, maxMint: 2, factionId: 0 }, user1),
        `Zero amount`
      );
    });

    it(`User can't mint an other faction than the one given in the signature (Reason: Invalid signature)`, async () => {
      await expectRevert(
        mint({ roundId: 3, amount: 0, maxMint: 2, factionId: 0 }, user1, {
          signatureFactionId: 1,
        }),
        `Invalid signature`
      );
    });

    for (let roundId = 2; roundId <= 3; roundId++) {
      it(`User1 can mint a token in round ${roundId} with a signature !`, async () => {
        await mint({ roundId, amount: 2, factionId: 1, maxMint: 2 }, user1);
      });

      it(`User1 can't mint more tokens in round ${roundId} (Reason: Max allowed)`, async () => {
        await expectRevert(
          mint({ roundId, amount: 1, factionId: 1, maxMint: 2 }, user1),
          `Max allowed`
        );
      });

      it(`User1 can mint tokens again in round ${roundId} (validator's choice) !`, async () => {
        await mint({ roundId, factionId: 1, amount: 3, maxMint: 5 }, user1);
      });
    }

    it(`2 hours later, the price has not changed`, async () => {
      const roundId = 2;
      const round = rounds[roundId];
      const oldPrice = await instance.roundPrice(roundId);
      await time.increase(time.duration.hours(2));
      const newPrice = await instance.roundPrice(roundId);
      assert.equal(newPrice.toString(), oldPrice.toString(), "Incorrect price");
    });
  });

  /**
   * ROUND 2 & 3 - SOLD OUT
   */
  describe("\n ROUND 2 & 3 - SOLD OUT", () => {
    for (let roundId = 2; roundId <= 3; roundId++) {
      ["PURE_GENE", "ASSIMILEE"].forEach((factionName, factionId) => {
        it(`All remaining tokens are minted for faction ${factionName} in round ${roundId}`, async () => {
          const round = await instance.rounds(roundId);
          const supply = round.supply[factionId];
          const totalMinted = round.totalMinted[factionId];

          const remaining = supply - totalMinted;
          const batchSize = 10;

          const mintPerBatchNb = Math.floor(remaining / batchSize);
          const rest = remaining % batchSize;

          // Set progress bar
          console.log(`\tWait while users mint ${remaining} tokens...`);
          const progressBar = new cliProgress.SingleBar(
            {
              format:
                "\tMint: [{bar}] {percentage}% | {value}/{total} tokens | ETA: {eta}s | Duration: {duration_formatted}",
            },
            cliProgress.Presets.shades_classic
          );
          progressBar.start(remaining, 0);
          for (let i = 0; i < mintPerBatchNb; i++) {
            await mint(
              {
                roundId: roundId,
                factionId: factionId,
                amount: batchSize,
                maxMint: 999999,
              },
              users[Math.floor(Math.random() * users.length)]
            );
            progressBar.increment(batchSize);
          }
          if (rest) {
            await mint(
              {
                roundId: roundId,
                factionId: factionId,
                amount: rest,
                maxMint: 999999,
              },
              user2
            );
          }
          progressBar.increment(rest);
          progressBar.stop();
        });

        it(`${factionName} is now sold out for round ${roundId}`, async () => {
          const round = await instance.rounds(roundId);

          assert.equal(
            round.supply[factionId],
            round.totalMinted[factionId],
            "Incorrect totalMinted"
          );
        });

        it(`Users can't mint ${factionName} in round ${roundId} anymore (Reason: Round supply exceeded)`, async () => {
          await expectRevert(
            mint({ roundId, factionId, amount: 1, maxMint: 99999 }, users[3]),
            `Round supply exceeded`
          );
        });
      });
    }
  });

  /**
   * AIRDROPS
   */
  describe("\n AIRDROPS", () => {
    it(`Users can't airdrop tokens (Reason: caller is not owner)`, async () => {
      await expectRevert(
        airdrop({ factionId: 1, amount: 1 }, user1, { from: user2 }),
        `Ownable: caller is not the owner`
      );
    });

    it(`Owner can't airdrop O tokens`, async () => {
      await expectRevert(
        airdrop({ factionId: 1, amount: 0 }, user1),
        `Zero amount`
      );
    });

    it(`Owner can't airdrop a non-existing faction, like faction 2 or 3  (Reason: Panic: Enum value out of bounds)`, async () => {
      await expectRevert(
        airdrop({ amount: 1, factionId: 2 }, user1),
        `Panic: Enum value out of bounds`
      );
      await expectRevert(
        airdrop({ amount: 1, factionId: 3 }, user1),
        `Panic: Enum value out of bounds`
      );
    });

    it(`Owner can't airdrop more tokens than the total remaining supply (Reason: Supply exceeded)`, async () => {
      const supply = await instance.totalSupply();
      const amount = MAX_SUPPLY.sub(supply).toNumber() + 1;
      await expectRevert(
        airdrop({ factionId: 1, amount }, user1),
        `Supply exceeded`
      );
    });

    it(`Owner can't airdrop more tokens than the faction total remaining supply (Reason: Faction supply exceeded)`, async () => {
      const supply = await instance.totalSupplyByFaction(1);
      const factionMaxSupply = MAX_SUPPLY_BY_FACTION[1];
      const amount = factionMaxSupply.sub(supply).toNumber() + 1;
      await expectRevert(
        airdrop({ factionId: 1, amount }, user1),
        `Faction supply exceeded`
      );
    });

    it(`Owner do severals airdrops`, async () => {
      for (let i = 1; i < 5; i++) {
        await airdrop({ factionId: i % 2, amount: i }, accounts[i]);
      }
      await airdrop({ factionId: 1, amount: 10 }, user1);
    });
  });

  /**
   * CONTRACT SOLD OUT
   */
  describe("\n CONTRACT SOLD OUT", () => {
    it(`Owner can create round 4 (inifite and free)`, async () => {
      await setupMintRound(rounds[4]);
    });

    ["PURE_GENE", "ASSIMILEE"].forEach((factionName, factionId) => {
      it(`All remaining tokens are minted for faction ${factionName}`, async () => {
        roundId = 4;

        const totalMinted = await instance.totalSupplyByFaction(factionId);
        const supply = MAX_SUPPLY_BY_FACTION[factionId].toNumber();
        const remaining = supply - totalMinted;
        const batchSize = 10;

        const mintPerBatchNb = Math.floor(remaining / batchSize);
        const rest = remaining % batchSize;

        // Set progress bar
        console.log(`\tWait while users mint ${remaining} tokens...`);
        const progressBar = new cliProgress.SingleBar(
          {
            format:
              "\tMint: [{bar}] {percentage}% | {value}/{total} tokens | ETA: {eta}s | Duration: {duration_formatted}",
          },
          cliProgress.Presets.shades_classic
        );
        progressBar.start(remaining, 0);
        for (let i = 0; i < mintPerBatchNb; i++) {
          await mint(
            {
              roundId: roundId,
              factionId: factionId,
              amount: batchSize,
              maxMint: 99999,
            },
            users[Math.floor(Math.random() * users.length)]
          );
          progressBar.increment(batchSize);
        }
        if (rest) {
          await mint(
            {
              roundId: roundId,
              factionId: factionId,
              amount: rest,
              maxMint: 99999,
            },
            user2
          );
        }
        progressBar.increment(rest);
        progressBar.stop();
      });

      it(`${factionName} is now sold out`, async () => {
        const supply = MAX_SUPPLY_BY_FACTION[factionId];
        const totalMinted = await instance.totalSupplyByFaction(factionId);

        assert.equal(
          totalMinted.toNumber(),
          supply.toNumber(),
          "Incorrect supply"
        );
      });
    });

    it(`Users can't mint PURE_GENE anymore (Reason: Supply exceeded)`, async () => {
      await expectRevert(
        mint({ roundId: 4, factionId: 0, amount: 1, maxMint: 99999 }, users[3]),
        `Supply exceeded`
      );
    });

    it(`Users can't mint ASSIMILEE anymore (Reason: Supply exceeded)`, async () => {
      await expectRevert(
        mint({ roundId: 4, factionId: 1, amount: 1, maxMint: 99999 }, users[3]),
        `Supply exceeded`
      );
    });

    it("Contract is now sold out (totalSupply == MAX_SUPPLY)", async () => {
      const supply = await instance.totalSupply();

      assert.equal(
        supply.toString(),
        MAX_SUPPLY.toString(),
        "Incorrect totalSupply"
      );
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

    it(`Users can't withdraw contract eth (Reason: caller is not the owner)`, async () => {
      await expectRevert(
        instance.withdraw(users[0], contractBalance, {
          from: users[0],
        }),
        `Ownable: caller is not the owner`
      );
    });

    it(`Owner can send 5% of the balance to a random address`, async () => {
      const to = users[3];
      const amount = contractBalance.mul(getBN(5)).div(getBN(100));
      const oldUserBalance = getBN(await web3.eth.getBalance(to));

      const tx = await instance.withdraw(to, amount, {
        from: owner,
      });
      await gasTracker.addCost(`Withdraw eth`, tx);

      // Verify balance
      const balance = await web3.eth.getBalance(instance.address);
      const newUserBalance = getBN(await web3.eth.getBalance(to));
      assert.equal(
        balance.toString(),
        contractBalance.sub(amount).toString(),
        "Incorrect contract balance"
      );
      assert.equal(
        newUserBalance.toString(),
        oldUserBalance.add(amount).toString(),
        "Incorrect user balance"
      );

      contractBalance = getBN(balance);
    });

    it(`Owner can send the rest of the balance to himself`, async () => {
      const oldUserBalance = getBN(await web3.eth.getBalance(owner));

      const tx = await instance.withdraw(owner, contractBalance, {
        from: owner,
      });
      const cost = await gasTracker.addCost(`Withdraw eth`, tx);

      // Verify balance
      const balance = await web3.eth.getBalance(instance.address);
      const newUserBalance = getBN(await web3.eth.getBalance(owner));
      assert.equal(balance.toString(), "0", "Incorrect contract balance");
      assert.equal(
        newUserBalance.toString(),
        oldUserBalance.add(contractBalance).sub(getBN(cost.price)).toString(),
        "Incorrect user balance"
      );

      contractBalance = balance;
    });
  });

  /**
   * GAS STATS
   */
  describe("\n GAS STATS", () => {
    it(`Get stats on gas`, async () => {
      // Get deployment cost
      const newInstance = await MechaPilots2219V1.new();
      await gasTracker.addCost("Deployment", {
        tx: newInstance.transactionHash,
      });

      gasTracker.consoleStats();
    });
  });
});
