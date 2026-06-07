const { ethers } = require('ethers');

async function test() {
  const provider = new ethers.JsonRpcProvider('https://rpc-bradbury.genlayer.com');
  const b = await provider.getBlock("latest", true);
  console.log("Tx 0 object keys:", Object.keys(b.transactions[0]));
  console.log("Tx 0 object values:", b.transactions[0]);
}
test();
