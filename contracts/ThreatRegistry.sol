// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ThreatRegistry
 * @dev Decentralized threat report registry storing cryptographic commitments (hashes)
 *      to ensure verifiable provenance and tamper-evident audit trails.
 */
contract ThreatRegistry {
    struct ThreatReport {
        bytes32 reportHash;
        address reporter;
        uint256 timestamp;
        string metadataURI; // Optional IPFS / reference link
        bool exists;
    }

    mapping(bytes32 => ThreatReport) private reports;
    bytes32[] private reportHashes;

    event ReportRegistered(bytes32 indexed reportHash, address indexed reporter, uint256 timestamp);

    function registerReport(bytes32 _reportHash, string calldata _metadataURI) external {
        require(!reports[_reportHash].exists, "Report already registered on-chain");

        reports[_reportHash] = ThreatReport({
            reportHash: _reportHash,
            reporter: msg.sender,
            timestamp: block.timestamp,
            metadataURI: _metadataURI,
            exists: true
        });

        reportHashes.push(_reportHash);

        emit ReportRegistered(_reportHash, msg.sender, block.timestamp);
    }

    function verifyReport(bytes32 _reportHash) external view returns (bool exists, address reporter, uint256 timestamp) {
        ThreatReport memory r = reports[_reportHash];
        return (r.exists, r.reporter, r.timestamp);
    }

    function getTotalReports() external view returns (uint256) {
        return reportHashes.length;
    }
}
