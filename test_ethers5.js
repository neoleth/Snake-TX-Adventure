const { ethers } = require('ethers');

async function test() {
  const addr = '0xbc22b3e2371541e11ea0284766a8a1eb6954fef4aba8ba55dd923ec0891bad19';
  const provider = new ethers.JsonRpcProvider('https://rpc-bradbury.genlayer.com');
  
  const addrLeft = addr.slice(0, 42);
  const addrRight = '0x' + addr.slice(-40);
  
  try {
    const codeL = await provider.getCode(addrLeft);
    console.log("Left code:", codeL.length);
  } catch(e) { console.log(e.message) }
  
  try {
    const codeR = await provider.getCode(addrRight);
    console.log("Right code:", codeR.length);
  } catch(e) { console.log(e.message) }
}
test();
