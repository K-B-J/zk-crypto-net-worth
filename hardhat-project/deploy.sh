#!/bin/bash

rm -r "./artifacts"

rm -r "./cache"

yarn hardhat compile || { exit 1; }
[ $? -eq 0 ] && echo "success: compiled contracts"

yarn hardhat run --network goerli scripts/deployPriceConsumer.ts || { exit 1; }
[ $? -eq 0 ] && echo "success: deployed and verified PriceConsumer contract on goerli"

yarn hardhat run --network polygonMumbai scripts/deployPriceConsumer.ts || { exit 1; }
[ $? -eq 0 ] && echo "success: deployed and verified PriceConsumer contract on polygonMumbai"

yarn hardhat run --network goerli scripts/deployVerifier.ts || { exit 1; }
[ $? -eq 0 ] && echo "success: deployed and verified Verfier contract on goerli"

yarn hardhat run --network goerli scripts/deployZKCryptoNetWorth.ts || { exit 1; }
[ $? -eq 0 ] && echo "success: deployed and verified ZKCryptoNetWorth contract on goerli"

node ./scripts/setFeedsPolygonMumbai.mjs || { exit 1; }
[ $? -eq 0 ] && echo "success: set feeds on polygonMumbai"

mkdir "../webapp/utils/contracts"

cp ./data/priceConsumerGoerli.json ../webapp/utils/contracts/priceConsumerGoerli.json || { exit 1; }
[ $? -eq 0 ] && echo "success: copied priceConsumerGoerli.json to the backend"

cp ./data/priceConsumerPolygonMumbai.json ../webapp/utils/contracts/priceConsumerPolygonMumbai.json || { exit 1; }
[ $? -eq 0 ] && echo "success: copied priceConsumerPolygonMumbai.json to the backend"

cp ./data/zKCryptoNetWorthGoerli.json ../webapp/utils/contracts/zKCryptoNetWorthGoerli.json || { exit 1; }
[ $? -eq 0 ] && echo "success: copied zKCryptoNetWorthGoerli.json to the backend"

mkdir "../webapp/frontend/src/contracts"

cp ./data/zKCryptoNetWorthGoerli.json ../webapp/frontend/src/contracts/zKCryptoNetWorthGoerli.json || { exit 1; }
[ $? -eq 0 ] && echo "success: copied zKCryptoNetWorthGoerli.json to the frontend"

cp ./data/verifierGoerli.json ../webapp/frontend/src/contracts/verifierGoerli.json || { exit 1; }
[ $? -eq 0 ] && echo "success: copied verifierGoerli.json to the frontend"
