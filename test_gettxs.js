const { ethers } = require('ethers');
async function test() {
  const provider = new ethers.JsonRpcProvider('https://rpc-bradbury.genlayer.com');
  const user = "0x2b398B01efb95d2eCb8009bd0797Ae8631775B26";
  const count = await provider.getTransactionCount(user);
  console.log("Tx count for user:", count);
}
test();
