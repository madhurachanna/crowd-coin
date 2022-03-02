import React, { useState, useEffect } from 'react'
import { Form, Button, Input, Message } from 'semantic-ui-react'
import Layout from '../../components/Layout.js'
import factory from '../../ethereum/factory.js'
import web3 from '../../ethereum/web3.js'
import { Router } from '../../routes.js'

const CampaignNew = () => {
    const [minContribution, setMinContribution] = useState(0)
    const [errorMsg, setErrorMsg] = useState('')
    const [loading, setLoading] = useState(false)

    const onSubmit = async (e) => {
        e.preventDefault()
        setErrorMsg('')
        setLoading(true)
        try {
            const accounts = await web3.eth.getAccounts()
            await factory.methods
                .createCampaign(minContribution)
                .send({ from: accounts[0] })
            Router.pushRoute('/')
        } catch (e) {
            setErrorMsg(e.message)
        }
        setLoading(false)
    }

    return (
        <Layout>
            <h3>Create a campaign</h3>

            <Form onSubmit={onSubmit} error={!!errorMsg}>
                <Form.Field>
                    <label>Minimum Contribution</label>
                    <Input
                        label="wei"
                        labelPosition='right'
                        value={minContribution}
                        onChange={e => setMinContribution(e.target.value)} />
                </Form.Field>
                <Message error header="Oops!" content={errorMsg} />
                <Button loading={loading} type='submit' primary>Create!</Button>
            </Form>
        </Layout>
    )
}

export default CampaignNew
