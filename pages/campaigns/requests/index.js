import React from 'react'
import { Button, Table } from 'semantic-ui-react'
import { Link } from '../../../routes.js'
import Layout from '../../../components/Layout.js'
import RequestRow from '../../../components/RequestRow.js'
import _campaign from '../../../ethereum/campaign.js'

const RequestIndex = ({ address, requests, requestCount, approversCount }) => {
    const { Header, Row, HeaderCell, Body } = Table

    const renderRows = () => {
        return requests.map((request, index) => {
            return <RequestRow
                key={index}
                id={index}
                request={request}
                approversCount={approversCount}
                address={address} />
        })
    }

    return (
        <Layout>
            <h3>Requests</h3>
            <Link route={`/campaigns/${address}/requests/new`}>
                <a>
                    <Button primary floated='right' style={{ marginBottom: 10 }}>Add Request</Button>
                </a>
            </Link>

            <Table>
                <Header>
                    <Row>
                        <HeaderCell>ID</HeaderCell>
                        <HeaderCell>Description</HeaderCell>
                        <HeaderCell>Amount</HeaderCell>
                        <HeaderCell>Recipient</HeaderCell>
                        <HeaderCell>Approval Count</HeaderCell>
                        <HeaderCell>Approve</HeaderCell>
                        <HeaderCell>Finalize</HeaderCell>
                    </Row>
                </Header>
                <Body>
                    {renderRows()}
                </Body>
            </Table>

            <div>Found {requestCount} requests.</div>
        </Layout>
    )
}

RequestIndex.getInitialProps = async (props) => {
    const { address } = props.query
    const campaign = _campaign(address)
    const requestCount = parseInt(await campaign.methods.getRequestsCount().call())
    const approversCount = await campaign.methods.approvarsCount().call();

    const requests = await Promise.all(
        Array(requestCount).fill().map(async (ele, index) => {
            const req = await campaign.methods.getRequest(index).call()
            console.log(req, index, requestCount)
            return {
                description: req[0],
                value: req[1],
                approvalCount: req[2],
                complete: req[3],
                recipient: req[4],
            }
        })
    )

    return { address, requests, requestCount, approversCount }
}

export default RequestIndex
