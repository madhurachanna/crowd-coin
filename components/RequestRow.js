import React, { useState } from 'react'
import { Button, Table } from 'semantic-ui-react'
import web3 from "../ethereum/web3";
import _campaign from "../ethereum/campaign";
import { Router } from '../routes.js'

const RequestRow = ({ id, request, approversCount, address }) => {
    const [loadingApprove, setLoadingApprove] = useState(false)
    const [loadingFinalize, setLoadingFinalize] = useState(false)


    const { Row, Cell } = Table
    const readyToFinalize = request.approvalCount > approversCount / 2

    const onApprove = async () => {
        setLoadingApprove(true)
        const campaign = _campaign(address);

        try {
            const accounts = await web3.eth.getAccounts()
            await campaign.methods.approveRequest(id).send({
                from: accounts[0],
            })
        } catch (e) { }
        setLoadingApprove(false)
        Router.replaceRoute(`/campaigns/${address}/requests`)
    };

    const onFinalize = async () => {
        setLoadingFinalize(true)
        const campaign = _campaign(address);

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.finalizeRequest(id).send({
                from: accounts[0],
            });
        } catch (e) { }
        setLoadingFinalize(false)
        Router.replaceRoute(`/campaigns/${address}/requests`)
    };

    return (
        <Row
            disabled={request.complete}
            positive={readyToFinalize && !request.complete}>
            <Cell>{id}</Cell>
            <Cell>{request.description}</Cell>
            <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
            <Cell>{request.recipient}</Cell>
            <Cell>
                {request.approvalCount}/{approversCount}
            </Cell>
            <Cell>
                {request.complete ? null : (
                    <Button loading={loadingApprove} color="green" basic onClick={onApprove}>
                        Approve
                    </Button>
                )}
            </Cell>
            <Cell>
                {request.complete ? null : (
                    <Button loading={loadingFinalize} color="teal" basic onClick={onFinalize}>
                        Finalize
                    </Button>
                )}
            </Cell>
        </Row>
    )
}

export default RequestRow

