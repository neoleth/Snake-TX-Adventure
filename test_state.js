const { ethers } = require('ethers');
async function test() {
  const provider = new ethers.JsonRpcProvider('https://rpc-bradbury.genlayer.com');
  const RAW_CONTRACT_ADDRESS = "0xbc22b3e2371541e11ea0284766a8a1eb6954fef4aba8ba55dd923ec0891bad19";
  const CONTRACT_ADDRESS = ethers.getAddress(RAW_CONTRACT_ADDRESS.slice(0, 42));
  const ABI = ["function get_game_state(address wallet) view returns (string)"];
  const c = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
  try {
     console.log(await c.get_game_state("0x2b398b01efb95d2ecb8009bd0797ae8631775b26"));
  } catch(e) {
     console.log("Error object:", e);
  }
}
test();
