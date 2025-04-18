require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Get your private key from an environment variable or .env file
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0212f3fea969ceba191e68039537626162b5b8b8cfbdd987f115c944a1aa79d9";

module.exports = {
  solidity: "0.8.28", 
  networks: {
    kairos: {
      url: "https://public-en-kairos.node.kaia.io",
      accounts: [PRIVATE_KEY],
      chainId: 1001,
      gasPrice: 250000000000, // Increased gas price to 250 gwei
      timeout: 60000, // Longer timeout for transactions
    }
  }
};