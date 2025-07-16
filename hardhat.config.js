require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    bnbTestnet: {
        url: "https://bsc-testnet-rpc.publicnode.com",
      accounts: process.env.PRIVATE_KEY !== undefined ? [`0xa0a40822d380391d9709c85f743bf0ce4b0a0275ffed62367d3b89b4c9c673be`] : [],
      chainId: 97,
    },
  }
};