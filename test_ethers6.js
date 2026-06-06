const { ethers } = require('ethers');

async function test() {
  const addr = '0xbc22b3e2371541e11ea0284766a8a1eb6954fef4aba8ba55dd923ec0891bad19';
  
  const provider = new ethers.JsonRpcProvider('https://rpc-bradbury.genlayer.com');
  
  try {
     const rawResp = await provider.send('eth_getCode', [addr, "latest"]);
     console.log("Raw getCode:", rawResp.length);
  } catch(e) { console.log(e.message) }
}
test();
