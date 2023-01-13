const { Buffer } = require("buffer");
const snarkjs = require("snarkjs");
const crypto = require("crypto");
const { ethers } = require("ethers");
const assert = require("assert");

require('dotenv').config();
const { env } =  process;
const { BigNumber } = ethers;


class Sha256 {
	static sizeBuf = 16;

	constructor(nullifier, secret) {
		assert(Buffer.isBuffer(nullifier), "Sha256(nullifierBuffer,secretBuffer)")
		assert(Buffer.isBuffer(secret), "Sha256(nullifierBuffer,secretBuffer)")

		assert(nullifier.length === Sha256.sizeBuf, "Buf size === 16")
		assert(secret.length === Sha256.sizeBuf, "Buf size === 16")

		this.nullifier = nullifier;
		this.secret = secret;
	}

	#revBits(b) {
		b = (b & 0xF0) >> 4 | (b & 0x0F) << 4;
		b = (b & 0xCC) >> 2 | (b & 0x33) << 2;
		b = (b & 0xAA) >> 1 | (b & 0x55) << 1;
		return b;
	}

	shaCryptoLib() {
		const n = Buffer.from(this.nullifier).reverse().map(x=>this.#revBits(x)); //endianness
		const s = Buffer.from(this.secret).reverse().map(x=>this.#revBits(x)); // endianness
		const input = Buffer.concat([n, s]);
		const hash = crypto.createHash('sha256').update(input).digest('hex');
		const hashBuf = Buffer.from(hash, 'hex').reverse().map(x=>this.#revBits(x)); // endianness
		return BigNumber.from('0x'+hashBuf.toString('hex')).mod(env.PRIME).toString(); // prime field
	}

	async shaCircom() {
		const {
			proof,
			publicSignals
		} = await snarkjs.groth16.fullProve(
			{
				nullifier: BigNumber.from(this.nullifier).toString(),
				secret: BigNumber.from(this.secret).toString()
			},
			`${env.GENERATOR_DIR}main.wasm`,
			`${env.BUILD_DIR}keys_final.zkey`,
		);

		return {
			proof: proof,
			publicSignals: publicSignals
		};
	}
}

module.exports = Sha256
