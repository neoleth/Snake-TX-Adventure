const { ethers } = require('ethers');
async function test() {
  const provider = new ethers.JsonRpcProvider('https://rpc-bradbury.genlayer.com');
  const d = await provider.getFeeData();
  console.log(d);
}
test();
