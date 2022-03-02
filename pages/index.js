import React, { useState, useEffect } from 'react'
import { Card, Button } from 'semantic-ui-react'
import factory from '../ethereum/factory.js'
import Layout from '../components/Layout.js'
import { Link } from '../routes.js'

const Home = ({ campaigns }) => {
    useEffect(() => {
        console.log('Campaigns', campaigns)
    })

    const renderCampaigns = () => {
        const items = campaigns.map(address => ({
            header: address,
            description: (
                <Link route={`/campaigns/${address}`}>
                    <a>View Campaign</a>
                </Link>
            ),
            fluid: true
        }))
        return <Card.Group items={items} />
    }

    return (
        <Layout>
            <div>
                <h3>Open Campaigns</h3>

                <Link route="/campaigns/new">
                    <a>
                        <Button floated="right" content="Create Campaign" icon="add circle" primary />
                    </a>
                </Link>

                {renderCampaigns()}
            </div>
        </Layout>
    )

}

Home.getInitialProps = async () => {
    const campaigns = await factory.methods.getDeployedCampaigns().call()
    return { campaigns }
}

export default Home
