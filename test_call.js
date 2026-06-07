const { ethers } = require('ethers');

async function test() {
  const provider = new ethers.JsonRpcProvider('https://rpc-bradbury.genlayer.com');
  const RAW_CONTRACT_ADDRESS = "0xbc22b3e2371541e11ea0284766a8a1eb6954fef4aba8ba55dd923ec0891bad19";
  const CONTRACT_ADDRESS = ethers.getAddress(RAW_CONTRACT_ADDRESS.slice(0, 42));
  
  const ABI = [
      "function get_high_score(address wallet) view returns (uint256)"
  ];
  const c = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
  
  try {
     console.log("Calling get_high_score...");
     const hs = await c.get_high_score("0x2b398B01efb95d2eCb8009bd0797Ae8631775B26");
     console.log("High score:", hs);
  } catch(e) {
     console.log("Error string:", e.message);
  }
}
test();
