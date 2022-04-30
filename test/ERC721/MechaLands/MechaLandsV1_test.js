// Load modules
const { time, expectRevert, snapshot } = require("@openzeppelin/test-helpers");
const { upgradeProxy, deployProxy } = require("@openzeppelin/truffle-upgrades");

// Load artifacts
const MechaLandsV1 = artifacts.require("MechaLandsV1");
const MechaLandsUpgradeTest = artifacts.require("MechaLandsUpgradeTest");

// Load functions
const {
  burn,
  getContractStorage,
  setupPlanet,
  setupMintRound,
  mint,
  airdrop,
  setTestStartTime,
} = require("./MechaLands_functions");

// Load utils
const {
  getAmount,
  getBN,
  getBNRange,
  gasTracker,
  getSignature,
} = require("../../../utils");

contract("MechaLandsV1", async (accounts) => {
  const [owner, distributor, ...users] = accounts;

  let instance, testStartTime, chainid;

  const planets = [
    {}, // 0 not possible
    {
      planetId: 1,
      typesNumber: 4,
      supplyPerType: [20, 10, 10, 10],
      notRevealUriPerType: [
        "http://planet-1/land-1.json",
        "http://planet-1/land-1.json",
        "http://planet-1/land-2.json",
        "http://planet-1/land-3.json",
      ],
    },
    {
      planetId: 2,
      typesNumber: 4,
      supplyPerType: [5, 5, 5, 5],
      notRevealUriPerType: [
        "http://planet-2/land-1.json",
        "http://planet-2/land-1.json",
        "http://planet-2/land-2.json",
        "http://planet-2/land-3.json",
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
        getAmount(0.01),
        getAmount(0.02),
        getAmount(0.05),
        getAmount(0.08),
      ],
      supplyPerType: [15, 15, 15, 15],
      limitedPerType: false,
      maxMintPerType: [8, 8, 8, 8],
    },
    {
      roundId: 2,
      planetId: 1,
      startTime: time.duration.days(2), // to add to `testStartTime`
      duration: 0,
      // no validator
      pricePerType: [
        getAmount(0.015),
        getAmount(0.03),
        getAmount(0.075),
        getAmount(0.1),
      ],
      supplyPerType: [999, 999, 999, 999], // incoherent supply for use planet supply
      limitedPerType: true,
      maxMintPerType: [3, 3, 3, 3],
    },
  ];

  const planetsBaseURI = "http://planets/";
  const planetsBaseExtension = ".json";

  const otherPrivateKey =
    "0x253d7333eba154ef8fc973ee4ae2e5f35d4cc8da5db8a9e6aaa51417902c2501";

  /**
   * ========================
   *          TESTS
   * ========================
   */

  it(`MechaLandsV1 should be deployed`, async () => {
    testStartTime = await time.latest();
    setTestStartTime(testStartTime);

    //instance = await MechaLandsV1.deployed();
    instance = await deployProxy(MechaLandsV1, [], {
      initializer: "initialize",
    });
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
    it(`Owner can't create a planet (Reason: Incorrect length of supply and uri)`, async () => {
      await expectRevert(
        setupPlanet(
          instance,
          {
            planetId: 1,
            typesNumber: 4,
            supplyPerType: [500, 250, 150], // Incorrect length here
            notRevealUriPerType: [
              "http://planet-1/land-1.json",
              "http://planet-1/land-1.json",
              "http://planet-1/land-2.json",
              "http://planet-1/land-3.json",
            ],
          },
          owner
        ),
        `Incorrect length`
      );

      await expectRevert(
        setupPlanet(
          instance,
          {
            planetId: 1,
            typesNumber: 4,
            supplyPerType: [500, 250, 150, 99],
            notRevealUriPerType: [
              "http://planet-1/land-1.json",
              "http://planet-1/land-1.json",
              "http://planet-1/land-2.json", // Incorrect length here
            ],
          },
          owner
        ),
        `Incorrect length`
      );

      await expectRevert(
        setupPlanet(
          instance,
          {
            planetId: 1,
            typesNumber: 3,
            supplyPerType: [500, 250, 150, 99], // Incorrect length here
            notRevealUriPerType: [
              "http://planet-1/land-1.json",
              "http://planet-1/land-1.json",
              "http://planet-1/land-2.json",
              "http://planet-1/land-3.json", // Incorrect length here
            ],
          },
          owner
        ),
        `Incorrect length`
      );
    });

    it(`Owner can't create a planet (Reason: Id can't be 0)`, async () => {
      await expectRevert(
        setupPlanet(
          instance,
          {
            planetId: 0,
            typesNumber: 4,
            supplyPerType: [500, 250, 150, 200],
            notRevealUriPerType: [
              "http://planet-1/land-1.json",
              "http://planet-1/land-1.json",
              "http://planet-1/land-2.json",
              "http://planet-1/land-3.json",
            ],
          },
          owner
        ),
        `Id can't be 0`
      );
    });

    it(`Owner can't create the first planet at id 2 (Reason: Invalid planetId)`, async () => {
      await expectRevert(
        setupPlanet(
          instance,
          {
            planetId: 2,
            typesNumber: 4,
            supplyPerType: [500, 250, 150, 200],
            notRevealUriPerType: [
              "http://planet-1/land-1.json",
              "http://planet-1/land-1.json",
              "http://planet-1/land-2.json",
              "http://planet-1/land-3.json",
            ],
          },
          owner
        ),
        `Invalid planetId`
      );
    });

    it(`User can't create planet (Reason: caller is not the owner)`, async () => {
      await expectRevert(
        setupPlanet(instance, planets[1], users[0]),
        `Ownable: caller is not the owner`
      );
    });

    it(`Owner can create planet 1`, async () => {
      await setupPlanet(instance, planets[1], owner);
    });

    it(`Owner can create planet 2`, async () => {
      await setupPlanet(instance, planets[2], owner);
    });
  });

  /**
   * ROUND CREATION
   */
  describe("\n ROUND CREATION", () => {
    it(`Owner can't create a mint round (Reason: Incorrect length of supply and price)`, async () => {
      await expectRevert(
        setupMintRound(
          instance,
          {
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
          },
          owner
        ),
        `Incorrect length`
      );
      await expectRevert(
        setupMintRound(
          instance,
          {
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
          },
          owner
        ),
        `Incorrect length`
      );
      await expectRevert(
        setupMintRound(
          instance,
          {
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
          },
          owner
        ),
        `Incorrect length`
      );
      await expectRevert(
        setupMintRound(
          instance,
          {
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
          },
          owner
        ),
        `Incorrect length`
      );
    });

    it(`Owner can't create a mint round (Reason: Id can't be 0)`, async () => {
      await expectRevert(
        setupMintRound(
          instance,
          {
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
          },
          owner
        ),
        `Id can't be 0`
      );
    });

    it(`Owner can't create the first round at id 2 (Reason: Invalid roundId)`, async () => {
      await expectRevert(
        setupMintRound(
          instance,
          {
            roundId: 2,
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
          },
          owner
        ),
        `Invalid roundId`
      );
    });

    it(`User can't create a mint round (Reason: caller is not the owner)`, async () => {
      await expectRevert(
        setupMintRound(instance, rounds[1], users[0]),
        `Ownable: caller is not the owner`
      );
    });

    it(`Owner can't create a round for a non-existent planet (Reason: Invalid planetId)`, async () => {
      await expectRevert(
        setupMintRound(
          instance,
          {
            roundId: 1,
            planetId: 4,
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
          },
          owner
        ),
        `Invalid planetId`
      );
    });

    it(`Owner can create round 1`, async () => {
      await setupMintRound(instance, rounds[1], owner);
    });

    it(`Owner can create round 2`, async () => {
      await setupMintRound(instance, rounds[2], owner);
    });
  });

  /**
   * BEFORE ROUNDS
   */
  describe("\n BEFORE ROUNDS", () => {
    it(`User can't mint in round 1 if not started (Reason: Round not in progress)`, async () => {
      await expectRevert(
        mint(
          instance,
          { roundId: 1, landType: 1, amount: 1, maxMint: 5 },
          users[0]
        ),
        `Round not in progress`
      );
    });

    it(`User can't mint in a non existing round (Reason: Invalid round)`, async () => {
      await expectRevert(
        mint(
          instance,
          { roundId: 10, landType: 1, amount: 1, maxMint: 5 },
          users[0]
        ),
        `Invalid round`
      );
    });

    it(`User can't mint in round 0 (Reason: Invalid round)`, async () => {
      await expectRevert(
        mint(
          instance,
          { roundId: 0, landType: 1, amount: 1, maxMint: 5 },
          users[0]
        ),
        `Invalid round`
      );
    });
  });

  /**
   * ROUND 1 MINT
   */
  describe("\n ROUND 1 MINT", () => {
    it(`Round 1 started`, async () => {
      await time.increaseTo(testStartTime.add(rounds[1].startTime));
      const latestTime = await time.latest();
      const round = await instance.rounds(1);
      assert.equal(
        round.startTime.gte(latestTime),
        true,
        "Start time not correct"
      );
    });

    it(`User can't mint in round 1 after payload (Reason: Signature expired)`, async () => {
      const latestTime = await time.latest();
      await expectRevert(
        mint(
          instance,
          { roundId: 1, landType: 1, amount: 1, maxMint: 5 },
          users[0],
          {
            payloadExpiration: latestTime.sub(time.duration.seconds(30)),
          }
        ),
        `Signature expired`
      );
    });

    it(`User can't mint in round 1 with an other validator (Reason: Invalid signature)`, async () => {
      await expectRevert(
        mint(
          instance,
          { roundId: 1, landType: 1, amount: 1, maxMint: 5 },
          users[0],
          {
            validator_private_key: otherPrivateKey,
          }
        ),
        `Invalid signature`
      );
    });

    it(`User can't mint in round 1 without validator (Reason: Need a sig)`, async () => {
      await expectRevert(
        instance.mint(1, 1, 1, {
          from: users[0],
        }),
        `Need a sig`
      );
    });

    it(`User can't mint more tokens than maximum authorized by the validator (Reason: Validator max allowed)`, async () => {
      await expectRevert(
        mint(
          instance,
          { roundId: 1, landType: 1, amount: 5, maxMint: 4 },
          users[0]
        ),
        `Validator max allowed`
      );
    });

    it(`User can't mint more tokens than maximum authorized by the round (Reason: Round max allowed)`, async () => {
      await expectRevert(
        mint(
          instance,
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

    it(`User can't mint a tokens of type 0 or 5 (Reason: Round supply exceeded or Incorrect type)`, async () => {
      await expectRevert(
        mint(
          instance,
          { roundId: 1, landType: 0, amount: 1, maxMint: 4 },
          users[0]
        ),
        `Round supply exceeded`
      );
      await expectRevert(
        mint(
          instance,
          { roundId: 1, landType: 5, amount: 1, maxMint: 4 },
          users[0]
        ),
        `Round supply exceeded`
      );
    });

    it(`User can't mint (Reason: Wrong price)`, async () => {
      await expectRevert(
        mint(
          instance,
          { roundId: 1, landType: 2, amount: 2, maxMint: 2 },
          users[0],
          {
            price: rounds[1].pricePerType[0],
          }
        ),
        `Wrong price`
      );
    });

    it(`User1 can mint a token in round 1 !`, async () => {
      await mint(
        instance,
        { roundId: 1, landType: 1, amount: 2, maxMint: 2 },
        users[0]
      );
    });

    it(`User1 can't mint more tokens in round 1, no matter what type (Reason: Validator max allowed)`, async () => {
      await expectRevert(
        mint(
          instance,
          { roundId: 1, landType: 1, amount: 1, maxMint: 2 },
          users[0]
        ),
        `Validator max allowed`
      );
      await expectRevert(
        mint(
          instance,
          { roundId: 1, landType: 2, amount: 1, maxMint: 2 },
          users[0]
        ),
        `Validator max allowed`
      );
      await expectRevert(
        mint(
          instance,
          { roundId: 1, landType: 3, amount: 1, maxMint: 2 },
          users[0]
        ),
        `Validator max allowed`
      );
      await expectRevert(
        mint(
          instance,
          { roundId: 1, landType: 4, amount: 1, maxMint: 2 },
          users[0]
        ),
        `Validator max allowed`
      );
    });

    it(`User1 can mint tokens again in round 1 (validator's choice , like new pilot pass) !`, async () => {
      await mint(
        instance,
        { roundId: 1, landType: 1, amount: 3, maxMint: 5 },
        users[0]
      );
    });

    it(`User2 can mint various types of tokens in round 1 !`, async () => {
      await mint(
        instance,
        { roundId: 1, landType: 1, amount: 2, maxMint: 6 },
        users[1]
      );
      await mint(
        instance,
        { roundId: 1, landType: 2, amount: 1, maxMint: 6 },
        users[1]
      );
      await mint(
        instance,
        { roundId: 1, landType: 3, amount: 1, maxMint: 6 },
        users[1]
      );
      await mint(
        instance,
        { roundId: 1, landType: 4, amount: 2, maxMint: 6 },
        users[1]
      );
    });

    it(`User2 can't mint more tokens in round 1, no matter what type (Reason: Validator max allowed)`, async () => {
      await expectRevert(
        mint(
          instance,
          { roundId: 1, landType: 1, amount: 1, maxMint: 6 },
          users[1]
        ),
        `Validator max allowed`
      );
      await expectRevert(
        mint(
          instance,
          { roundId: 1, landType: 2, amount: 1, maxMint: 6 },
          users[1]
        ),
        `Validator max allowed`
      );
      await expectRevert(
        mint(
          instance,
          { roundId: 1, landType: 3, amount: 1, maxMint: 6 },
          users[1]
        ),
        `Validator max allowed`
      );
      await expectRevert(
        mint(
          instance,
          { roundId: 1, landType: 4, amount: 1, maxMint: 6 },
          users[1]
        ),
        `Validator max allowed`
      );

      // Try with decreased maxMint
      await expectRevert(
        mint(
          instance,
          { roundId: 1, landType: 4, amount: 1, maxMint: 4 },
          users[1]
        ),
        `Validator max allowed`
      );
      await expectRevert(
        mint(
          instance,
          { roundId: 1, landType: 1, amount: 1, maxMint: 0 },
          users[1]
        ),
        `Validator max allowed`
      );
    });

    it(`Round 1 is now sold out for type 1`, async () => {
      const type1Supply = await instance.roundSupplyByType(1, 1);
      const type1TotalMinted = await instance.roundTotalMintedByType(1, 1);

      const remainingTokens = type1Supply.sub(type1TotalMinted);

      // Severals users mints for type 1, one by one...
      for (let i = 0; i < remainingTokens.toNumber(); i++) {
        const user = users[i % users.length];
        await mint(
          instance,
          { roundId: 1, landType: 1, amount: 1, maxMint: 1000 },
          user
        );
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

    it(`Users can't mint more tokens of type 1 (Reason: Round supply exceeded)`, async () => {
      await expectRevert(
        mint(
          instance,
          { roundId: 1, landType: 1, amount: 1, maxMint: 100 },
          users[3]
        ),
        `Round supply exceeded`
      );
    });

    it(`Round 1 ended, users can't mint anymore (Reason: Round not in progress)`, async () => {
      const roundEndTime = testStartTime
        .add(rounds[1].startTime)
        .add(rounds[1].duration);
      await time.increaseTo(roundEndTime);
      const latestTime = await time.latest();
      const round = await instance.rounds(1);
      assert.equal(roundEndTime.lte(latestTime), true, "End time not correct");

      await expectRevert(
        mint(
          instance,
          { roundId: 1, landType: 1, amount: 1, maxMint: 5 },
          users[3]
        ),
        `Round not in progress`
      );
    });
  });

  /**
   * ROUND 2 MINT
   */
  describe("\n ROUND 2 MINT", () => {
    it(`Round 2 started`, async () => {
      await time.increaseTo(testStartTime.add(rounds[2].startTime));
      const latestTime = await time.latest();
      const round = await instance.rounds(2);
      assert.equal(
        round.startTime.gte(latestTime),
        true,
        "Start time not correct"
      );
    });

    it(`User can't mint in round 2 with validator (Reason: No round validator)`, async () => {
      const user = users[0];
      const maxMint = 10;
      const landType = 1;
      const roundId = 2;
      const amount = 2;
      const price = rounds[1].pricePerType[0];
      const latestTime = await time.latest();
      const payloadExpiration = latestTime.add(time.duration.minutes(30));
      const signature = getSignature(rounds[1].validator_private_key, [
        user,
        payloadExpiration,
        maxMint,
        landType,
        roundId,
        instance.address,
        chainid,
      ]);

      await expectRevert(
        instance.mintWithValidation(
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
        ),
        `No round validator`
      );
    });

    it(`User can't mint more tokens than maximum authorized by the round (Reason: Round max allowed)`, async () => {
      await expectRevert(
        mint(
          instance,
          {
            roundId: 2,
            landType: 1,
            amount: rounds[2].maxMintPerType[0] + 1,
          },
          users[0]
        ),
        `Round max allowed`
      );
    });

    it(`User can't mint a tokens of type 0 or 5 (Reason: Round supply exceeded or Incorrect type)`, async () => {
      await expectRevert(
        mint(instance, { roundId: 2, landType: 0, amount: 1 }, users[0]),
        `Round supply exceeded`
      );
      await expectRevert(
        mint(instance, { roundId: 2, landType: 5, amount: 1 }, users[0]),
        `Round supply exceeded`
      );
    });

    it(`User can't mint (Reason: Wrong price)`, async () => {
      await expectRevert(
        mint(instance, { roundId: 2, landType: 1, amount: 1 }, users[0], {
          price: rounds[1].pricePerType[0],
        }),
        `Wrong price`
      );
    });

    // Tests each land type supply
    for (let landType = 1; landType <= planets[1].typesNumber; landType++) {
      it(`User1 can mint his maximum of tokens for type ${landType} (in one or more transactions)`, async () => {
        const maxMint = rounds[2].maxMintPerType[landType - 1];
        const firstMintAmount = (landType % maxMint) + 1;
        const lastMintAmount = maxMint - firstMintAmount;

        // first mint
        await mint(
          instance,
          { roundId: 2, landType, amount: firstMintAmount },
          users[0]
        );

        // last mint
        if (lastMintAmount > 0) {
          await mint(
            instance,
            {
              roundId: 2,
              landType,
              amount: lastMintAmount,
            },
            users[0]
          );
        }
      });

      it(`User1 can't mint more tokens for type ${landType} (Reason: Round max allowed)`, async () => {
        await expectRevert(
          mint(instance, { roundId: 2, landType, amount: 1 }, users[0]),
          `Round max allowed`
        );
      });
    }

    it(`Round 2 duration is infinite: user2 can mint 1 days later`, async () => {
      await time.increase(time.duration.days(1));

      await mint(
        instance,
        {
          roundId: 2,
          landType: 1,
          amount: 1,
        },
        users[1]
      );
    });

    it(`Users can mint each lands until sold out`, async () => {
      await time.increase(time.duration.days(1));

      for (let landType = 1; landType <= planets[1].typesNumber; landType++) {
        const supply = await instance.planetSupplyByType(1, landType);
        const maxMint = rounds[2].maxMintPerType[landType - 1];
        let remainingTokens = 1;
        let i = 0;
        do {
          const user = users[i++];
          const totalMinted = await instance.planetTotalMintedByType(
            1,
            landType
          );
          remainingTokens = supply.sub(totalMinted).toNumber();
          const userMintedInRound =
            await instance.roundTotalMintedByTypeForUser(user, 2, landType);
          const userRemaining = maxMint - userMintedInRound;
          const amount =
            userRemaining < remainingTokens ? userRemaining : remainingTokens;
          if (amount > 0) {
            await mint(
              instance,
              {
                roundId: 2,
                landType,
                amount,
              },
              user
            );
          }
        } while (remainingTokens > 0);

        // Now landType must be sold out for this planet
        const totalMinted = await instance.planetTotalMintedByType(1, landType);
        remainingTokens = supply.sub(totalMinted).toNumber();
        assert.equal(remainingTokens, 0, `Land ${landType} not sold out`);
      }
    });

    it(`Planet 1 is now sold out, users can't mint anymore (Reason: Planet supply exceeded)`, async () => {
      const user = users[users.length - 1]; // last user (should not have exceeded his limit)
      for (let landType = 1; landType <= planets[1].typesNumber; landType++) {
        await expectRevert(
          mint(instance, { roundId: 2, landType, amount: 1 }, user),
          `Planet supply exceeded`
        );
      }
    });
  });

  /**
   * TOKEN DATA AND REVEAL
   */
  describe("\n TOKEN DATA AND REVEAL", () => {
    it(`tokenURI refers to the correct not reveal data (land type and planet)`, async () => {
      // Try for 10 tokens
      for (let tokenId = 1; tokenId <= 10; tokenId++) {
        const tokenType = await instance.tokenType(tokenId);
        const tokenPlanet = await instance.tokenPlanet(tokenId);

        const expectedUri =
          planets[tokenPlanet.toNumber()].notRevealUriPerType[
            tokenType.toNumber() - 1
          ];
        const tokenURI = await instance.tokenURI(tokenId);

        assert.equal(tokenURI, expectedUri, "Invalid not reveal URI");
      }
    });

    it(`User can't activate the reveal for a planet (Reason: caller is not the owner)`, async () => {
      await expectRevert(
        instance.revealPlanet(1, "http://tests/", planetsBaseExtension, {
          from: users[1],
        }),
        `Ownable: caller is not the owner`
      );
    });

    it(`Admin should be able to activate the reveal`, async () => {
      const tx = await instance.revealPlanet(
        1,
        "http://tests/",
        planetsBaseExtension,
        {
          from: owner,
        }
      );
      await gasTracker.addCost(`revealPlanet`, tx);
      planets[1].revealed = true;
    });

    it(`User can't change the base URI and base extension of a planet a planet (Reason: caller is not the owner)`, async () => {
      await expectRevert(
        instance.setPlanetBaseURI(1, "http://tests/", planetsBaseExtension, {
          from: users[1],
        }),
        `Ownable: caller is not the owner`
      );
    });

    it(`Admin should be able to change the base URI and the base extension of a planet`, async () => {
      await instance.setPlanetBaseURI(1, planetsBaseURI, planetsBaseExtension, {
        from: owner,
      });
      planets[1].baseURI = planetsBaseURI;
      planets[1].baseExtension = planetsBaseExtension;
    });

    it(`tokenURI refers to the correct revealed URI`, async () => {
      // Try for 10 tokens
      for (let tokenId = 1; tokenId <= 10; tokenId++) {
        const tokenURI = await instance.tokenURI(tokenId);
        assert.equal(tokenURI, planetsBaseURI + tokenId + planetsBaseExtension);
      }
    });
  });

  /**
   * PLANET EDITION
   */
  describe("\n PLANET EDITION", () => {
    it(`User can't update a planet (Reason: caller is not the owner)`, async () => {
      await expectRevert(
        setupPlanet(instance, planets[1], users[0]),
        `Ownable: caller is not the owner`
      );
    });

    it(`Owner can't update a planet for remove a type (Reason: Can't decrease types)`, async () => {
      await expectRevert(
        setupPlanet(instance, { ...planets[1], typesNumber: 3 }, owner),
        `Can't decrease types`
      );
    });

    it(`Owner can't update a planet for decrease supply for lower than already minted`, async () => {
      await expectRevert(
        setupPlanet(
          instance,
          { ...planets[1], supplyPerType: [5, 5, 5, 5] },
          owner
        ),
        `Supply lower than already minted`
      );
    });

    it(`Owner can increase supply of planet 1 (+10 for each)`, async () => {
      planets[1].supplyPerType = planets[1].supplyPerType.map((x) => x + 10);
      await setupPlanet(instance, planets[1], owner);
    });

    it(`Owner can create a new type of land for planet 5 (supply of 10)`, async () => {
      planets[1].supplyPerType[4] = 10;
      planets[1].notRevealUriPerType[4] = "http://planet-1/land-5.json";
      planets[1].typesNumber = 5;
      await setupPlanet(instance, planets[1], owner);
    });
  });

  /**
   * ROUND EDITION
   */
  describe("\n ROUND EDITION", () => {
    it(`User can't update a round (Reason: caller is not the owner)`, async () => {
      await expectRevert(
        setupMintRound(instance, rounds[2], users[0]),
        `Ownable: caller is not the owner`
      );
    });

    it(`Owner can't update a round for decrease supply lower than already minted`, async () => {
      const newData = {
        supplyPerType: [5, 5, 5, 5, 5],
        pricePerType: [
          getAmount(0.01),
          getAmount(0.02),
          getAmount(0.05),
          getAmount(0.08),
          getAmount(0.08),
        ],
        maxMintPerType: [8, 8, 8, 8, 5],
      };
      await expectRevert(
        setupMintRound(instance, { ...rounds[2], ...newData }, owner),
        `Supply lower than already minted`
      );
    });

    it(`Owner can't update a round for change the planet (Reason: Can't change planetId)`, async () => {
      const newData = {
        planetId: 2,
        supplyPerType: [5, 5, 5, 5, 5],
        pricePerType: [
          getAmount(0.01),
          getAmount(0.02),
          getAmount(0.05),
          getAmount(0.08),
          getAmount(0.08),
        ],
        maxMintPerType: [8, 8, 8, 8, 5],
      };
      await expectRevert(
        setupMintRound(instance, { ...rounds[2], ...newData }, owner),
        `Can't change planetId`
      );
    });

    it(`Owner can increase supply of round 2`, async () => {
      rounds[2].supplyPerType[4] = 9999;
      rounds[2].pricePerType[4] = getAmount(0.08);
      rounds[2].maxMintPerType[4] = 3;
      await setupMintRound(instance, rounds[2], owner);
    });

    it(`Users can mint new tokens for all the 5 lands type`, async () => {
      const user = users[users.length - 1]; // last user (should not have exceeded his limit)
      for (let landType = 1; landType <= planets[1].typesNumber; landType++) {
        await mint(instance, { roundId: 2, landType, amount: 1 }, user);
      }
    });
  });

  /**
   * AIRDROPS
   */
  describe("\n AIRDROPS", () => {
    it(`Users can't airdrop tokens (Reason: caller is not owner nor planet distributor)`, async () => {
      await expectRevert(
        airdrop(instance, { planetId: 1, landType: 1, amount: 5 }, users[0], {
          from: users[1],
        }),
        `Caller is not owner nor planet distributor`
      );
    });

    it(`Owner can't airdrop tokens of type 0 or 6 (Reason: Incorrect type)`, async () => {
      await expectRevert(
        instance.airdrop(users[0], 1, 0, 1, { from: owner }),
        `Incorrect type`
      );
      await expectRevert(
        instance.airdrop(users[0], 1, 6, 1, { from: owner }),
        `Incorrect type`
      );
    });

    it(`Owner can't airdrop more tokens than planet supply (Reason: Planet supply exceeded)`, async () => {
      for (let landType = 1; landType <= planets[1].typesNumber; landType++) {
        const supply = await instance.planetSupplyByType(1, landType);
        const totalMinted = await instance.planetTotalMintedByType(1, landType);
        const amount = supply.sub(totalMinted).toNumber();
        await expectRevert(
          instance.airdrop(users[0], 1, landType, amount + 1, {
            from: owner,
          }),
          `Planet supply exceeded`
        );
      }
    });

    it(`Owner can't airdrop tokens of type 0 or 6 (Reason: Incorrect type)`, async () => {
      await expectRevert(
        airdrop(instance, { planetId: 1, landType: 0, amount: 1 }, users[0]),
        `Incorrect type`
      );
      await expectRevert(
        airdrop(instance, { planetId: 1, landType: 6, amount: 1 }, users[0]),
        `Incorrect type`
      );
    });

    it(`Owner do severals airdrops`, async () => {
      await airdrop(
        instance,
        { planetId: 1, landType: 1, amount: 1 },
        users[1],
        { from: owner }
      );
      await airdrop(
        instance,
        { planetId: 1, landType: 2, amount: 2 },
        users[1],
        { from: owner }
      );
      await airdrop(
        instance,
        { planetId: 1, landType: 3, amount: 3 },
        users[1],
        { from: owner }
      );
      await airdrop(
        instance,
        { planetId: 1, landType: 4, amount: 4 },
        users[1],
        { from: owner }
      );
      await airdrop(
        instance,
        { planetId: 1, landType: 5, amount: 5 },
        users[1],
        { from: owner }
      );
    });

    it(`Users can't change the distributor of a planet for airdrop tokens (Reason: caller is not the owner)`, async () => {
      await expectRevert(
        instance.setPlanetDistributor(1, distributor, { from: users[1] }),
        `Ownable: caller is not the owner`
      );
    });

    it(`Owner can change the distributor of a planet for airdrop tokens`, async () => {
      const tx = await instance.setPlanetDistributor(1, distributor, {
        from: owner,
      });

      await gasTracker.addCost(`setPlanetDistributor`, tx);

      const planet = await instance.planets(1);
      assert.equal(
        planet.distributor,
        distributor,
        "Invalid distributor address"
      );
    });

    it(`Distributor do severals airdrops`, async () => {
      await airdrop(
        instance,
        { planetId: 1, landType: 1, amount: 5 },
        users[1],
        {
          from: distributor,
        }
      );
      await airdrop(
        instance,
        { planetId: 1, landType: 2, amount: 4 },
        users[1],
        {
          from: distributor,
        }
      );
      await airdrop(
        instance,
        { planetId: 1, landType: 3, amount: 3 },
        users[1],
        {
          from: distributor,
        }
      );
      await airdrop(
        instance,
        { planetId: 1, landType: 4, amount: 2 },
        users[1],
        {
          from: distributor,
        }
      );
      await airdrop(
        instance,
        { planetId: 1, landType: 5, amount: 1 },
        users[1],
        {
          from: distributor,
        }
      );
    });
  });

  /**
   * BURNS
   */
  describe("\n BURNS", () => {
    it(`Users can't burn tokens (Reason: Planet not burnable)`, async () => {
      await expectRevert(
        instance.burn(1, {
          from: users[0],
        }),
        `Planet not burnable`
      );
    });

    it(`Owner can enabled the burn function for Planet 1`, async () => {
      const tx = await instance.setPlanetBurnable(1, true, {
        from: owner,
      });
      await gasTracker.addCost(`setPlanetBurnable`, tx);

      planets[1].burnable = true;
      const planet = await instance.planets(1);
      assert.equal(planet.burnable, true, "Burnable not activated");
    });

    it(`User1 can burn tokens !`, async () => {
      burn(instance, 1, users[0]);
    });

    it(`Owner can't burn a token of an user (Reason: not owner nor approved)`, async () => {
      await expectRevert(
        instance.burn(3, {
          from: owner,
        }),
        `ERC721Burnable: caller is not owner nor approved`
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
        getContractStorage().balance.toString(),
        "Incorrect ETH balance"
      );
    });

    it(`Users can't withdraw contract eth (Reason: caller is not the owner)`, async () => {
      await expectRevert(
        instance.withdraw(users[0], getContractStorage().balance, {
          from: users[0],
        }),
        `Ownable: caller is not the owner`
      );
    });

    it(`Owner can send 5% of the balance to a random address`, async () => {
      const to = users[3];
      const amount = getContractStorage().balance.mul(getBN(5)).div(getBN(100));
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
        getContractStorage().balance.sub(amount).toString(),
        "Incorrect contract balance"
      );
      assert.equal(
        newUserBalance.toString(),
        oldUserBalance.add(amount).toString(),
        "Incorrect user balance"
      );

      getContractStorage().balance = getBN(balance);
    });

    it(`Owner can send the rest of the balance to himself`, async () => {
      const oldUserBalance = getBN(await web3.eth.getBalance(owner));

      const tx = await instance.withdraw(owner, getContractStorage().balance, {
        from: owner,
      });
      const cost = await gasTracker.addCost(`Withdraw eth`, tx);

      // Verify balance
      const balance = await web3.eth.getBalance(instance.address);
      const newUserBalance = getBN(await web3.eth.getBalance(owner));
      assert.equal(balance.toString(), "0", "Incorrect contract balance");
      assert.equal(
        newUserBalance.toString(),
        oldUserBalance
          .add(getContractStorage().balance)
          .sub(getBN(cost.price))
          .toString(),
        "Incorrect user balance"
      );

      getContractStorage().balance = balance;
    });
  });

  describe("\n UPGRADE CONTRACT", () => {
    it(`Upgrade Smart Contract`, async () => {
      const oldUserBalance = getBN(await instance.balanceOf(users[1]));

      let instance2 = await upgradeProxy(
        instance.address,
        MechaLandsUpgradeTest
      );

      const newUserBalance = getBN(await instance2.balanceOf(users[1]));

      let value = await instance2.tellMeWhatIWant();

      assert.equal(
        value.toString(),
        "130486",
        `The new function does not return the value we wanted`
      );
      assert.equal(
        newUserBalance.toString(),
        oldUserBalance.toString(),
        "Incorrect balance after upgrading contract"
      );
      assert.equal((await instance2.version()).toString(), "2", `Bad version`);
    });
  });

  describe("\n GAS STATS", () => {
    it(`Get stats on gas`, async () => {
      // Get deployment cost
      const newInstance = await MechaLandsV1.new();
      await gasTracker.addCost("Deployment", {
        tx: newInstance.transactionHash,
      });

      console.log(getContractStorage());

      gasTracker.consoleStats();
    });
  });
});
