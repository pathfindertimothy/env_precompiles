import { ethers } from 'ethers';
import fs from 'fs';
import 'dotenv/config';


const MY_PRIVATE_KEY = process.env.PRIVATE_KEY_ENV;

async function test() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL_ENV);
    const wallet = new ethers.Wallet(MY_PRIVATE_KEY, provider);
    // const contractAddr = JSON.parse(fs.readFileSync('results.json')).stage2.contract_address;
    const contractAddr = "0x9ba50b26463442C09208d3885dFEb75F7aBfB36E";
    // const abi = JSON.parse(fs.readFileSync('out/SHA256Wrapper.sol/SHA256Wrapper.json')).abi;
    const abi = [
        "function recover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) public view returns (address)"
    ];
    
    const contract = new ethers.Contract(contractAddr, abi, wallet);
    const input = '0x68656c6c6f'; // "hello"
    const expected = '0xa591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e';
    
    // Call computeSHA256 and wait for transaction
    const tx = await contract.computeSHA256(input, { gasLimit: 1000000 });
    const receipt = await tx.wait();
    const result = await contract.computeSHA256(input); // Static call for result
    const passed = result === expected;
    
    // Update results.json
    const results = JSON.parse(fs.readFileSync('results.json'));
    results.stage3 = {
        input: input,
        output: result,
        expected: expected,
        passed: passed,
        tx_hash: receipt.transactionHash,
        block_number: receipt.blockNumber
    };
    fs.writeFileSync('results.json', JSON.stringify(results, null, 2));
    
    console.log(`Test ${passed ? 'PASSED' : 'FAILED'}`);
    console.log(`Output: ${result}`);
    console.log(`Transaction Hash: ${receipt.transactionHash}`);
    console.log(`Block Number: ${receipt.blockNumber}`);
}

test();