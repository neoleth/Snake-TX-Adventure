const { chains, createClient } = require('genlayer-js');
console.log(Object.keys(chains));
const client = createClient();
console.log("Client keys:", Object.keys(client));
