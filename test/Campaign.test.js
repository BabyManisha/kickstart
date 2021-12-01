const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts, factory, campaignAddress, campaign;

beforeEach(async() => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({data: compiledFactory.bytecode})
        .send({from: accounts[0], gas: '1000000'})

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);
});

describe('Campaign Testing', () => {
    it('Deploy a Factory and a Campaign!', ()=>{
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('Check Manager!', async() => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });
    
    it('Contribute to become an approver!', async() => {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]
        });
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    });

    it('Minimum Contributions!', async() => {
        try {
            await campaign.methods.contribute().send({
                from: accounts[1],
                value: '50'
            });
            assert(false);
        } catch (error) {
            assert(true);
        }
    });

    it('Create Request!', async() => {
        await campaign.methods.createRequest('Hardware description', '500', accounts[3]).send({
            from: accounts[0],
            gas: '1000000'
        });
        const request = await campaign.methods.requests(0).call();
        assert.equal('Hardware description', request.description)
    });

    it('Fail Create Request!', async() => {
        try {
            await campaign.methods.createRequest('Hardware description', '500', accounts[3]).send({
                from: accounts[2],
                gas: '1000000'
            });
            assert(false);
        } catch (error) {
            assert(true);
        }
    });

    it('Process Request', async() => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods.createRequest('Test', web3.utils.toWei('5', 'ether'), accounts[2])
            .send({from: accounts[0], gas: '1000000'});

        await campaign.methods.approveRequest(0).send({
            from: accounts[1],
            gas: '1000000'
        });

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '100000'
        });

        let balance = await web3.eth.getBalance(accounts[2]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        console.log(balance);
        assert(balance > 102);
    });

})
