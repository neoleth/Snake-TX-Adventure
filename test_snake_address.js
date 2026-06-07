const { ethers } = require('ethers');
async function test() {
  const provider = new ethers.JsonRpcProvider('https://rpc-bradbury.genlayer.com');
  const contract = new ethers.Contract('0x3F9f2Cf5F42A32A64A92aA52BD74911945B04214', [
    "function get_game_state(address addr) view returns (string)",
    "function score()"
  ], provider);
  try {
    const addr = ethers.getAddress("0x2b398B01efb95d2eCb8009bd0797Ae8631775B26".toLowerCase());
    console.log(await contract.get_game_state(addr));
  } catch(e) {
    console.log("get_game_state error:", e.message);
  }
}
test();
