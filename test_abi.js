const { chains } = require('genlayer-js');
const fs = require('fs');
fs.writeFileSync('abi.json', JSON.stringify(chains.testnetBradbury.consensusMainContract.abi, null, 2));
