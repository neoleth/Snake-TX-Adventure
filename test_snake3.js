const { ethers } = require('ethers');
async function test() {
  const provider = new ethers.JsonRpcProvider('https://rpc-bradbury.genlayer.com');
  const contract = new ethers.Contract('0x0656507AFF3D7f2Ff899D0c7c6240d6AAC9e235C', [
    "function get_game_state(address addr) view returns (string)",
    "function get_high_score(address addr) view returns (uint256)"
  ], provider);
  try {
    const addr = ethers.getAddress("0x2b398B01efb95d2eCb8009bd0797Ae8631775B26".toLowerCase());
    console.log(await contract.get_game_state(addr));
    console.log(await contract.get_high_score(addr));
  } catch(e) {
    console.log("error:", e.message);
  }
}
test();
