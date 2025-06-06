import { ethers } from 'ethers';
import 'dotenv/config';
import fs from 'fs';

async function main() {
    // Load environment variables
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL_ENV);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_ENV, provider);

    // Load contract address from results.json
    const contractAddr = JSON.parse(fs.readFileSync('results.json')).stage2.contract_address;
    const abi = [
        "function recover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) public view returns (address)"
    ];

    // Create contract instance
    const contract = new ethers.Contract(contractAddr, abi, wallet);

    // Deterministic test vector
    const message = "hello";
    const messageBytes = ethers.toUtf8Bytes(`\x19Ethereum Signed Message:\n${message.length}${message}`);
    const messageHash = ethers.keccak256(messageBytes);
    const signature = await wallet.signMessage(message);
    const sig = ethers.Signature.from(signature);
    const expected = wallet.address;

    // Call recover function as a transaction
    const tx = await contract.recover(messageHash, sig.v, sig.r, sig.s, { gasLimit: 30000 });
    const receipt = await tx;
    const result = await contract.recover(messageHash, sig.v, sig.r, sig.s); // Static call for result
    const passed = result.toLowerCase() === expected.toLowerCase();

    // Update results.json
    const results = JSON.parse(fs.readFileSync('results.json'));
    results.stage3 = {
        input: {
            hash: messageHash,
            v: sig.v,
            r: sig.r,
            s: sig.s
        },
        output: result,
        expected: expected,
        passed: passed,
    };
    fs.writeFileSync('results.json', JSON.stringify(results, null, 2));

    // Log results
    console.log(`Test ${passed ? 'PASSED' : 'FAILED'}`);
    console.log(`Message: ${message}`);
    console.log(`Message Hash: ${messageHash}`);
    console.log(`Signature: ${signature}`);
    console.log(`Recovered Address: ${result}`);
    console.log(`Expected Address: ${expected}`);
    console.log(`Test Passed: ${passed}`);
}

main().catch(console.error);