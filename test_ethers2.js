const { ethers } = require('ethers');

async function test() {
  const addr = '0xbc22b3e2371541e11ea0284766a8a1eb6954fef4aba8ba55dd923ec0891bad19';
  const provider = new ethers.JsonRpcProvider('https://rpc-bradbury.genlayer.com');
  const signer = new ethers.Wallet(ethers.id('test').slice(0, 66), provider);
  const ABI = ["function start_game() returns (string)"];
  
  // Can we override provider's resolveName?
  provider.resolveName = async (name) => {
    return name; // return the 32 byte hash as is!
  };
  
  const c = new ethers.Contract(addr, ABI, signer);
  console.log("Contract created successfully.");
  try {
    const tx = await c.start_game();
    console.log(tx);
  } catch (e) {
    console.log("Error:", e.message);
  }
}
test();
