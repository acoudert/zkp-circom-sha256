//require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");
require("hardhat-abi-exporter");
require("@nomiclabs/hardhat-etherscan");
require('hardhat-contract-sizer');


module.exports = {
	solidity: {
		compilers: [
			{
				version: "0.6.11",
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				},
			},
		],
	},
	abiExporter: {
		path: "./abis",
		runOnCompile: true,
		clear: true,
		flat: false,
		pretty: false,
	},
	networks: {
		hardhat : {
			forking: {
				url: "https://api.avax-test.network/ext/bc/C/rpc", // avalanche fuji
				chainId: 31337,
			},
			mining: {
				//auto: true,
				//interval: 1000,
			}
		},
	},
	//etherscan: {
	//	apiKey: "" // avalanche
	//},
};

