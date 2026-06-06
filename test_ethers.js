const { ethers } = require('ethers');

try {
  const addr = '0xbc22b3e2371541e11ea0284766a8a1eb6954fef4aba8ba55dd923ec0891bad19';
  console.log("Is Address:", ethers.isAddress(addr));
  
  // Can we make a contract?
  const ABI = ["function start_game()"];
  const provider = ethers.getDefaultProvider();
  
  // Ethers v6 contract
  const c = new ethers.Contract(addr, ABI, provider);
  console.log("Contract created successfully.");
} catch (e) {
  console.error("Error creating contract:", e.message);
}
