const snarkjs = require("snarkjs");
const crypto = require("crypto");
const Sha256 = require("./Sha256");
const { BigNumber } = ethers;


async function deploy() {
	const verifier = await (await ethers.getContractFactory("Verifier")).deploy();
	await verifier.deployed();
	return verifier
}

function randomSha256() {
	const nullifier = crypto.randomBytes(Sha256.sizeBuf);
	const secret = crypto.randomBytes(Sha256.sizeBuf);
	return new Sha256(nullifier, secret);
}

async function main() {
	const verifier = await deploy();

	const sha = randomSha256();
	
	console.log(`nullifier           = 0x${sha.nullifier.toString('hex')}`)
	console.log(`secret              = 0x${sha.secret.toString('hex')}`)

	const hashCryptoLib = sha.shaCryptoLib()
	console.log(`hash crypto lib     = ${BigNumber.from(hashCryptoLib).toHexString()}`)

	const { proof, publicSignals } = await sha.shaCircom()
	const hashCircomCircuit = publicSignals[0]
	console.log(`hash circom circuit = ${BigNumber.from(hashCircomCircuit).toHexString()}`)

	let args = await snarkjs.groth16.exportSolidityCallData(proof, publicSignals)
	args = JSON.parse('['+args+']')
	console.log(`is valid proof      = ${await verifier.verifyProof(...args)}`)
}

main()
	.then(_ => process.exit(0))
	.catch((error) => {
 		console.error(error);
		process.exit(1)
	});
