const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');

const compiledFactory = require('./build/CampaignFactory.json');
require('dotenv').config()

const provider = new HDWalletProvider(
    process.env.HD_WALLET_KEY,
    process.env.HD_WALLET_URL
)

const web3 = new Web3(provider);

(async() => {
    const accounts = await web3.eth.getAccounts();

    console.log(`Attempting to Deploy with Account ${accounts[0]}`);

    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({data: compiledFactory.bytecode})
        .send({
            from: accounts[0],
            gas: '1000000'
        });
    
    console.log(`Contract deployed to ${result.options.address}`);
    return true;
})();
