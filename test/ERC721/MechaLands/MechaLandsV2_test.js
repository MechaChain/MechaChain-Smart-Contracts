// Load modules
const { time, expectRevert, snapshot } = require("@openzeppelin/test-helpers");
const { ZERO_ADDRESS } = require("@openzeppelin/test-helpers/src/constants");
const { upgradeProxy, deployProxy } = require("@openzeppelin/truffle-upgrades");
const cliProgress = require("cli-progress");
const {
  getAmount,
  gasTracker,
  getBN,
  truncateWallet,
} = require("../../../utils");
const MechaLandsV3 = artifacts.require("MechaLandsV3");

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
  setVersion,
} = require("./MechaLands_functions");

contract("MechaLandsV2", async (accounts) => {
  const [owner, user1, ...users] = accounts;

  let instance, testStartTime, chainid, mechanium;

  const planets = [
    {}, // 0 not possible
    {
      planetId: 1,
      typesNumber: 4,
      supplyPerType: [50, 50, 40, 10],
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
      supplyPerType: [50, 50, 40, 10],
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
      supplyPerType: [25, 25, 20, 5],
      limitedPerType: true,
      maxMintPerType: [10, 10, 10, 10],
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
      maxMintPerType: [200, 200, 200, 200],
    },
    {
      roundId: 3,
      planetId: 2,
      startTime: time.duration.days(1), // to add to `testStartTime`
      duration: time.duration.days(1),
      validator: "0x6F76846f7C90EcEC371e1d96cA93bfE9d36eEb83",
      validator_private_key:
        "0xfeae30926cea7dfa8fb803c348aef7f06941b9af7770e6b62c0dcb543d3391a7",
      pricePerType: [
        getAmount(10),
        getAmount(20),
        getAmount(30),
        getAmount(40),
      ],
      isMechaniumPaymentType: true,
      supplyPerType: [25, 25, 20, 5],
      limitedPerType: true,
      maxMintPerType: [10, 10, 10, 10],
    },
    {
      roundId: 4,
      planetId: 2,
      startTime: 0, // to add to `testStartTime`
      duration: 0,
      // no validator
      pricePerType: [getAmount(1), getAmount(10), getAmount(20), getAmount(30)],
      isMechaniumPaymentType: true,
      supplyPerType: [999, 999, 999, 999], // incoherent supply for use planet supply
      limitedPerType: true,
      maxMintPerType: [200, 200, 200, 200],
    },
  ];

  const MINT_AMOUNTS_ARRAY = [1, 2, 3, 4, 5, 10];

  const defaultRoyalties = {
    receiver: "0x3ccc90302a4c9d21ac18d9a6b6666b59ae459416",
    feeNumerator: 500,
  };

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
      setVersion(1);
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

  /**
   * UPGRADE TO V2
   */
  describe("\n UPGRADE CONTRACT", () => {
    it(`Upgrade Smart Contract to MechaLandsV2`, async () => {
      instance = await upgradeProxy(instance.address, MechaLandsV2, {
        call: "initializeV2",
      });
      mechanium = await Mechanium.deployed();

      // reset gas cost
      gasTracker.resetCost();
    });

    it(`Smart Contract is now at version v2`, async () => {
      assert.equal((await instance.version()).toString(), "2", `Bad version`);
      setVersion(2);
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

  /**
   * ROUND 3 MINT
   */
  describe("\n ROUND 3 MINT", () => {
    it(`Round 3 started`, async () => {
      await time.increaseTo(testStartTime.add(rounds[3].startTime));
      const round = await instance.rounds(3);
      const latestTime = await time.latest();
      assert.equal(
        latestTime.gte(round.startTime),
        true,
        "Start time not correct"
      );
    });

    it(`User can't mint with eth (Reason: insufficient allowance)`, async () => {
      await expectRevert(
        mint(
          instance,
          {
            roundId: 3,
            landType: 1,
            amount: 1,
            maxMint: 10,
          },
          users[1]
        ),
        `ERC20: insufficient allowance`
      );
    });

    it(`User can't mint if he did not approve tokens first`, async () => {
      await mechanium.transfer(users[1], rounds[3].pricePerType[0]);
      await expectRevert(
        mint(
          instance,
          {
            roundId: 3,
            landType: 1,
            amount: 1,
            maxMint: 10,
          },
          users[1]
        ),
        `ERC20: insufficient allowance`
      );
    });

    it(`User can't mint if he did not approve all tokens first`, async () => {
      await mechanium.approve(
        instance.address,
        rounds[3].pricePerType[0].div(getBN(2)),
        { from: users[1] }
      );

      await expectRevert(
        mint(
          instance,
          {
            roundId: 3,
            landType: 1,
            amount: 1,
            maxMint: 10,
          },
          users[1]
        ),
        `ERC20: insufficient allowance`
      );
    });

    it(`User can mint with mechanium tokens`, async () => {
      const user = users[1];
      const price = rounds[3].pricePerType[0];

      const oldUserTokenBalance = await mechanium.balanceOf(user);
      const oldContractTokenBalance = await mechanium.balanceOf(
        instance.address
      );

      await mint(
        instance,
        {
          roundId: 3,
          landType: 1,
          amount: 1,
          maxMint: 10,
          token: mechanium,
        },
        user
      );

      const newUserTokenBalance = await mechanium.balanceOf(user);
      const newContractTokenBalance = await mechanium.balanceOf(
        instance.address
      );

      assert.equal(
        newContractTokenBalance.toString(),
        oldContractTokenBalance.add(price).toString(),
        "Incorrect pool token balance"
      );

      assert.equal(
        newUserTokenBalance.toString(),
        oldUserTokenBalance.sub(price).toString(),
        "Incorrect user token balance"
      );
    });

    it(`All users mint in round 3`, async () => {
      const roundId = 3;
      for (let landType = 1; landType <= 4; landType++) {
        const price = rounds[roundId].pricePerType[landType - 1];
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
        for (let i = 0; i < users.length; i++) {
          const user = users[i];
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

          await mechanium.transfer(user, price.mul(getBN(amount)));

          await mint(
            instance,
            {
              roundId,
              landType,
              amount,
              maxMint: 100,
              token: mechanium,
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
  });

  /**
   * ROUND 4 MINT
   */
  describe("\n ROUND 4 MINT", () => {
    it(`User can mint with mechanium tokens`, async () => {
      const user = users[1];
      const price = rounds[4].pricePerType[0];

      await mechanium.transfer(user, price);

      const oldUserTokenBalance = await mechanium.balanceOf(user);
      const oldContractTokenBalance = await mechanium.balanceOf(
        instance.address
      );

      await mint(
        instance,
        {
          roundId: 4,
          landType: 1,
          amount: 1,
          maxMint: 10,
          token: mechanium,
        },
        user
      );

      const newUserTokenBalance = await mechanium.balanceOf(user);
      const newContractTokenBalance = await mechanium.balanceOf(
        instance.address
      );

      assert.equal(
        newContractTokenBalance.toString(),
        oldContractTokenBalance.add(price).toString(),
        "Incorrect pool token balance"
      );

      assert.equal(
        newUserTokenBalance.toString(),
        oldUserTokenBalance.sub(price).toString(),
        "Incorrect user token balance"
      );
    });

    it(`Owner can change round payment type to eth`, async () => {
      await instance.setRoundPaymentType(4, 0);

      const paymentType = await instance.roundPaymentType(4);
      assert.equal(paymentType.toNumber(), 0, "Round payment type not correct");
    });

    it(`User can now mint with eth`, async () => {
      const user = users[1];
      const price = rounds[4].pricePerType[0];

      const oldContractBalance = await web3.eth.getBalance(instance.address);

      await mint(
        instance,
        {
          roundId: 4,
          landType: 1,
          amount: 1,
          maxMint: 10,
        },
        user
      );

      const newContractBalance = await web3.eth.getBalance(instance.address);

      assert.equal(
        newContractBalance.toString(),
        getBN(oldContractBalance).add(price).toString(),
        "Incorrect contract balance"
      );
    });

    it(`Owner can re change round payment type to mecha`, async () => {
      await instance.setRoundPaymentType(4, 1);

      const paymentType = await instance.roundPaymentType(4);
      assert.equal(paymentType.toNumber(), 1, "Round payment type not correct");
    });

    it(`All users mint in round 4`, async () => {
      const roundId = 4;
      for (let landType = 1; landType <= 4; landType++) {
        const price = rounds[roundId].pricePerType[landType - 1];
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
        for (let i = 0; i < users.length; i++) {
          const user = users[i];
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

          await mechanium.transfer(user, price.mul(getBN(amount)));

          await mint(
            instance,
            {
              roundId,
              landType,
              amount,
              token: mechanium,
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

    it(`Planet 2 is now sold out, users can't mint anymore (Reason: Planet supply exceeded)`, async () => {
      const user = users[users.length - 1]; // last user (should not have exceeded his limit)
      for (let landType = 1; landType <= planets[2].typesNumber; landType++) {
        await mechanium.transfer(user, rounds[4].pricePerType[landType - 1]);

        await expectRevert(
          mint(
            instance,
            { roundId: 4, landType, amount: 1, token: mechanium },
            user
          ),
          `Planet supply exceeded`
        );
      }
    });
  });

  /**
   * ROYALTIES
   */
  describe("\n ROYALTIES", () => {
    const testRoyalties = async (receiver, feeNumerator) => {
      const salePrice = getAmount(1);
      const expectedRoyaltyAmount = salePrice
        .mul(getBN(feeNumerator))
        .div(getBN(10000));

      const royaltyInfo = await instance.royaltyInfo(1, salePrice);

      // Correct receiver
      assert.equal(
        royaltyInfo["0"].toLowerCase(),
        receiver.toLowerCase(),
        "Incorrect receiver"
      );

      // Correct RoyaltyAmount
      assert.equal(
        royaltyInfo["1"].toString(),
        expectedRoyaltyAmount.toString(),
        "Incorrect RoyaltyAmount"
      );
    };

    it(`Default royaltyInfo is correct: receiver = ${truncateWallet(
      defaultRoyalties.receiver
    )} // earnings = ${defaultRoyalties.feeNumerator / 100}%`, async () => {
      await testRoyalties(
        defaultRoyalties.receiver,
        defaultRoyalties.feeNumerator
      );
    });

    it(`Users can't change royalties (Reason: caller is not owner)`, async () => {
      await expectRevert(
        instance.setDefaultRoyalty(user1, 1000, {
          from: user1,
        }),
        `Ownable: caller is not the owner`
      );
    });

    it(`Owner can change royalties with a new address and new fees`, async () => {
      await instance.setDefaultRoyalty(user1, 1000, {
        from: owner,
      });
    });

    it(`New royaltyInfo is correct`, async () => {
      await testRoyalties(user1, 1000);
    });
  });

  /**
   * STORAGE VERIFICATION
   */
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

    it(`Data of planets has not changed`, async () => {
      const planetsLength = await instance.planetsLength();
      const planets = getContractStorage().planets;

      // planetsLength test
      assert.equal(
        planetsLength.toNumber(),
        Object.keys(planets).length,
        `Bad planets lengths`
      );

      // Each data test
      for (var planetId in planets) {
        const planet = planets[planetId];
        const contractPlanet = await instance.planets(planetId);

        assert.equal(
          contractPlanet.typesNumber.toString(),
          planet.typesNumber.toString(),
          "typesNumber not valid"
        );

        assert.equal(
          contractPlanet.baseURI.toString(),
          planet.baseURI.toString(),
          "baseURI not valid"
        );

        assert.equal(
          contractPlanet.baseExtension.toString(),
          planet.baseExtension.toString(),
          "baseExtension not valid"
        );

        assert.equal(
          contractPlanet.distributor.toString(),
          planet.distributor.toString(),
          "distributor not valid"
        );

        for (let landType = 1; landType <= planet.typesNumber; landType++) {
          const planetSupplyByType = await instance.planetSupplyByType(
            planetId,
            landType
          );
          assert.equal(
            planetSupplyByType.toString(),
            planet.supplyPerType[landType - 1].toString(),
            "supply not valid"
          );

          const notRevealUriPerType = await instance.planetNotRevealUriByType(
            planetId,
            landType
          );
          assert.equal(
            notRevealUriPerType.toString(),
            planet.notRevealUriPerType[landType - 1].toString(),
            "URI not valid"
          );

          const planetTotalMintedByType =
            await instance.planetTotalMintedByType(planetId, landType);
          assert.equal(
            planetTotalMintedByType.toString(),
            planet.supplyPerType[landType - 1].toString(),
            "total minted not valid"
          );
        }
      }
    });

    it(`Data of rounds has not changed`, async () => {
      const roundsLength = await instance.roundsLength();
      const rounds = getContractStorage().rounds;

      // planetsLength test
      assert.equal(
        roundsLength.toNumber(),
        Object.keys(rounds).length,
        `Bad rounds lengths`
      );

      // Each data test
      for (var roundId in rounds) {
        const round = rounds[roundId];
        const contractRounds = await instance.rounds(roundId);

        assert.equal(
          contractRounds.limitedPerType.toString(),
          round.limitedPerType.toString(),
          "limitedPerType not valid"
        );

        assert.equal(
          contractRounds.planetId.toString(),
          round.planetId.toString(),
          "planetId not valid"
        );

        assert.equal(
          contractRounds.startTime.toString(),
          round.startTime.toString(),
          "startTime not valid"
        );

        assert.equal(
          contractRounds.duration.toString(),
          round.duration.toString(),
          "duration not valid"
        );

        assert.equal(
          contractRounds.validator.toString(),
          round.validator.toString(),
          "validator not valid"
        );

        for (let landType = 1; landType <= round.typesNumber; landType++) {
          const roundSupplyByType = await instance.roundSupplyByType(
            roundId,
            landType
          );
          assert.equal(
            roundSupplyByType.toString(),
            planet.supplyPerType[landType - 1].toString(),
            "supply not valid"
          );

          const roundPriceByType = await instance.roundPriceByType(
            roundId,
            landType
          );
          assert.equal(
            roundPriceByType.toString(),
            planet.pricePerType[landType - 1].toString(),
            "priceByType not valid"
          );

          const roundMaxMintByType = await instance.roundMaxMintByType(
            roundId,
            landType
          );
          assert.equal(
            roundMaxMintByType.toString(),
            planet.maxMintPerType[landType - 1].toString(),
            "maxMintByType not valid"
          );

          const roundTotalMintedByType = await instance.roundTotalMintedByType(
            roundId,
            landType
          );
          assert.equal(
            roundTotalMintedByType.toString(),
            round.totalMintedPerType[landType].toString(),
            "total minted not valid"
          );
        }
      }
    });

    it(`Contract has the correct eth amount according to the mints (v1 and v2)`, async () => {
      const balance = await web3.eth.getBalance(instance.address);
      assert.equal(
        balance.toString(),
        getContractStorage().balance.toString(),
        "Incorrect ETH balance"
      );
    });
  });

  /**
   * WITHDRAW
   */
  describe("\n WITHDRAW", () => {
    it(`Contract has the correct $MECHA amount according to the mints`, async () => {
      const balance = await mechanium.balanceOf(instance.address);
      assert.equal(
        balance.toString(),
        getContractStorage().mechaniumBalance.toString(),
        "Incorrect $MECHA balance"
      );
    });

    it(`Users can't withdraw contract $MECHA (Reason: caller is not the owner)`, async () => {
      await expectRevert(
        instance.withdrawMechaniumToken(
          users[0],
          getContractStorage().mechaniumBalance,
          {
            from: users[0],
          }
        ),
        `Ownable: caller is not the owner`
      );
    });

    it(`Owner can withdraw all $MECHA to himself`, async () => {
      const oldUserBalance = await mechanium.balanceOf(owner);

      const tx = await instance.withdrawMechaniumToken(
        owner,
        getContractStorage().mechaniumBalance,
        {
          from: owner,
        }
      );
      const cost = await gasTracker.addCost(`Withdraw $MECHA`, tx);

      // Verify balance
      const balance = await mechanium.balanceOf(instance.address);

      const newUserBalance = await mechanium.balanceOf(owner);
      assert.equal(balance.toString(), "0", "Incorrect contract balance");
      assert.equal(
        newUserBalance.toString(),
        oldUserBalance.add(getContractStorage().mechaniumBalance).toString(),
        "Incorrect user balance"
      );

      getContractStorage().mechaniumBalance = balance;
    });

    it(`Owner can withdraw all eth to himself`, async () => {
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

      let instance2 = await upgradeProxy(instance.address, MechaLandsV3);

      const newUserBalance = getBN(await instance2.balanceOf(users[1]));

      let value = await instance2.tellMeWhatIWant();

      assert.equal(
        value.toString(),
        "926391",
        `The new function does not return the value we wanted`
      );
      assert.equal(
        newUserBalance.toString(),
        oldUserBalance.toString(),
        "Incorrect balance after upgrading contract"
      );
      assert.equal((await instance2.version()).toString(), "3", `Bad version`);
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
