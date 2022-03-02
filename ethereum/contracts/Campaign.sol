// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;


contract CampaignFactory {
    address[] public deployedCampaigns;


    function createCampaign(uint minimum)
    public
    payable
    {
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(address(newCampaign));
    }


    function getDeployedCampaigns()
    public
    view
    returns (address[] memory)
    {
        return deployedCampaigns;
    }
}


contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        uint approvalCount;
        bool complete;
        mapping(address => bool) approvals;
    }


    address payable manager;
    uint public minimumContribution;
    uint public numRequests;
    uint public approvarsCount;
    mapping(address => bool) public approvers;
    mapping(uint => Request) requests;


    modifier restricted() {
        require(msg.sender == manager);
        _;
    }


    constructor(uint _minimumContribution, address _manager) {
        manager = payable(_manager);
        minimumContribution = _minimumContribution;
        approvarsCount++;
    }


    function contribute()
    public 
    payable
    returns (uint)
    {
        require(msg.value > minimumContribution, "Not possible");
        approvers[msg.sender] = true;
        return address(this).balance;
    }


    function getBalance()
    public
    view
    returns (uint, uint)
    {
        return (address(this).balance, requests[0].value);
    }


    function createRequest(string memory description, uint value, address payable recipient)
    public
    restricted
    {
        Request storage c = requests[numRequests++];
        c.description = description;
        c.recipient = recipient;
        c.value = value;
        c.approvalCount = 0;
    }


    function approveRequest(uint index)
    public
    {
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;

    }


    function finalizeRequest(uint index)
    public
    payable
    restricted
    {
        Request storage request = requests[index];
        // require(request.approvalCount >= (approvarsCount / 2));
        require(!request.complete);
        payable(request.recipient).transfer(request.value);
        request.complete = true;
    }


    function getSummary()
    public
    view
    returns (uint, uint, uint, uint, address) {
        return (
            minimumContribution,
            address(this).balance,
            numRequests,
            approvarsCount,
            manager
        );
    }


    function getRequestsCount()
    public
    view
    returns (uint) {
        return numRequests;
    }
}
