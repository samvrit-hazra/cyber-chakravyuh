// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CyberChakravyuhReportRegistry
 * @dev Decentralized, tamper-evident cryptographic report integrity registry for Cyber Chakravyuh.
 *      Anchored to Ethereum Sepolia to attest report authenticity, originality, and revision history.
 */
contract CyberChakravyuhReportRegistry {
    struct Report {
        bytes32 reportId;
        bytes32 reportHash;
        address issuer;
        uint256 timestamp;
        uint256 blockNumber;
        uint256 version;
        bool exists;
    }

    address public owner;
    uint256 public totalReports;

    // Report ID (e.g. keccak256("CCR-2026-000124")) => Report struct
    mapping(bytes32 => Report) public reports;

    // SHA-256 Report Fingerprint => Report ID
    mapping(bytes32 => bytes32) public hashToReportId;

    // Array of all registered report IDs for public auditing
    bytes32[] public reportIdList;

    event ReportRegistered(
        bytes32 indexed reportId,
        bytes32 indexed reportHash,
        address indexed issuer,
        uint256 timestamp,
        uint256 version
    );

    event ReportUpdated(
        bytes32 indexed reportId,
        bytes32 indexed newReportHash,
        uint256 timestamp,
        uint256 version
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "CyberChakravyuh: Unauthorized issuer");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Register a newly generated cybersecurity report fingerprint
     * @param reportId Unique report identifier digest (e.g. bytes32 of "CCR-2026-000124")
     * @param reportHash Cryptographic SHA-256 fingerprint of the canonical report
     */
    function registerReport(bytes32 reportId, bytes32 reportHash) external onlyOwner {
        require(!reports[reportId].exists, "CyberChakravyuh: Report already registered");
        require(hashToReportId[reportHash] == bytes32(0), "CyberChakravyuh: Fingerprint already registered");

        reports[reportId] = Report({
            reportId: reportId,
            reportHash: reportHash,
            issuer: msg.sender,
            timestamp: block.timestamp,
            blockNumber: block.number,
            version: 1,
            exists: true
        });

        hashToReportId[reportHash] = reportId;
        reportIdList.push(reportId);
        totalReports++;

        emit ReportRegistered(reportId, reportHash, msg.sender, block.timestamp, 1);
    }

    /**
     * @notice Update a report with a new revision fingerprint (auditable version history)
     * @param reportId Unique report identifier
     * @param newReportHash Cryptographic SHA-256 fingerprint of the updated report
     */
    function updateReportVersion(bytes32 reportId, bytes32 newReportHash) external onlyOwner {
        require(reports[reportId].exists, "CyberChakravyuh: Report not found");
        require(hashToReportId[newReportHash] == bytes32(0), "CyberChakravyuh: Fingerprint already used");

        reports[reportId].version++;
        reports[reportId].reportHash = newReportHash;
        reports[reportId].timestamp = block.timestamp;
        reports[reportId].blockNumber = block.number;

        hashToReportId[newReportHash] = reportId;

        emit ReportUpdated(reportId, newReportHash, block.timestamp, reports[reportId].version);
    }

    /**
     * @notice Lookup and verify a report by its Report ID
     * @param reportId Unique report identifier
     */
    function verifyReport(bytes32 reportId) external view returns (
        bytes32 reportHash,
        address issuer,
        uint256 timestamp,
        uint256 blockNumber,
        uint256 version,
        bool exists
    ) {
        Report memory r = reports[reportId];
        return (r.reportHash, r.issuer, r.timestamp, r.blockNumber, r.version, r.exists);
    }

    /**
     * @notice Reverse lookup to find a Report ID from its SHA-256 fingerprint
     * @param reportHash The SHA-256 digest to look up
     */
    function findReportByHash(bytes32 reportHash) external view returns (bytes32) {
        return hashToReportId[reportHash];
    }

    /**
     * @notice Check whether a given fingerprint exists and matches an authentic report
     * @param reportHash The SHA-256 digest to verify
     */
    function verifyReportByHash(bytes32 reportHash) external view returns (
        bytes32 reportId,
        address issuer,
        uint256 timestamp,
        uint256 version,
        bool exists
    ) {
        bytes32 id = hashToReportId[reportHash];
        if (id == bytes32(0)) {
            return (bytes32(0), address(0), 0, 0, false);
        }
        Report memory r = reports[id];
        return (r.reportId, r.issuer, r.timestamp, r.version, r.exists);
    }
}
