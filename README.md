# ZK Crypto Net Worth (KryptoAssetZ)

This is a project made by [Kevin Joshi](https://github.com/KevinJ-hub), [Kaushal Binjola](https://github.com/KaushalBinjola) & [Rajas Bondale](https://github.com/Rajas-B).  
It is hosted on [Render](https://render.com/), you can check it out [here](https://kryptoassetz.onrender.com/), the details are encrypted and stored on Goerli test network with the zkp being stored on ipfs which is deployed using the api provided by [web3.storage](https://web3.storage/). The frontend UI and dashboard charts are generated using [MUI](https://mui.com/) and [React Chartjs 2](https://react-chartjs-2.js.org/) respectfully.  

> **NOTE:** Since the app is hosted for free on render it goes to sleep on 15 mins of inactivity so there might be a possibility that the app takes a few seconds to load INITIALLY so please be patient.  

- Use ZK Crypto Net Worth (KryptoAssetZ) to prove your crypto assets are above/below a threshold without revealing your crypto net worth, wallet addresses or on-chain activity.
- For example, universities accepting international students may require the applicants to provide proof that they can afford the expenses, including crypto assets on the blockchain. But if the applicant doesn't want to share their exact cryptocurrency balances and on-chain activity, they can use ZK Crypto Net Worth (KryptoAssetZ).
- Using ZK Crypto Net Worth (KryptoAssetZ), the university can request proof for a specific threshold, and the applicant can choose to provide that proof. This is done using Zero Knowledge Proofs.
- All the data is securely encrypted and stored on blockchain using asymmetric encryption and the user is the only person who can access their data using the private key provided during registration.  

## Tech Used

- Ethereum blockchain
- Solidity
- Circom 2
- Hardhat
- Ipfs
- Reactjs
- Nodejs
- Expressjs

## Flow Diagram

![Flow Diagram](screenshots/flowDiagram.jpg)

## Running this project

1. Clone the repository
2. Generate Zero Knowledge Proof (zkp) setup files by following the instructions given in the README file present in [zkp folder](zkp/) (OPTIONAL)
3. Deploy the smart contracts by following the instructions given in the README file present in [hardhat-project folder](hardhat-project/)
4. Run the webapp by following the instructions given in the README file present in [webapp folder](webapp/)

## Images

![Login Page](screenshots/login.png)
---

![Dashboard GIF](screenshots/dashboard.gif)
---

![Wallets Page](screenshots/wallets.gif)
---

![Incoming Requests Page](screenshots/incomingRequests.gif)
---

![Outgoing Requests Page](screenshots/outgoingRequests.gif)
