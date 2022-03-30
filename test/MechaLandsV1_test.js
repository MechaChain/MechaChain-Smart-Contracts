// Load modules
const { time, expectRevert, snapshot } = require("@openzeppelin/test-helpers");

// Load artifacts
const MechaLandsV1 = artifacts.require("MechaLandsV1");

// Load utils
const {
  getAmount,
  getBN,
  getBNRange,
  gasTracker,
  getSignature,
} = require("../utils");

contract("MechaLandsV1", (accounts) => {
  const [owner, ...users] = accounts;
  let instance, testStartTime, chainid;

  const planets = [
    {}, // 0 not possible
    {
      planetId: 1,
      typesNumber: 4,
      supplyPerType: [500, 250, 150, 99], // supply = 999
      notRevealUriPerType: [
        "http://planet-0/land-0.json",
        "http://planet-0/land-1.json",
        "http://planet-0/land-2.json",
        "http://planet-0/land-3.json",
      ],
    },
  ];

  const rounds = [
    {}, // 0 not possible
    {
      roundId: 1,
      planetId: 1,
      startTime: time.duration.days(1), // to add to `testStartTime`
      duration: time.duration.days(1),
      validator: "0x6F76846f7C90EcEC371e1d96cA93bfE9d36eEb83",
      validator_private_key:
        "0xfeae30926cea7dfa8fb803c348aef7f06941b9af7770e6b62c0dcb543d3391a7",
      pricePerType: [
        getAmount(0.1),
        getAmount(0.2),
        getAmount(0.5),
        getAmount(0.8),
      ],
      supplyPerType: [15, 15, 15, 15],
      limitedPerType: false,
      maxMintPerType: [8, 8, 8, 8],
    },
    {
      roundId: 2,
      planetId: 1,
      startTime: time.duration.days(2), // to add to `testStartTime`
      duration: time.duration.days(1),
      // no validator
      pricePerType: [
        getAmount(0.15),
        getAmount(0.3),
        getAmount(0.75),
        getAmount(1),
      ],
      supplyPerType: [999, 999, 999, 999], // incoherent supply for use planet supply
      limitedPerType: true,
      maxMintPerType: [5, 5, 5, 5],
    },
  ];

  const otherPrivateKey =
    "0x253d7333eba154ef8fc973ee4ae2e5f35d4cc8da5db8a9e6aaa51417902c2501";

  /**
   * ========================
   *        FUNCTIONS
   * ========================
   */

  const setupPlanet = async (
    {
      planetId,
      typesNumber,
      supplyPerType,
      notRevealUriPerType,
      revealed,
      baseURI,
      burnable,
    },
    from = owner
  ) => {
    const tx = await instance.setupPlanet(
      planetId,
      typesNumber,
      supplyPerType,
      notRevealUriPerType,
      { from: from }
    );
    await gasTracker.addCost("Setup Planet", tx);

    const planet = await instance.planets(planetId);
    assert.equal(
      planet.typesNumber.toString(),
      typesNumber.toString(),
      "Bad typesNumber"
    );
    for (let i = 0; i < notRevealUriPerType.length; i++) {
      assert.equal(
        (await instance.planetSupplyByType(planetId, i + 1)).toString(),
        supplyPerType[i].toString(),
        "Bad supplyPerType"
      );
      assert.equal(
        (await instance.planetNotRevealUriByType(planetId, i + 1)).toString(),
        notRevealUriPerType[i].toString(),
        "Bad supplyPerType"
      );
    }

    assert.equal(planet.revealed, revealed || false, "Bad revealed");
    assert.equal(planet.burnable, burnable || false, "Bad burnable");
    assert.equal(planet.baseURI, baseURI || "", "Bad baseURI");
  };

  const setupMintRound = async (
    {
      roundId,
      planetId,
      startTime,
      duration,
      validator,
      limitedPerType,
      pricePerType,
      supplyPerType,
      maxMintPerType,
    },
    from = owner
  ) => {
    const tx = await instance.setupMintRound(
      roundId,
      planetId,
      testStartTime.add(startTime),
      duration,
      validator,
      limitedPerType || false,
      pricePerType,
      supplyPerType,
      maxMintPerType,
      { from: from }
    );
    await gasTracker.addCost("Setup Mint Round", tx);

    const round = await instance.rounds(roundId);
    assert.equal(
      round.planetId.toString(),
      planetId.toString(),
      "Bad planetId"
    );
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
      round.limitedPerType,
      limitedPerType || false,
      "Bad limitedPerType"
    );

    for (let i = 0; i < pricePerType.length; i++) {
      assert.equal(
        (await instance.roundSupplyByType(roundId, i + 1)).toString(),
        supplyPerType[i].toString(),
        "Bad supplyPerType"
      );
      assert.equal(
        (await instance.roundPriceByType(planetId, i + 1)).toString(),
        pricePerType[i].toString(),
        "Bad supplyPerType"
      );
      assert.equal(
        (await instance.roundMaxMintByType(planetId, i + 1)).toString(),
        maxMintPerType[i].toString(),
        "Bad supplyPerType"
      );
    }
  };

  const mint = async (
    { roundId, landType, amount, maxMint },
    user,
    overrideData = {}
  ) => {
    const round = await instance.rounds(roundId);
    const oldBalance = await instance.balanceOf(user);
    const oldPlanetTotalMinted = await instance.planetTotalMintedByType(
      round.planetId,
      landType
    );
    const oldRoundTotalMinted = await instance.roundTotalMintedByType(
      round.planetId,
      landType
    );
    const oldUserRoundTotalMinted =
      await instance.roundTotalMintedByTypeForUser(
        user,
        round.planetId,
        landType
      );
    const oldTotalSupply = await instance.totalSupply();

    const price =
      overrideData?.price ||
      (await instance.roundPriceByType(roundId, landType));
    if (round.validator === "0x0000000000000000000000000000000000000000") {
      // mint without validator
      const tx = await instance.mint(roundId, landType, amount, {
        from: user,
        value: price.mul(getBN(amount)),
      });
      gasTracker.addCost(`Public mint ${amount}`, tx);
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
          landType,
          roundId,
          instance.address,
          chainid,
        ]
      );
      const tx = await instance.mintWithValidation(
        roundId,
        landType,
        amount,
        maxMint,
        payloadExpiration,
        signature,
        {
          from: user,
          value: price.mul(getBN(amount)),
        }
      );
      gasTracker.addCost(`Whitelist mint ${amount}`, tx);
    }

    const newBalance = await instance.balanceOf(user);
    const newPlanetTotalMinted = await instance.planetTotalMintedByType(
      round.planetId,
      landType
    );
    const newRoundTotalMinted = await instance.roundTotalMintedByType(
      round.planetId,
      landType
    );
    const newUserRoundTotalMinted =
      await instance.roundTotalMintedByTypeForUser(
        user,
        round.planetId,
        landType
      );
    const newTotalSupply = await instance.totalSupply();

    assert.equal(
      newBalance.toString(),
      oldBalance.add(getBN(amount)).toString(),
      "User balance not valid"
    );

    assert.equal(
      newPlanetTotalMinted.toString(),
      oldPlanetTotalMinted.add(getBN(amount)).toString(),
      "Planet total minted not valid"
    );

    assert.equal(
      newRoundTotalMinted.toString(),
      oldRoundTotalMinted.add(getBN(amount)).toString(),
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
  };

  /**
   * ========================
   *          TESTS
   * ========================
   */

  it("MechaLandsV1 should be deployed", async () => {
    testStartTime = await time.latest();

    instance = await MechaLandsV1.deployed();
    assert(instance.address !== "");

    const version = await instance.version();
    assert.equal(version.toString(), "1", "Bad version");
    chainid = await instance.chainid();
    chainid = chainid.toString();
  });

  /**
   * PLANET CREATION
   */
  describe("\n PLANET CREATION", () => {
    it("Owner can't create a planet (Reason: Incorrect length of supply and uri)", async () => {
      await expectRevert(
        setupPlanet({
          planetId: 1,
          typesNumber: 4,
          supplyPerType: [500, 250, 150], // Incorrect length here
          notRevealUriPerType: [
            "http://planet-0/land-0.json",
            "http://planet-0/land-1.json",
            "http://planet-0/land-2.json",
            "http://planet-0/land-3.json",
          ],
        }),
        `Incorrect length`
      );

      await expectRevert(
        setupPlanet({
          planetId: 1,
          typesNumber: 4,
          supplyPerType: [500, 250, 150, 99],
          notRevealUriPerType: [
            "http://planet-0/land-0.json",
            "http://planet-0/land-1.json",
            "http://planet-0/land-2.json", // Incorrect length here
          ],
        }),
        `Incorrect length`
      );

      await expectRevert(
        setupPlanet({
          planetId: 1,
          typesNumber: 3,
          supplyPerType: [500, 250, 150, 99], // Incorrect length here
          notRevealUriPerType: [
            "http://planet-0/land-0.json",
            "http://planet-0/land-1.json",
            "http://planet-0/land-2.json",
            "http://planet-0/land-3.json", // Incorrect length here
          ],
        }),
        `Incorrect length`
      );
    });

    it("Owner can't create a planet (Reason: Id can be 0)", async () => {
      await expectRevert(
        setupPlanet({
          planetId: 0,
          typesNumber: 4,
          supplyPerType: [500, 250, 150, 200],
          notRevealUriPerType: [
            "http://planet-0/land-0.json",
            "http://planet-0/land-1.json",
            "http://planet-0/land-2.json",
            "http://planet-0/land-3.json",
          ],
        }),
        `Id can be 0`
      );
    });

    it("Owner can't create the first planet at id 2 (Reason: Invalid planetId)", async () => {
      await expectRevert(
        setupPlanet({
          planetId: 2,
          typesNumber: 4,
          supplyPerType: [500, 250, 150, 200],
          notRevealUriPerType: [
            "http://planet-0/land-0.json",
            "http://planet-0/land-1.json",
            "http://planet-0/land-2.json",
            "http://planet-0/land-3.json",
          ],
        }),
        `Invalid planetId`
      );
    });

    it("User can't create planet (Reason: caller is not the owner)", async () => {
      await expectRevert(
        setupPlanet(planets[1], users[0]),
        `Ownable: caller is not the owner`
      );
    });

    it("Owner can create planet 1", async () => {
      await setupPlanet(planets[1]);
    });
  });

  /**
   * ROUND CREATION
   */
  describe("\n ROUND CREATION", () => {
    it("Owner can't create a mint round (Reason: Incorrect length of supply and price)", async () => {
      await expectRevert(
        setupMintRound({
          roundId: 1,
          planetId: 1,
          startTime: time.duration.days(1),
          duration: time.duration.days(1),
          validator: "0x6F76846f7C90EcEC371e1d96cA93bfE9d36eEb83",
          pricePerType: [
            getAmount(0.1),
            getAmount(0.2),
            getAmount(0.5), // Incorrect length here
          ],
          supplyPerType: [250, 125, 75, 50],
          limitedPerType: false,
          maxMintPerType: [250, 125, 75, 50],
        }),
        `Incorrect length`
      );
      await expectRevert(
        setupMintRound({
          roundId: 1,
          planetId: 1,
          startTime: time.duration.days(1),
          duration: time.duration.days(1),
          validator: "0x6F76846f7C90EcEC371e1d96cA93bfE9d36eEb83",
          pricePerType: [
            getAmount(0.1),
            getAmount(0.2),
            getAmount(0.5),
            getAmount(0.8),
          ],
          supplyPerType: [250, 125, 75], // Incorrect length here
          limitedPerType: false,
          maxMintPerType: [250, 125, 75, 50],
        }),
        `Incorrect length`
      );
      await expectRevert(
        setupMintRound({
          roundId: 1,
          planetId: 1,
          startTime: time.duration.days(1),
          duration: time.duration.days(1),
          validator: "0x6F76846f7C90EcEC371e1d96cA93bfE9d36eEb83",
          pricePerType: [
            getAmount(0.1),
            getAmount(0.2),
            getAmount(0.5),
            getAmount(0.8),
          ],
          supplyPerType: [250, 125, 75, 55],
          limitedPerType: false,
          maxMintPerType: [250, 125, 75], // Incorrect length here
        }),
        `Incorrect length`
      );
      await expectRevert(
        setupMintRound({
          roundId: 1,
          planetId: 1,
          startTime: time.duration.days(1),
          duration: time.duration.days(1),
          validator: "0x6F76846f7C90EcEC371e1d96cA93bfE9d36eEb83",
          pricePerType: [
            getAmount(0.1),
            getAmount(0.2),
            getAmount(0.5), // Incorrect length here
          ],
          supplyPerType: [250, 125, 75], // Incorrect length here
          limitedPerType: false,
          maxMintPerType: [250, 125, 75, 50],
        }),
        `Incorrect length`
      );
    });

    it("Owner can't create a mint round (Reason: Id can be 0)", async () => {
      await expectRevert(
        setupMintRound({
          roundId: 0,
          planetId: 1,
          startTime: time.duration.days(1),
          duration: time.duration.days(1),
          validator: "0x6F76846f7C90EcEC371e1d96cA93bfE9d36eEb83",
          pricePerType: [
            getAmount(0.1),
            getAmount(0.2),
            getAmount(0.5),
            getAmount(0.5),
          ],
          supplyPerType: [250, 125, 75, 50],
          limitedPerType: false,
          maxMintPerType: [250, 125, 75, 50],
        }),
        `Id can be 0`
      );
    });

    it("User can't create a mint round (Reason: caller is not the owner)", async () => {
      await expectRevert(
        setupMintRound(rounds[1], users[0]),
        `Ownable: caller is not the owner`
      );
    });

    it("Owner can create round 1", async () => {
      await setupMintRound(rounds[1]);
    });
  });

  /**
   * ROUND 1 MINT
   */
  describe("\n ROUND 1 MINT", () => {
    it("User can't mint in round 1 if not started (Reason: Round not in progress)", async () => {
      await expectRevert(
        mint({ roundId: 1, landType: 1, amount: 1, maxMint: 5 }, users[0]),
        `Round not in progress`
      );
    });

    it("User can't mint in a non existing round (Reason: Invalid round)", async () => {
      await expectRevert(
        mint({ roundId: 10, landType: 1, amount: 1, maxMint: 5 }, users[0]),
        `Invalid round`
      );
    });

    it("User can't mint in round 0 (Reason: Invalid round)", async () => {
      await expectRevert(
        mint({ roundId: 0, landType: 1, amount: 1, maxMint: 5 }, users[0]),
        `Invalid round`
      );
    });

    it("Round 1 started", async () => {
      await time.increaseTo(testStartTime.add(rounds[1].startTime));
      const latestTime = await time.latest();
      const round = await instance.rounds(1);
      assert.equal(
        round.startTime.gte(latestTime),
        true,
        "Start time not correct"
      );
    });

    it("User can't mint in round 1 after payload (Reason: Signature expired)", async () => {
      const latestTime = await time.latest();
      await expectRevert(
        mint({ roundId: 1, landType: 1, amount: 1, maxMint: 5 }, users[0], {
          payloadExpiration: latestTime.sub(time.duration.seconds(30)),
        }),
        `Signature expired`
      );
    });

    it("User can't mint in round 1 with an other validator (Reason: Invalid signature)", async () => {
      await expectRevert(
        mint({ roundId: 1, landType: 1, amount: 1, maxMint: 5 }, users[0], {
          validator_private_key: otherPrivateKey,
        }),
        `Invalid signature`
      );
    });

    it("User can't mint in round 1 without validator (Reason: Need a sig)", async () => {
      await expectRevert(
        instance.mint(1, 1, 1, {
          from: users[0],
        }),
        `Need a sig`
      );
    });

    it("User can't mint more tokens than maximum authorized by the validator (Reason: Validator max allowed)", async () => {
      await expectRevert(
        mint({ roundId: 1, landType: 1, amount: 5, maxMint: 4 }, users[0]),
        `Validator max allowed`
      );
    });

    it("User can't mint more tokens than maximum authorized by the round (Reason: Round max allowed)", async () => {
      await expectRevert(
        mint(
          {
            roundId: 1,
            landType: 1,
            amount: rounds[1].maxMintPerType[0] + 1,
            maxMint: rounds[1].maxMintPerType[0] * 1000,
          },
          users[0]
        ),
        `Round max allowed`
      );
    });

    it("User can't mint a tokens of type 0 or 5 (Reason: Round supply exceeded or Incorrect type)", async () => {
      await expectRevert(
        mint({ roundId: 1, landType: 0, amount: 1, maxMint: 4 }, users[0]),
        `Round supply exceeded`
      );
      await expectRevert(
        mint({ roundId: 1, landType: 5, amount: 1, maxMint: 4 }, users[0]),
        `Round supply exceeded`
      );
    });

    it("User can't mint (Reason: Wrong price)", async () => {
      await expectRevert(
        mint({ roundId: 1, landType: 2, amount: 2, maxMint: 2 }, users[0], {
          price: rounds[1].pricePerType[0],
        }),
        `Wrong price`
      );
    });

    it("User1 can mint a token in round 1 !", async () => {
      await mint({ roundId: 1, landType: 1, amount: 2, maxMint: 2 }, users[0]);
    });

    it("User1 can't mint more tokens in round 1, no matter what type (Reason: Validator max allowed)", async () => {
      await expectRevert(
        mint({ roundId: 1, landType: 1, amount: 1, maxMint: 2 }, users[0]),
        `Validator max allowed`
      );
      await expectRevert(
        mint({ roundId: 1, landType: 2, amount: 1, maxMint: 2 }, users[0]),
        `Validator max allowed`
      );
      await expectRevert(
        mint({ roundId: 1, landType: 3, amount: 1, maxMint: 2 }, users[0]),
        `Validator max allowed`
      );
      await expectRevert(
        mint({ roundId: 1, landType: 4, amount: 1, maxMint: 2 }, users[0]),
        `Validator max allowed`
      );
    });

    it("User1 can mint tokens again in round 1 (validator's choice , like new pilot pass) !", async () => {
      await mint({ roundId: 1, landType: 1, amount: 3, maxMint: 5 }, users[0]);
    });

    it("User2 can mint various types of tokens in round 1 !", async () => {
      await mint({ roundId: 1, landType: 1, amount: 2, maxMint: 6 }, users[1]);
      await mint({ roundId: 1, landType: 2, amount: 1, maxMint: 6 }, users[1]);
      await mint({ roundId: 1, landType: 3, amount: 1, maxMint: 6 }, users[1]);
      await mint({ roundId: 1, landType: 4, amount: 2, maxMint: 6 }, users[1]);
    });

    it("User2 can't mint more tokens in round 1, no matter what type (Reason: Validator max allowed)", async () => {
      await expectRevert(
        mint({ roundId: 1, landType: 1, amount: 1, maxMint: 6 }, users[1]),
        `Validator max allowed`
      );
      await expectRevert(
        mint({ roundId: 1, landType: 2, amount: 1, maxMint: 6 }, users[1]),
        `Validator max allowed`
      );
      await expectRevert(
        mint({ roundId: 1, landType: 3, amount: 1, maxMint: 6 }, users[1]),
        `Validator max allowed`
      );
      await expectRevert(
        mint({ roundId: 1, landType: 4, amount: 1, maxMint: 6 }, users[1]),
        `Validator max allowed`
      );

      // Try with decreased maxMint
      await expectRevert(
        mint({ roundId: 1, landType: 4, amount: 1, maxMint: 4 }, users[1]),
        `Validator max allowed`
      );
      await expectRevert(
        mint({ roundId: 1, landType: 1, amount: 1, maxMint: 0 }, users[1]),
        `Validator max allowed`
      );
    });

    it("Round 1 is now sold out for type 1", async () => {
      const type1Supply = await instance.roundSupplyByType(1, 1);
      const type1TotalMinted = await instance.roundTotalMintedByType(1, 1);

      const remainingTokens = type1Supply.sub(type1TotalMinted);

      // Severals users mints for type 1, one by one...
      for (let i = 0; i < remainingTokens.toNumber(); i++) {
        const user = users[i % users.length];
        await mint({ roundId: 1, landType: 1, amount: 1, maxMint: 1000 }, user);
      }

      // Now should by sold out
      const newType1Supply = await instance.roundSupplyByType(1, 1);
      const newType1TotalMinted = await instance.roundTotalMintedByType(1, 1);
      assert.equal(
        newType1Supply.toString(),
        newType1TotalMinted.toString(),
        "Total supply not valid"
      );
    });

    it("Users can't mint more tokens of type 1 (Reason: Round supply exceeded)", async () => {
      await expectRevert(
        mint({ roundId: 1, landType: 1, amount: 1, maxMint: 100 }, users[3]),
        `Round supply exceeded`
      );
    });

    it("Round 1 ended, users can't mint anymore (Reason: Round not in progress)", async () => {
      const roundEndTime = testStartTime
        .add(rounds[1].startTime)
        .add(rounds[1].duration);
      await time.increaseTo(roundEndTime);
      const latestTime = await time.latest();
      const round = await instance.rounds(1);
      assert.equal(roundEndTime.lte(latestTime), true, "End time not correct");

      await expectRevert(
        mint({ roundId: 1, landType: 1, amount: 1, maxMint: 5 }, users[3]),
        `Round not in progress`
      );
    });
  });

  /**
   * ROUND 2 MINT
   */
  describe("\n ROUND 2 MINT", () => {
    // TODO round max
  });

  /**
   * TOKEN DATA AND REVEAL
   */
  describe("\n TOKEN DATA AND REVEAL", () => {});

  /**
   * ROUND EDITION
   */
  describe("\n ROUND EDITION", () => {
    // TODO Owner can't edit a planet (Reason: Supply lower than already minted)
    // TODO Owner can edit a round with a new supply and price
  });

  /**
   * PLANET EDITION
   */
  describe("\n PLANET EDITION", () => {
    // TODO Owner can't edit a planet (Reason: Can decrease types)
    // TODO Owner can't edit a planet (Reason: Supply lower than already minted)
    // TODO Owner can edit a planet with a new types and a new supply
  });

  // TODO burn
  // TODO withdraw

  describe("\n GAS STATS", () => {
    it("Get stats on gas", async () => {
      // Get deployment cost
      const newInstance = await MechaLandsV1.new();
      await gasTracker.addCost("Deployment", {
        tx: newInstance.transactionHash,
      });

      gasTracker.consoleStats();
    });
  });
});
