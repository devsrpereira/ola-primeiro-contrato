require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {},
    // rede de exemplo para deploy - adicione sua URL/PRIVATE_KEY quando quiser deployar em testnet
    /*
    goerli: {
      url: process.env.GOERLI_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
    */
  },
    mocha: {
    timeout: 200000,
    exit: true   // <-- força saída do processo de testes
  }
};
