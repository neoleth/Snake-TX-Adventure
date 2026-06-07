const { ethers } = require('ethers');

async function test() {
  const provider = new ethers.JsonRpcProvider('https://rpc-bradbury.genlayer.com');

  // Let's get the latest block and look at a transaction.
  const b = await provider.getBlock("latest", true);
  console.log("Tx count:", b.transactions.length);
  if (b.transactions.length > 0) {
     console.log("Tx 0 'to':", b.transactions[0].to);
  }
}
test();
