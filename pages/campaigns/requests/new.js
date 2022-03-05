import React, { useState } from 'react'
import { Form, Input, Message, Button } from "semantic-ui-react"
import Layout from '../../../components/Layout.js'
import _campaign from '../../../ethereum/campaign.js'
import web3 from '../../../ethereum/web3.js'
import { Router, Link } from '../../../routes.js'

const RequestNew = ({ address }) => {
    const [value, setValue] = useState('')
    const [description, setDescription] = useState('')
    const [recipient, setRecipient] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [loading, setLoading] = useState(false)

    const handleOnSubmit = async (e) => {
        e.preventDefault()

        console.log(address)

        const campaign = _campaign(address)
        setErrorMsg('')
        setLoading(true)
        try {
            const accounts = await web3.eth.getAccounts()
            await campaign.methods
                .createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
                .send({ from: accounts[0] })
            setValue('')
            setErrorMsg('')
            Router.replaceRoute(`/campaigns/${address}/requests`)
        } catch (e) {
            setErrorMsg(e.message)
        }
        setLoading(false)
    }

    return (
        <Layout>
            <Link route={`/campaigns/${address}/requests`}>
                <a>Back</a>
            </Link>

            <h3>Create a Request</h3>

            <Form onSubmit={handleOnSubmit} error={!!errorMsg}>
                <Form.Field>
                    <label>Description</label>
                    <Input
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        labelPosition="right" />
                </Form.Field>
                <Form.Field>
                    <label>Value in Ether</label>
                    <Input
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        label="ether"
                        labelPosition="right" />
                </Form.Field>
                <Form.Field>
                    <label>Recipient</label>
                    <Input
                        value={recipient}
                        onChange={e => setRecipient(e.target.value)}
                        labelPosition="right" />
                </Form.Field>
                <Message error header="Oops!" content={errorMsg} />
                <Button loading={loading} primary>Create!</Button>
            </Form>
        </Layout>
    )
}

RequestNew.getInitialProps = async (props) => {
    const { address } = props.query
    return { address }

}

export default RequestNew
