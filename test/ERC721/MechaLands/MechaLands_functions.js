// Load modules
const { time, expectRevert } = require("@openzeppelin/test-helpers");

// Load utils
const {
  getBN,
  gasTracker,
  getSignature,
  objectFilter,
} = require("../../../utils");

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

let testStartTime;

/**
 * Various data that should be kept by the contract.
 * Updated with the following functions.
 */
const contractStorage = {
  planets: {},
  rounds: {},
  tokens: {},
  tokenOfOwner: {},
  burnedTokens: [],
  balance: getBN(0),
};

const setTestStartTime = (startTime) => {
  testStartTime = startTime;
};

/**
 * Setup a planet
 * Test data, add cost to `gasTracker` and update `contractStorage`
 */
const setupPlanet = async (
  instance,
  {
    planetId,
    typesNumber,
    supplyPerType,
    notRevealUriPerType,
    revealed,
    baseURI,
    baseExtension,
    burnable,
  },
  from
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

  // Tests
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
  assert.equal(planet.baseExtension, baseExtension || "", "Bad baseExtension");

  // Update expected storage
  contractStorage.planets[planetId] = {
    ...contractStorage.planets[planetId],
    ...planet,
    supplyPerType,
    notRevealUriPerType,
  };
};

/**
 * Setup a round
 * Test data, add cost to `gasTracker` and update `contractStorage`
 */
const setupMintRound = async (
  instance,
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
    validator_private_key,
  },
  from
) => {
  validator = validator || ZERO_ADDRESS;

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

  // Tests
  assert.equal(round.planetId.toString(), planetId.toString(), "Bad planetId");
  assert.equal(
    round.startTime.toString(),
    testStartTime.add(startTime).toString(),
    "Bad startTime"
  );
  assert.equal(round.duration.toString(), duration.toString(), "Bad duration");
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
      (await instance.roundPriceByType(roundId, i + 1)).toString(),
      pricePerType[i].toString(),
      "Bad pricePerType"
    );
    assert.equal(
      (await instance.roundMaxMintByType(roundId, i + 1)).toString(),
      maxMintPerType[i].toString(),
      "Bad maxMintPerType"
    );
  }

  // Update expected storage
  contractStorage.rounds[roundId] = {
    ...contractStorage.rounds[roundId],
    ...round,
    validator_private_key,
    pricePerType,
    supplyPerType,
    maxMintPerType,
  };
};

/**
 * Return the array of transferred tokens from transaction data
 */
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

/**
 * Mint tokens according to round data (or `overrideData`)
 * Test data, add cost to `gasTracker` and update `contractStorage`
 */
