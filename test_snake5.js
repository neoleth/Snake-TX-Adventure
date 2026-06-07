const { ethers } = require('ethers');
async function test() {
  const provider = new ethers.JsonRpcProvider('https://rpc-bradbury.genlayer.com');
  const code = await provider.getCode('0x0656507AFF3D7f2Ff899D0c7c6240d6AAC9e235C');
  console.log("Code:", code.substring(0, 50));
}
test();
