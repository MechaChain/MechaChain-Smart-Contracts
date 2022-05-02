// Load modules
const { time, expectRevert, snapshot } = require("@openzeppelin/test-helpers");
const { ZERO_ADDRESS } = require("@openzeppelin/test-helpers/src/constants");
const { upgradeProxy, deployProxy } = require("@openzeppelin/truffle-upgrades");
const cliProgress = require("cli-progress");
const { getAmount, gasTracker } = require("../../../utils");

// Load artifacts
const MechaLandsV1 = artifacts.require("MechaLandsV1");
const MechaLandsV2 = artifacts.require("MechaLandsV2");
const Mechanium = artifacts.require("Mechanium");

// Load functions
const {
  burn,
  getContractStorage,
  setupPlanet,
  setupMintRound,
  mint,
  airdrop,
  setTestStartTime,
  getRemainingTokens,
} = require("./MechaLands_functions");

contract("MechaLandsV2", async (accounts) => {
  const [owner, distributor, ...users] = accounts;

  let instance, testStartTime, chainid, mechanium;

  const planets = [
    {}, // 0 not possible
    {
      planetId: 1,
      typesNumber: 4,
      supplyPerType: [30, 20, 20, 20],
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
      supplyPerType: [30, 20, 20, 20],
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
      startTime: 0,
      duration: 0,
      validator: "0x6F76846f7C90EcEC371e1d96cA93bfE9d36eEb83",
      validator_private_key:
        "0xfeae30926cea7dfa8fb803c348aef7f06941b9af7770e6b62c0dcb543d3391a7",
      pricePerType: [
        getAmount(0.01),
        getAmount(0.02),
        getAmount(0.05),
        getAmount(0.08),
      ],
      supplyPerType: [10, 10, 10, 10],
      limitedPerType: true,
      maxMintPerType: [8, 8, 8, 8],
    },
    {
      roundId: 2,
      planetId: 1,
      startTime: 0, // to add to `testStartTime`
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
      maxMintPerType: [5, 5, 5, 5],
    },
    {
      roundId: 3,
      planetId: 2,
      startTime: 0, // to add to `testStartTime`
      duration: 0,
      validator: "0x6F76846f7C90EcEC371e1d96cA93bfE9d36eEb83",
      validator_private_key:
        "0xfeae30926cea7dfa8fb803c348aef7f06941b9af7770e6b62c0dcb543d3391a7",
      pricePerType: [
        getAmount(100),
        getAmount(200),
        getAmount(300),
        getAmount(400),
      ],
      supplyPerType: [10, 10, 10, 10],
      isMechaniumPaymentType: true,
      limitedPerType: true,
      maxMintPerType: [8, 8, 8, 8],
    },
    {
      roundId: 4,
      planetId: 2,
      startTime: 0, // to add to `testStartTime`
      duration: 0,
      // no validator
      pricePerType: [
        getAmount(100),
        getAmount(200),
        getAmount(300),
        getAmount(400),
      ],
      isMechaniumPaymentType: true,
      supplyPerType: [999, 999, 999, 999], // incoherent supply for use planet supply
      limitedPerType: true,
      maxMintPerType: [5, 5, 5, 5],
    },
  ];

  const MINT_AMOUNTS_ARRAY = [1, 2, 3, 4, 5, 10];

  /**
   * ========================
   *          TESTS
   * ========================
   */

  /**
   * MECHALANDSV1 - deploy, setups, mints, and burn
   */
  describe("\n MECHALANDSV1 - deploy, setups, mints, and burn", () => {
    it(`MechaLandsV1 should be deployed`, async () => {
      testStartTime = await time.latest();
      setTestStartTime(testStartTime);

      instance = await deployProxy(MechaLandsV1, [], {
        initializer: "initialize",
      });
      assert(instance.address !== "");

      const version = await instance.version();
      assert.equal(version.toString(), "1", "Bad version");
      chainid = await instance.chainid();
      chainid = chainid.toString();
    });

    it(`Owner create planet 1`, async () => {
      await setupPlanet(instance, planets[1], owner);
    });

    it(`Owner create round 1 and 2`, async () => {
      await setupMintRound(instance, rounds[1], owner);
      await setupMintRound(instance, rounds[2], owner);
    });

    it(`Users mint in round 1`, async () => {
      const roundId = 1;
      for (let landType = 1; landType <= 4; landType++) {
        let remainingTokens = await getRemainingTokens(
          instance,
          roundId,
          landType
        );
        let stopMessage;

        const progressBar = new cliProgress.SingleBar(
          {
            format:
              "\tMint in round 1 (lands " +
              landType +
              "): [{bar}] {percentage}% | {value}/{total} tokens | ETA: {eta}s | Duration: {duration_formatted}",
          },
          cliProgress.Presets.shades_classic
        );
        progressBar.start(remainingTokens, 0);

        // Foreach users
        for (let i = 0; i < accounts.length; i++) {
          const user = accounts[i];
          remainingTokens = await getRemainingTokens(
            instance,
            roundId,
            landType
          );

          let amount = MINT_AMOUNTS_ARRAY[i % MINT_AMOUNTS_ARRAY.length];
          if (remainingTokens == 0) {
            stopMessage = `\t${
              i + 1
            } users minted before sold out of land ${landType}`;
            break;
          } else if (amount > remainingTokens) {
            amount = remainingTokens;
          }

          await mint(
            instance,
            {
              roundId,
              landType,
              amount,
              maxMint: 100,
            },
            user
          );

          // Progress
          progressBar.increment(amount);
        }

        progressBar.stop();

        if (stopMessage) {
          console.log(stopMessage);
        }
      }
    });

    it(`Users mint all remaining tokens in round 2`, async () => {
      const roundId = 2;

      for (let landType = 1; landType <= 4; landType++) {
        let remainingTokens = await getRemainingTokens(
          instance,
          roundId,
          landType
        );
        let loop = 0;
        let stopMessage;
        const progressBar = new cliProgress.SingleBar(
          {
            format:
              "\tMint in round 2 (lands " +
              landType +
              "): [{bar}] {percentage}% | {value}/{total} tokens | ETA: {eta}s | Duration: {duration_formatted}",
          },
          cliProgress.Presets.shades_classic
        );
        progressBar.start(remainingTokens, 0);

        // Foreach users
        while (remainingTokens > 0) {
          for (let i = 0; i < accounts.length; i++) {
            const user = accounts[i];
            remainingTokens = await getRemainingTokens(
              instance,
              roundId,
              landType
            );

            let amount = MINT_AMOUNTS_ARRAY[i % MINT_AMOUNTS_ARRAY.length];
            if (remainingTokens == 0) {
              if (!loop)
                stopMessage = `\t${
                  i + 1
                } users minted before sold out of land ${landType}`;
              break;
            } else if (amount > remainingTokens) {
              amount = remainingTokens;
            }

            await mint(
              instance,
              {
                roundId,
                landType,
                amount,
              },
              user
            );

            // Progress
            progressBar.increment(amount);
          }
          loop++;
        }

        progressBar.stop();

        if (stopMessage) {
          console.log(stopMessage);
        }
      }
    });
  });

  describe("\n UPGRADE CONTRACT", () => {
    it(`Upgrade Smart Contract to MechaLandsV2`, async () => {
      instance = await upgradeProxy(instance.address, MechaLandsV2);
      mechanium = await Mechanium.deployed();
    });

    it(`Smart Contract is now at version v2`, async () => {
      assert.equal((await instance.version()).toString(), "2", `Bad version`);
    });
  });

  describe("\n SET MECHANIUM AND MINT ROUND", () => {
    it(`Owner create planet 2`, async () => {
      await setupPlanet(instance, planets[2], owner);
    });

    it(`User can't create a mechanium mint round (Reason: caller is not the owner)`, async () => {
      await expectRevert(
        setupMintRound(instance, rounds[3], users[0]),
        `Ownable: caller is not the owner`
      );
    });

    it(`Owner can't create a mechanium mint round (Reason: Mechanium token not set)`, async () => {
      await expectRevert(
        setupMintRound(instance, rounds[3], owner),
        `Mechanium token not set`
      );
    });

    it(`User can't change round payment type (Reason: caller is not the owner)`, async () => {
      await expectRevert(
        instance.setRoundPaymentType(1, 0, { from: users[1] }),
        `Ownable: caller is not the owner`
      );
    });

    it(`Owner can't create a mechanium mint round (Reason: Mechanium token not set)`, async () => {
      await expectRevert(
        instance.setRoundPaymentType(1, 1),
        `Mechanium token not set`
      );
    });

    it(`User can't change mechanium token address (Reason: caller is not the owner)`, async () => {
      await expectRevert(
        instance.setMechaniumToken(mechanium.address, { from: users[1] }),
        `Ownable: caller is not the owner`
      );
    });

    it(`Owner can change mechanium token address`, async () => {
      const oldMechaniumToken = await instance.mechaniumToken();

      const tx = await instance.setMechaniumToken(mechanium.address, {
        from: owner,
      });
      await gasTracker.addCost(`Set Mechanium Token`, tx);

      const newMechaniumToken = await instance.mechaniumToken();

      assert.equal(
        oldMechaniumToken.toString(),
        ZERO_ADDRESS,
        "Mechanium token is not null"
      );
      assert.equal(
        newMechaniumToken.toString(),
        mechanium.address,
        "Bad mechanium token"
      );
    });

    it(`Owner create round 3 with mechanium payment and validator`, async () => {
      await setupMintRound(instance, rounds[3], owner);
    });

    it(`Owner create public round 4 with mechanium payment`, async () => {
      await setupMintRound(instance, rounds[4], owner);
    });
  });

  describe("\n STORAGE", () => {
    it(`Data of minted tokens has not changed`, async () => {
      const totalSupply = await instance.totalSupply();
      const tokens = getContractStorage().tokens;

      // Supply test
      assert.equal(
        totalSupply.toNumber(),
        Object.keys(tokens).length,
        `Bad supply`
      );

      // Each data test
      const progressBar = new cliProgress.SingleBar(
        {
          format:
            "\tCheck tokens storage: [{bar}] {percentage}% | {value}/{total} tokens | ETA: {eta}s | Duration: {duration_formatted}",
        },
        cliProgress.Presets.shades_classic
      );
      progressBar.start(totalSupply.toNumber(), 0);
      for (var tokenId in tokens) {
        const token = tokens[tokenId];
        const tokenType = await instance.tokenType(tokenId);
        assert.equal(
          tokenType.toString(),
          token.type.toString(),
          "landType not valid"
        );

        const tokenPlanet = await instance.tokenPlanet(tokenId);
        assert.equal(
          tokenPlanet.toString(),
          token.planetId.toString(),
          "planetId not valid"
        );

        const tokenOwner = await instance.ownerOf(tokenId);
        assert.equal(
          tokenOwner.toString(),
          token.owner.toString(),
          "User is not owner of the new token"
        );
        // Progress
        progressBar.increment();
      }

      progressBar.stop();
    });
  });

  describe("\n GAS STATS", () => {
    it(`Get stats on gas`, async () => {
      // Get deployment cost
      const newInstanceV1 = await MechaLandsV1.new();
      await gasTracker.addCost("Deployment v1", {
        tx: newInstanceV1.transactionHash,
      });
      const newInstanceV2 = await MechaLandsV2.new();
      await gasTracker.addCost("Deployment v2", {
        tx: newInstanceV2.transactionHash,
      });

      gasTracker.consoleStats();
    });
  });
});
