import React, { useState } from "react"
import { Form, Input, Message, Button } from "semantic-ui-react"
import _campaign from '../ethereum/campaign.js'
import web3 from '../ethereum/web3.js'
import { Router } from '../routes.js'

const ContributeForm = ({ address }) => {
    const [value, setValue] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [loading, setLoading] = useState(false)

    const handleOnSubmit = async (e) => {
        e.preventDefault()

        const campaign = _campaign(address)
        setErrorMsg('')
        setLoading(true)
        try {
            const accounts = await web3.eth.getAccounts()
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(value, 'ether')
            })
            setValue('')
            setErrorMsg('')
            Router.replaceRoute(`/campaigns/${address}`)
        } catch (e) {
            setErrorMsg(e.message)
        }
        setLoading(false)
    }

    return (
        <Form onSubmit={handleOnSubmit} error={!!errorMsg}>
            <Form.Field>
                <label>Amount to Contribute</label>
                <Input
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    label="ether"
                    labelPosition="right" />
            </Form.Field>
            <Message error header="Oops!" content={errorMsg} />
            <Button loading={loading} primary>Contribute!</Button>
        </Form>
    )
}

export default ContributeForm

