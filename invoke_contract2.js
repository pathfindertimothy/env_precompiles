import { ethers } from 'ethers';
import 'dotenv/config';


const MY_PRIVATE_KEY = process.env.PRIVATE_KEY_ENV;

async function main() {
  const rpcUrl = process.env.RPC_URL_ENV;
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const privateKey = MY_PRIVATE_KEY;
  const wallet = new ethers.Wallet(privateKey, provider);

  const MY_CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

  const contractAddress ="0x9ba50b26463442C09208d3885dFEb75F7aBfB36E";    // Gotten from running: node deploy.js
  const abi = [
    "function recover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) public view returns (address)"
  ];
  
  const contract = new ethers.Contract(contractAddress, abi, provider);

  // Test vector
  const message = "Hello";
  const messageHash = ethers.keccak256(ethers.toUtf8Bytes(message));
  const signature = await wallet.signMessage(message);
  const sig = ethers.Signature.from(signature);

  // Call contract
  const recoveredAddress = await contract.recover(messageHash, sig.v, sig.r, sig.s);
  console.log("Recovered Address:", recoveredAddress);
  console.log("Expected Address:", wallet.address);
  console.log("Test Passed:", recoveredAddress.toLowerCase() === wallet.address.toLowerCase());
}

main().catch(console.error);