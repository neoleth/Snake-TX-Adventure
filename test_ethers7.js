const { ethers } = require('ethers');

async function test() {
  const provider = new ethers.JsonRpcProvider('https://rpc-bradbury.genlayer.com');
  const code = await provider.getCode('0x0000000000000000000000000000000000000000');
  console.log("Empty:", code);
  
  // Try to find ANY contract from the leaderboard... wait. What if I can just send a tx to it?
}
test();
