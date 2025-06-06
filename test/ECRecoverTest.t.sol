// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {Test} from "../lib/forge-std/src/Test.sol";
import {EcrecoverWrapper} from "src/ECRecoverWrapper.sol";

contract ECRecoverTest is Test {
    address constant PRECOMPILE = 0x0000000000000000000000000000000000000001;
    EcrecoverWrapper wrapper;
    bytes32 constant MSG_HASH = 0x50b2c43fd39106bafbba0da34fc430e1f91e3c96ea2acee2bc34119f92b37750;
    uint8 constant V = 28;
    bytes32 constant R =
        0x9df2f9677892118967126d5dfbb9c18b4a160bdad2b4e0689947293ecb93ed1b;
    bytes32 constant S =
        0x5af6b2969be8e41670ef67eac20be14dca90c0888dd083dc7c66cf3806dbedab;
    address constant EXPECTED = 0xe516dD4E7e231982349A21bB94C15b5E447faEDF;

    function setUp() public {
        // To deploy wrapper contract
        wrapper = new EcrecoverWrapper();
        // Check deployment succeeded
        assertTrue(address(wrapper) != address(0), "Deployment failed");
    }

    function testStage1_RawPrecompile() public view {
        // To prepare input for ecrecover
        bytes memory input = abi.encodePacked(MSG_HASH, uint256(V), R, S);
        // To call precompile directly
        (bool success, bytes memory result) = PRECOMPILE.staticcall(input);
        assertTrue(success, "Precompile call failed");
        address recovered = address(uint160(uint256(bytes32(result))));
        assertEq(recovered, EXPECTED, "Precompile result incorrect");
    }

    function testStage2_DeployCheck() public view {
        // To check for non-empty bytecode
        bytes memory code = address(wrapper).code;
        assertTrue(code.length > 0, "Bytecode empty");
    }

    function testStage3_ContractInvocation() public view {
        // Call wrapper function
        address result = wrapper.recover(MSG_HASH, V, R, S);
        assertEq(result, EXPECTED, "Wrapper result incorrect");
    }
}
