import web3 from './web3'
import campaignFactory from './build/CampaignFactory.json'

const address = '0xeAab2e58C9A84ce7ab83C0C34fB75D0Ed88709b9'

export default new web3.eth.Contract(campaignFactory.abi, address)

