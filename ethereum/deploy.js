const path = require('path')
const fs = require('fs-extra')
const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')
const compiledFactory = require('./build/CampaignFactory.json')
const provider = new HDWalletProvider(
    'useless embody sort evoke culture faint educate denial door never response expect',
    'https://ropsten.infura.io/v3/c0eb6034d6dd457bb8cbaf4f2acb7610'
)
const web3 = new Web3(provider)
const buildPath = path.resolve(__dirname, 'build');

const deploy = async () => {
    console.log('Deploy started')
    try {
        const accounts = await web3.eth.getAccounts()
        console.log(accounts)
        console.log(accounts[0])
        const result = await new web3.eth.Contract(compiledFactory.abi)
            .deploy({ data: compiledFactory.bytecode })
            .send({ from: accounts[0] })
        console.log('Contract deployed to ', result.options.address)
        fs.outputJsonSync(
            path.resolve(buildPath, 'address' + '.txt'),
            result.options.address
        )
    } catch (e) {
        console.log('Something went wrong!', e)
    }
    provider.engine.stop()
}

deploy()
