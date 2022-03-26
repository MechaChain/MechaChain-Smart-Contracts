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
    {
      planetId: 0,
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
    {
      roundId: 0,
      planetId: 0,
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
      supplyPerType: [250, 125, 75, 50],
    },
    {
      roundId: 1,
      planetId: 0,
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
        (await instance.getPlanetSupplyByType(planetId, i)).toString(),
        supplyPerType[i].toString(),
        "Bad supplyPerType"
      );
      assert.equal(
        (await instance.getPlanetNotRevealUriByType(planetId, i)).toString(),
        notRevealUriPerType[i].toString(),
        "Bad supplyPerType"
      );
    }

    assert.equal(planet.revealed, revealed || false, "Bad revealed");
    assert.equal(planet.baseURI, baseURI || "", "Bad baseURI");
  };

  const setupMintRound = async (
    {
      roundId,
      planetId,
      startTime,
      duration,
      validator,
      pricePerType,
      supplyPerType,
    },
    from = owner
  ) => {
    const tx = await instance.setupMintRound(
      roundId,
      planetId,
      testStartTime.add(startTime),
      duration,
      validator,
      pricePerType,
      supplyPerType,
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

    for (let i = 0; i < pricePerType.length; i++) {
      assert.equal(
        (await instance.getRoundSupplyByType(roundId, i)).toString(),
        supplyPerType[i].toString(),
        "Bad supplyPerType"
      );
      assert.equal(
        (await instance.getRoundPriceByType(planetId, i)).toString(),
        pricePerType[i].toString(),
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
    const oldPlanetTotalMinted = await instance.getPlanetTotalMintedByType(
      round.planetId,
      landType
    );
    const oldRoundTotalMinted = await instance.getRoundTotalMintedByType(
      round.planetId,
      landType
    );
    const oldUserRoundTotalMinted =
      await instance.getRoundTotalMintedByTypeForUser(
        user,
        round.planetId,
        landType
      );

    const price =
      overrideData?.price ||
      (await instance.getRoundPriceByType(roundId, landType));
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
    const newPlanetTotalMinted = await instance.getPlanetTotalMintedByType(
      round.planetId,
      landType
    );
    const newRoundTotalMinted = await instance.getRoundTotalMintedByType(
      round.planetId,
      landType
    );
    const newUserRoundTotalMinted =
      await instance.getRoundTotalMintedByTypeForUser(
        user,
        round.planetId,
        landType
      );

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

  it("Owner can't create a planet (Reason: Incorrect length of supply and uri)", async () => {
    await expectRevert(
      setupPlanet({
        planetId: 0,
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
        planetId: 0,
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
        planetId: 0,
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

  it("User can't create planet (Reason: caller is not the owner)", async () => {
    await expectRevert(
      setupPlanet(planets[0], users[0]),
      `Ownable: caller is not the owner`
    );
  });

  it("Owner can create planet 0", async () => {
    await setupPlanet(planets[0]);
  });

  /**
   * ROUND CREATION
   */
  it("Owner can't create a mint round (Reason: Incorrect length of supply and price)", async () => {
    await expectRevert(
      setupMintRound({
        roundId: 0,
        planetId: 0,
        startTime: time.duration.days(1),
        duration: time.duration.days(1),
        validator: "0x6F76846f7C90EcEC371e1d96cA93bfE9d36eEb83",
        pricePerType: [
          getAmount(0.1),
          getAmount(0.2),
          getAmount(0.5), // Incorrect length here
        ],
        supplyPerType: [250, 125, 75, 50],
      }),
      `Incorrect length`
    );
    await expectRevert(
      setupMintRound({
        roundId: 0,
        planetId: 0,
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
      }),
      `Incorrect length`
    );
    await expectRevert(
      setupMintRound({
        roundId: 0,
        planetId: 0,
        startTime: time.duration.days(1),
        duration: time.duration.days(1),
        validator: "0x6F76846f7C90EcEC371e1d96cA93bfE9d36eEb83",
        pricePerType: [
          getAmount(0.1),
          getAmount(0.2),
          getAmount(0.5), // Incorrect length here
        ],
        supplyPerType: [250, 125, 75], // Incorrect length here
      }),
      `Incorrect length`
    );
  });

  it("User can't create a mint round (Reason: caller is not the owner)", async () => {
    await expectRevert(
      setupMintRound(rounds[0], users[0]),
      `Ownable: caller is not the owner`
    );
  });

  it("Owner can create round 0", async () => {
    await setupMintRound(rounds[0]);
  });

  /**
   * MINT
   */
  it("User can't mint in round 0 if not started (Reason: Round not in progress)", async () => {
    await expectRevert(
      mint({ roundId: 0, landType: 0, amount: 1, maxMint: 5 }, users[0]),
      `Round not in progress`
    );
  });

  it("User can't mint in a non existing round (Reason: Round not in progress)", async () => {
    await expectRevert(
      mint({ roundId: 10, landType: 0, amount: 1, maxMint: 5 }, users[0]),
      `Round not in progress`
    );
  });

  it("User can't mint in round 0 after payload (Reason: Signature expired)", async () => {
    // start round 0
    await time.increaseTo(testStartTime.add(rounds[0].startTime));
    const latestTime = await time.latest();

    await expectRevert(
      mint({ roundId: 0, landType: 0, amount: 1, maxMint: 5 }, users[0], {
        payloadExpiration: latestTime.sub(time.duration.seconds(30)),
      }),
      `Signature expired`
    );
  });

  it("User can't mint in round 0 with an other validator (Reason: Invalid signature)", async () => {
    await expectRevert(
      mint({ roundId: 0, landType: 0, amount: 1, maxMint: 5 }, users[0], {
        validator_private_key: otherPrivateKey,
      }),
      `Invalid signature`
    );
  });

  it("User can't mint in round 0 without validator (Reason: Need a sig)", async () => {
    await expectRevert(
      instance.mint(0, 0, 1, {
        from: users[0],
      }),
      `Need a sig`
    );
  });

  it("User can't mint more tokens than maximum authorized in round 0 (Reason: Max allowed)", async () => {
    await expectRevert(
      mint({ roundId: 0, landType: 0, amount: 5, maxMint: 4 }, users[0]),
      `Max allowed`
    );
  });

  it("User1 can mint a token in wave 0 !", async () => {
    await mint({ roundId: 0, landType: 0, amount: 2, maxMint: 2 }, users[0]);
  });

  // "Can decrease types"
  // planet "Supply lower than already minted"
  // round "Supply lower than already minted"

  it("Get stats on gas", async () => {
    // Get deployment cost
    const newInstance = await MechaLandsV1.new();
    await gasTracker.addCost("Deployment", { tx: newInstance.transactionHash });

    gasTracker.consoleStats();
  });
});
