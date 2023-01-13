pragma circom 2.0.0;
include "../node_modules/circomlib/circuits/sha256/sha256.circom";
include "../node_modules/circomlib/circuits/bitify.circom";


template Hash() {
	signal input nullifier;
	signal input secret;
	signal output hash;

	component nullifierBits = Num2Bits(128);
	component secretBits = Num2Bits(128);
	nullifierBits.in <== nullifier;
	secretBits.in <== secret;

	component sha256 = Sha256(256);
	for (var i=0; i<128; i++) { 
		sha256.in[i] <== nullifierBits.out[i];
		sha256.in[i+128] <== secretBits.out[i];
	}

	component hashBits = Bits2Num(256);
	for (var i=0; i<256; i++) hashBits.in[i] <== sha256.out[i];
	
	hash <== hashBits.out;
}

component main {public [nullifier]} = Hash();
