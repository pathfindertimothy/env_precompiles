// const { ethers } = require("ethers");
import { ethers } from 'ethers';
import 'dotenv/config';

// Used to output contract address for the particular private key

const privateKey = process.env.PRIVATE_KEY_ENV;
const wallet = new ethers.Wallet(privateKey);
console.log(wallet.address); // Should output contract address