const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider({ gasLimit: 10000000 }));

const compiledCampaignFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    // get list of accounts
    accounts = await web3.eth.getAccounts();

    // deploy factory contract using Contract constructor and passing in the compiled Contract abi (interface).
    factory = await new web3.eth.Contract(compiledCampaignFactory.abi)
        .deploy({ data: compiledCampaignFactory.bytecode }) // Then deploy Contract to network
        .send({ from: accounts[0], gas: '10000000' });

    // USe factory to create an instance of the campaign (with a minContribution)
    await factory.methods.createCampaign("100").send({
        //NB: send() method used when mutating or creating data
        from: accounts[0],
        gas: "1000000",
    });

    // get the campaign address - the [campaignAddress] is es2016 syntax to get the first element from the returned array
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call(); //NB: call() method used when viewing or fetching data - no mutating

    //Get the actual campaign now using the campaign Address
    campaign = await new web3.eth.Contract(
        compiledCampaign.abi,
        campaignAddress //use this to get a particular deployed version - when creating a new one - you don't use an address
    );
});

// Check that CampaignFactory and Campaign are successfully deployed by making sure they have an address assigned to them
describe("Campaigns", () => {
    it("deploys a factory and a campaign", () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });
});
