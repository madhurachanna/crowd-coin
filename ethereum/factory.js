import web3 from './web3'
import campaignFactory from './build/CampaignFactory.json'

const address = '0x3295333DFebACf668319A2e792ad5fcB5ef81025'

export default new web3.eth.Contract(campaignFactory.abi, address)

