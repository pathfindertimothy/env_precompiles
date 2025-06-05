import { ethers } from 'ethers';
import fs from 'fs';
import 'dotenv/config';

async function main() {
  const rpcUrl = process.env.RPC_URL_ENV;
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const privateKey = process.env.PRIVATE_KEY_ENV;
  const wallet = new ethers.Wallet(privateKey, provider);

  const abi = [
    "function recover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) public view returns (address)"
  ];
  const byte_code = JSON.parse(fs.readFileSync('out/contract.sol/EcrecoverWrapper.json'));
  const bytecode = byte_code.bytecode.object; // Replace with compiled contract output

// to log bytecode: used for debugging
// console.log("Bytecode:", bytecode);

  const factory = new ethers.ContractFactory(abi, bytecode, wallet);

  const gasLimit = 1000000; // Fixed gas limit
  const contract = await factory.deploy({ gasLimit, type: 0 }); // Legacy TxType 0
  await contract.waitForDeployment();
  const txHash = contract.deploymentTransaction().hash;
  console.log("Contract Address:", contract.target);
  console.log("Transaction Hash:", txHash);

  // Post-deploy checks
  const receipt = await provider.getTransactionReceipt(txHash);
  console.log("Receipt Status:", receipt.status === 1 ? "Success" : "Failed");
  const code = await provider.getCode(contract.target);
  console.log("Bytecode Deployed:", code !== "0x");
  
  
  const blockNumber = await provider.getBlockNumber();  
  console.log("Current Block Number:", blockNumber);

  const balance = await provider.getBalance(wallet.address);
  console.log("Wallet Balance:", ethers.formatEther(balance), "ETH");
}

main().catch(console.error);


// deploy the contract: node deploy2.js