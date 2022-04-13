// Load modules
const { time, expectRevert, snapshot } = require("@openzeppelin/test-helpers");
const cliProgress = require("cli-progress");

// Load artifacts
const MechaLandsV1 = artifacts.require("MechaLandsV1");

const MechaLandsUpgradeTest = artifacts.require("MechaLandsUpgradeTest");

// Load utils
const {
  getAmount,
  getBN,
  getBNRange,
  gasTracker,
  getSignature,
} = require("../utils");
const { upgradeProxy, deployProxy } = require("@openzeppelin/truffle-upgrades");

contract("MechaLandsV1", async (accounts) => {
  const [owner, distributor, ...users] = accounts;

  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  let instance, testStartTime, chainid;
  let contractBalance = getAmount(0);
  let roundCounter = 0;

  const defaultSupplyPerPlanet = [500, 250, 125, 99];

  const validator = "0x6F76846f7C90EcEC371e1d96cA93bfE9d36eEb83";
  const validator_private_key =
    "0xfeae30926cea7dfa8fb803c348aef7f06941b9af7770e6b62c0dcb543d3391a7";

  const defaultWhitelistRound = {
    startTime: 1,
    duration: 0,
    validator: validator,
    pricePerType: [
      getAmount(0),
      getAmount(0.01),
      getAmount(0.02),
      getAmount(0.03),
    ],
    supplyPerType: [250, 125, 75, 50],
    limitedPerType: true,
    maxMintPerType: [10, 10, 10, 10],
  };

  const defaultRound = {
    startTime: 1,
    duration: 0,
    validator: ZERO_ADDRESS,
    pricePerType: [
      getAmount(0.01),
      getAmount(0.02),
      getAmount(0.05),
      getAmount(0.08),
    ],
    supplyPerType: [999999, 999999, 999999, 999999],
    limitedPerType: false,
    maxMintPerType: [999999, 999999, 999999, 999999],
  };

  const MINT_AMOUNTS_ARRAY = [1, 2, 3, 4, 5, 10];
  const PLANETS_NUMBER = 5;

  /**
   * ========================
   *        FUNCTIONS
   * ========================
   */

  const setupPlanet = async (planetId) => {
    const tx = await instance.setupPlanet(
      planetId,
      4,
      defaultSupplyPerPlanet,
      [
        `http://planet-${planetId}/land-1.json`,
        `http://planet-${planetId}/land-2.json`,
        `http://planet-${planetId}/land-3.json`,
        `http://planet-${planetId}/land-4.json`,
      ],
      { from: owner }
    );
    await gasTracker.addCost("Setup Planet", tx);
  };

  const setupMintRound = async (roundId, planetId, isWhitelist) => {
    const data = isWhitelist ? defaultWhitelistRound : defaultRound;
    const tx = await instance.setupMintRound(
      roundId,
      planetId,
      data.startTime,
      data.duration,
      data.validator,
      data.limitedPerType || false,
      data.pricePerType,
      data.supplyPerType,
      data.maxMintPerType,
      { from: owner }
    );
    await gasTracker.addCost("Setup Mint Round", tx);
  };

  const getRemainingTokens = async (roundId, landType) => {
    const round = await instance.rounds(roundId);
    const planetSupply = await instance.planetSupplyByType(
      round.planetId,
      landType
    );
    const planetTotalMinted = await instance.planetTotalMintedByType(
      round.planetId,
      landType
    );
    const remainingInPlanet =
      planetSupply.toNumber() - planetTotalMinted.toNumber();

    const roundSupply = await instance.roundSupplyByType(roundId, landType);
    const roundTotalMinted = await instance.roundTotalMintedByType(
      roundId,
      landType
    );
    const remainingInRound =
      roundSupply.toNumber() - roundTotalMinted.toNumber();

    return remainingInRound > remainingInPlanet
      ? remainingInPlanet
      : remainingInRound;
  };

  const getTokensFromTransferEvent = (txData) => {
    let tokens = [];
    txData.logs.map((log) => {
      if (log.event === "Transfer") {
        const { to, from, tokenId } = log.args;
        tokens.push(tokenId.toNumber());
      }
    });
    return tokens;
  };

  const mint = async (
    { roundId, landType, amount },
    user,
    overrideData = {}
  ) => {
    const round = await instance.rounds(roundId);
    const unitPrice = await instance.roundPriceByType(roundId, landType);
    const price = overrideData?.price || unitPrice.mul(getBN(amount));
    let tx;
    if (round.validator === ZERO_ADDRESS) {
      // mint without validator
      tx = await instance.mint(roundId, landType, amount, {
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
          999999,
          landType,
          roundId,
          instance.address,
          chainid,
        ]
      );
      tx = await instance.mintWithValidation(
        roundId,
        landType,
        amount,
        999999,
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
  };

  /**
   * ========================
   *          TESTS
   * ========================
   */

  it(`MechaLandsV1 should be deployed`, async () => {
    testStartTime = await time.latest();

    instance = await deployProxy(MechaLandsV1, [], {
      initializer: "initialize",
    });
    assert(instance.address !== "");

    const version = await instance.version();
    assert.equal(version.toString(), "1", "Bad version");
    chainid = await instance.chainid();
    chainid = chainid.toString();
  });

  for (let planetId = 1; planetId <= PLANETS_NUMBER; planetId++) {
    describe(`\n PLANET ${planetId}`, () => {
      let whitelistRound, publicRound;

      it(`Setup planet ${planetId}`, async () => {
        await setupPlanet(planetId);
      });

      it(`Setup whitelist round for planet ${planetId}`, async () => {
        whitelistRound = ++roundCounter;
        await setupMintRound(whitelistRound, planetId, true);
      });

      it(`Setup public round for planet ${planetId}`, async () => {
        publicRound = ++roundCounter;
        await setupMintRound(publicRound, planetId, false);
      });

      it(`${accounts.length} users mint in whitelist`, async () => {
        const roundId = whitelistRound;
        for (let landType = 1; landType <= 4; landType++) {
          let remainingTokens = await getRemainingTokens(roundId, landType);
          let stopMessage;

          const progressBar = new cliProgress.SingleBar(
            {
              format:
                "\tMint in whitelist (lands " +
                landType +
                "): [{bar}] {percentage}% | {value}/{total} tokens | ETA: {eta}s | Duration: {duration_formatted}",
            },
            cliProgress.Presets.shades_classic
          );
          progressBar.start(remainingTokens, 0);

          // Foreach users
          for (let i = 0; i < accounts.length; i++) {
            const user = accounts[i];
            remainingTokens = await getRemainingTokens(roundId, landType);

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

          progressBar.stop();

          if (stopMessage) {
            console.log(stopMessage);
          }
        }
      });

      it(`${accounts.length} users mint all remaining tokens in public`, async () => {
        const roundId = publicRound;

        for (let landType = 1; landType <= 4; landType++) {
          let remainingTokens = await getRemainingTokens(roundId, landType);
          let loop = 0;
          let stopMessage;
          const progressBar = new cliProgress.SingleBar(
            {
              format:
                "\tMint in public (lands " +
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
              remainingTokens = await getRemainingTokens(roundId, landType);

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

      it(`Planet ${planetId} is now sold out, users can't mint anymore (Reason: Planet supply exceeded)`, async () => {
        const user = users[users.length - 1]; // last user (should not have exceeded his limit)
        for (let landType = 1; landType <= 4; landType++) {
          await expectRevert(
            mint({ roundId: publicRound, landType, amount: 1 }, user),
            `Planet supply exceeded`
          );
        }
      });
    });
  }

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

  describe("\n GAS STATS", () => {
    it(`Get stats on gas`, async () => {
      // Get deployment cost
      const newInstance = await MechaLandsV1.new();
      await gasTracker.addCost("Deployment", {
        tx: newInstance.transactionHash,
      });

      gasTracker.consoleStats();
    });
  });
});
