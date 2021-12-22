import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';
// require('dotenv').config()

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface), 
    // process.env.FACTORY_ADDRESS
    '0xF1DEB11E010a46E1A6C6465f69C516Fd9186bCeD'
);

export default instance;