const path = require('path')
const solc = require('solc')
const fs = require('fs-extra')

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath)

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol')
const source = fs.readFileSync(campaignPath, 'utf8')

const createConfig = () => ({
    language: 'Solidity',
    sources: {
        'Campaign.sol': {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        },
    }
})

const result = solc.compile(JSON.stringify(createConfig()))
console.log(result)
const contracts = JSON.parse(result).contracts['Campaign.sol']

fs.ensureDirSync(buildPath)
for (let contract in contracts) {
    console.log(contract)
    const obj = {
        abi: contracts[contract].abi,
        bytecode: '0x' + contracts[contract].evm.bytecode.object
    }
    fs.outputJsonSync(
        path.resolve(buildPath, contract + '.json'),
        obj
    )
}
// // fs.appendFile('result.txt', result, (e) => console.log('created', e))
// // console.log(result.contracts['Inbox'])
// // console.log(JSON.parse(result))
// const obj = {
//     abi: contract.abi,
//     bytecode: '0x' + contract.evm.bytecode.object
// }
// console.log(JSON.stringify(contract.abi))
// module.exports = obj












