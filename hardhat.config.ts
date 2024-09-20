import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/config";
require("dotenv").config();

const privateKeyOwner = process.env.PRIVATE_KEY_OWNER || "";
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const ETHERSCAN_API = process.env.ETHERSCAN_API;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.22",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API,
  },

  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "HTTP://127.0.0.1:8545",
    },
    ethereum: {
      url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
      chainId: 1,
      accounts: [privateKeyOwner],
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      chainId: 11155111,
      accounts: [privateKeyOwner],
    },
  },
  ignition: {
    blockPollingInterval: 1000,
    timeBeforeBumpingFees: 3 * 6 * 1000,
    maxFeeBumps: 4,
  },
};
export default config;
