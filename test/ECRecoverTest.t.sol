// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "forge-std/Test.sol";
contract ECRecoverTest is Test {
    address constant PRECOMPILE = 0x0000000000000000000000000000000000000001;
    ECRecoverWrapper wrapper;
    bytes32 constant MSG_HASH = 0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8;
    uint8 constant V = 28;
    bytes32 constant R = 0x5bb9440e278a4f9712d46b521d8d927784d49e8dfde9a126786e45622c2d490a;
    bytes32 constant S = 0x2e6fb6b3607f6dada2b811f5556c8b5e8d737dd4b8a28e6d473cdefb52e99b88;
    address constant EXPECTED = 0x456e23c3f1C5a4cD6A795b2f29B7aB60ABa49a77;
    function setUp() public {
        // Deploy wrapper contract
        wrapper = new ECRecoverWrapper();
        // Ensure deployment succeeded
        assertTrue(address(wrapper) != address(0), "Deployment failed");
    }
    function testStage1_RawPrecompile() public {
        // Prepare input for ecrecover
        bytes memory input = abi.encodePacked(MSG_HASH, V, R, S);
        // Call precompile directly
        (bool success, bytes memory result) = PRECOMPILE.staticcall(input);
        assertTrue(success, "Precompile call failed");
        address recovered = address(uint160(uint256(bytes32(result))));
        assertEq(recovered, EXPECTED, "Precompile result incorrect");
    }
    function testStage2_DeployCheck() public {
        // Check non-empty bytecode
        bytes memory code = address(wrapper).code;
        assertTrue(code.length > 0, "Bytecode empty");
    }
    function testStage3_ContractInvocation() public {
        // Call wrapper function
        address result = wrapper.recoverAddress(MSG_HASH, V, R, S);
        assertEq(result, EXPECTED, "Wrapper result incorrect");
    }
}