import { ethers } from 'ethers'
import fs from 'fs';
import 'dotenv/config';

const YOUR_PRIVATE_KEY = process.env.PRIVATE_KEY_ENV;
async function deploy() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL_ENV);
    const wallet = new ethers.Wallet(YOUR_PRIVATE_KEY, provider);
    

    const abi = [
        "function recover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) public view returns (address)"
    ];

    const byte_code = JSON.parse(fs.readFileSync('out/contract.sol/EcrecoverWrapper.json'));
    const bytecode = byte_code.bytecode.object; // Replace with `forge compile` output
    
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    const gasLimit = 1000000; // Fixed gas limit. this was given error and increased to 1000000
    const contract = await factory.deploy({ gasLimit, type: 0 }); // Legacy TxType?0
    await contract.deploymentTransaction().wait();

    
    // Post-deployment checks
    const receipt = await provider.getTransactionReceipt(contract.deploymentTransaction().hash);
    // const code = await provider.getCode(contract.address);
    
    // Update results.json
    const results = JSON.parse(fs.readFileSync('results.json'));
    results.stage1 = {
        tx_hash: contract.deploymentTransaction().hash,
        // contract_address: contract.address,
        receipt_status: receipt.status,
        // code_length: code.length,
        block_number: receipt.blockNumber
    };
    fs.writeFileSync('results.json', JSON.stringify(results, null, 2));
    
    console.log(`Contract deployed at: ${contract.target}`);
    console.log(`Transaction Hash: ${contract.deploymentTransaction().hash}`);
    console.log(`Block Number: ${receipt.blockNumber}`);
}

deploy();