const mint = async (
  instance,
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
    roundId,
    landType
  );
  const oldUserRoundTotalMinted = await instance.roundTotalMintedByTypeForUser(
    user,
    roundId,
    landType
  );
  const oldTotalSupply = await instance.totalSupply();

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
    let chainid = await instance.chainid();
    chainid = chainid.toString();
    const payloadExpiration =
      overrideData?.payloadExpiration ||
      latestTime.add(time.duration.minutes(30));

    const signature = getSignature(
      overrideData?.validator_private_key ||
        contractStorage.rounds[roundId].validator_private_key,
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
    tx = await instance.mintWithValidation(
      roundId,
      landType,
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

  // Balances tests
  const newBalance = await instance.balanceOf(user);
  const newPlanetTotalMinted = await instance.planetTotalMintedByType(
    round.planetId,
    landType
  );
  const newRoundTotalMinted = await instance.roundTotalMintedByType(
    roundId,
    landType
  );
  const newUserRoundTotalMinted = await instance.roundTotalMintedByTypeForUser(
    user,
    roundId,
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

  // Token test
  const mintedTokens = getTokensFromTransferEvent(tx);
  for (tokenId of mintedTokens) {
    const tokenType = await instance.tokenType(tokenId);
    assert.equal(
      tokenType.toString(),
      landType.toString(),
      "landType not valid"
    );

    const tokenPlanet = await instance.tokenPlanet(tokenId);
    assert.equal(
      tokenPlanet.toString(),
      round.planetId.toString(),
      "planetId not valid"
    );

    const tokenOwner = await instance.ownerOf(tokenId);
    assert.equal(
      tokenOwner.toString(),
      user.toString(),
      "User is not owner of the new token"
    );
  }

  // Increase contractBalance
  contractStorage.balance = contractStorage.balance.add(price);

  // Update expected storage
  contractStorage.tokenOfOwner[user] = [
    ...(contractStorage.tokenOfOwner[user] || []),
    ...mintedTokens,
  ];
  contractStorage.tokens = {
    ...contractStorage.tokens,
    ...mintedTokens.reduce(
      (acc, element) => ({
        ...acc,
        [element]: {
          owner: user,
          type: landType,
          planetId: round.planetId.toNumber(),
        },
      }),
      {}
    ),
  };
};

/**
 * Airdrop tokens for an user
 * Test data, add cost to `gasTracker` and update `contractStorage`
 */
const airdrop = async (
  instance,
  { planetId, landType, amount },
  user,
  { from } = {}
) => {
  const oldBalance = await instance.balanceOf(user);
  const oldPlanetTotalMinted = await instance.planetTotalMintedByType(
    planetId,
    landType
  );
  const oldTotalSupply = await instance.totalSupply();

  const tx = await instance.airdrop(user, planetId, landType, amount, {
    from: from,
  });
  await gasTracker.addCost(`Airdrop x${amount}`, tx);

  // Balances tests
  const newBalance = await instance.balanceOf(user);
  const newPlanetTotalMinted = await instance.planetTotalMintedByType(
    planetId,
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
    newTotalSupply.toString(),
    oldTotalSupply.add(getBN(amount)).toString(),
    "Total supply not valid"
  );

  // Token test
  const mintedTokens = getTokensFromTransferEvent(tx);
  for (tokenId of mintedTokens) {
    const tokenType = await instance.tokenType(tokenId);
    assert.equal(
      tokenType.toString(),
      landType.toString(),
      "landType not valid"
    );

    const tokenPlanet = await instance.tokenPlanet(tokenId);
    assert.equal(
      tokenPlanet.toString(),
      planetId.toString(),
      "planetId not valid"
    );

    const tokenOwner = await instance.ownerOf(tokenId);
    assert.equal(
      tokenOwner.toString(),
      user.toString(),
      "User is not owner of the new token"
    );
  }

  // Update expected storage
  contractStorage.tokenOfOwner[user] = [
    ...contractStorage.tokenOfOwner[user],
    ...mintedTokens,
  ];
  contractStorage.tokens = {
    ...contractStorage.tokens,
    ...mintedTokens.reduce(
      (acc, element) => ({
        ...acc,
        [element]: {
          owner: user,
          type: landType,
          planetId: planetId,
        },
      }),
      {}
    ),
  };
};

/**
 * Burn token for an user
 * Test data, add cost to `gasTracker` and update `contractStorage`
 */
const burn = async (instance, tokenId, user) => {
  const oldSupply = await instance.totalSupply();

  const tx = await instance.burn(tokenId, {
    from: user,
  });
  await gasTracker.addCost(`Burn x1`, tx);
  const newSupply = await instance.totalSupply();

  // Token not exist anymore
  await expectRevert(
    instance.ownerOf(tokenId),
    "ERC721: owner query for nonexistent token"
  );

  // Supply
  assert.equal(
    newSupply.toNumber(),
    oldSupply.toNumber() - 1,
    "Incorrect supply"
  );

  // Update expected storage
  contractStorage.tokenOfOwner[user] = contractStorage.tokenOfOwner[
    user
  ].filter((key) => key !== tokenId);

  contractStorage.tokens = objectFilter(
    contractStorage.tokens,
    (key, value) => key != tokenId
  );

  contractStorage.burnedTokens = [...contractStorage.burnedTokens, tokenId];
};

const getContractStorage = () => contractStorage;

module.exports = {
  burn,
  getContractStorage,
  setTestStartTime,
  setupPlanet,
  setupMintRound,
  mint,
  airdrop,
};
