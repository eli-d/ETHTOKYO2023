// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Confide {
    struct ListNode {
        address value;
    }

    struct UserNode {
        uint nEdges;
        mapping(uint => ListNode) existingEdges;
        mapping(address => Trust) edges;
    }

    struct Trust {
        address _address;
        uint8 trustLevel;

    }
    
    mapping(address => UserNode) accounts;

    function getTrustLevel(address a, address b) public view returns (uint8) {
        require(accounts[a].edges[b]._address == b, "Account is not trusted");

        return accounts[a].edges[b].trustLevel;
    }

    function connectedFullTrust(address a, address b, address inter) public view {
        require(getTrustLevel(a, inter) > 1, "Intermediate account isn't trusted");
        require(getTrustLevel(inter, b) > 1, "Node isn't trusted by intermediate account");
    }

    function connectedPartialTrust(address a, address b, address inter0, address inter1, address inter2) public view {
        require(inter0 != inter1 && inter0 != inter2 && inter1 != inter2, "Intermediate accounts with partial trust are not unique");

        require(getTrustLevel(a, inter0) > 0, "Intermediate account isn't trusted");
        require(getTrustLevel(a, inter1) > 0, "Intermediate account isn't trusted");
        require(getTrustLevel(a, inter2) > 0, "Intermediate account isn't trusted");

        require(getTrustLevel(inter0, b) > 1, "Intermediate account doesn't trust target");
        require(getTrustLevel(inter1, b) > 1, "Intermediate account doesn't trust target");
        require(getTrustLevel(inter2, b) > 1, "Intermediate account doesn't trust target");
    }

    function connected(address a, address b, address[] calldata intermediates) public view {
        require(intermediates.length == 0 || intermediates.length == 3 || intermediates.length == 1, "Length of intermediate array must be 0, 1 or 3");
        if (intermediates.length == 0) {
            require(getTrustLevel(a, b) > 1, "Account is not full trust");
        } else if (intermediates.length == 1) {
            connectedFullTrust(a, b, intermediates[0]);
        } else {
            connectedPartialTrust(a, b, intermediates[0], intermediates[1], intermediates[2]);
        }
    }
 
    function postConnected(address a, address b, address[] calldata intermediates) public {
        connected(a, b, intermediates);
    }

    function connected5Degrees(address a, address b, address[] calldata path) public view {
        require(path.length <= 3, "Path can't be longer than 5");
        // we only follow full trusts for authentication, but the final edge can be partial
        address last = a;
        for (uint i = 0; i < path.length; i++) {
            require(getTrustLevel(last, path[i]) > 1, "An edge isn't full trust");
            last = path[i];
        }
        require(getTrustLevel(last, b) > 0, "No edge to target");
    }

    function postConnected5Degrees(address a, address b, address[] calldata path) public {
        connected5Degrees(a, b, path);
    }

    function getEdges(address a) public view returns (Trust[] memory) {
        Trust[] memory res = new Trust[](accounts[a].nEdges);

        for (uint i = 0; i < accounts[a].nEdges; i++) {
            res[i] = accounts[a].edges[accounts[a].existingEdges[i].value];
        }

        return res;

    }

    function trust(address a, address b, uint8 level) public {
        require (msg.sender == a, "Only the sender can update their trust");

        UserNode storage truster = accounts[a];

        if (truster.edges[b]._address != b) {
            truster.existingEdges[truster.nEdges++] = ListNode({value: b});
        }

        truster.edges[b] = Trust({_address: b, trustLevel: level});
    }
}
