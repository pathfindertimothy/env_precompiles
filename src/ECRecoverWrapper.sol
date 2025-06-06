// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EcrecoverWrapper {
    function recover(
        bytes32 hash,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public view returns (address) {
        (bool success, bytes memory result) = address(0x01).staticcall(
            abi.encode(hash, v, r, s)
        );
        require(success, "ecrecover failed");
        return abi.decode(result, (address));
    }
}
