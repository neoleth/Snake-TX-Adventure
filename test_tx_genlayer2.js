const { ethers } = require('ethers');

async function test() {
  const provider = new ethers.JsonRpcProvider('https://rpc-bradbury.genlayer.com');
  const signer = new ethers.Wallet(ethers.id('fake').slice(0, 66), provider);
  
  const RAW_CONTRACT_ADDRESS = "0xbc22b3e2371541e11ea0284766a8a1eb6954fef4aba8ba55dd923ec0891bad19";
  const CONTRACT_ADDRESS = ethers.getAddress(RAW_CONTRACT_ADDRESS.slice(0, 42));
  
  const ABI = ["function start_game() returns (string)"];
  const c = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  
  try {
     const tx = await c.start_game({ gasLimit: 800000 }); // without maxFeePerGas: 0
     console.log(tx);
  } catch(e) {
     console.log("Error string:", e.message);
  }
}
test();
