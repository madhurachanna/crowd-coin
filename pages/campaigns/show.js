import React, { useState, useEffect } from 'react'
import { Form, Button, Input, Message, Card, Grid } from 'semantic-ui-react'
import Layout from '../../components/Layout.js'
import factory from '../../ethereum/factory.js'
import web3 from '../../ethereum/web3.js'
import { Router } from '../../routes.js'
import ContributeForm from '../../components/ContributeForm'
import _campaign from '../../ethereum/campaign.js'

const Show = (props) => {
    const {
        balance,
        manager,
        minimumContribution,
        requestCount,
        approversCount
    } = props
    const renderCards = () => {
        const items = [
            {
                header: manager,
                meta: "Address of Manager",
                description:
                    "The manager created this campaign and can create requests to withdraw money",
                style: { overflowWrap: "break-word" },
            },
            {
                header: minimumContribution,
                meta: "Minimum Contribution (wei)",
                description:
                    "You must contribute at least this much wei to become an approver",
            },
            {
                header: requestCount,
                meta: "Number of Requests",
                description:
                    "A request tries to withdraw money from the contract. Requests must be approved by approvers",
            },
            {
                header: approversCount,
                meta: "Number of Approvers",
                description:
                    "Number of people who have already donated to this campaign",
            },
            {
                header: web3.utils.fromWei(balance, "ether"),
                meta: "Campaign Balance (ether)",
                description:
                    "The balance is how much money this campaign has left to spend.",
            },
        ]

        return <Card.Group items={items} />
    }

    return (
        <Layout>
            <h3>Campaign Show</h3>
            <Grid>
                <Grid.Column width={10}>
                    {renderCards()}
                </Grid.Column>
                <Grid.Column width={6}>
                    <ContributeForm />
                </Grid.Column>
            </Grid>
        </Layout>
    )
}

Show.getInitialProps = async (props) => {
    const campaign = _campaign(props.query.address)
    const summary = await campaign.methods.getSummary().call()
    return {
        minimumContribution: summary[0],
        balance: summary[1],
        requestCount: summary[2],
        approversCount: summary[3],
        manager: summary[4]
    }
}

export default Show
