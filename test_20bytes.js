const { ethers } = require('ethers');

async function test() {
  const provider = new ethers.JsonRpcProvider('https://rpc-bradbury.genlayer.com');
  const RAW_CONTRACT_ADDRESS = "0xbc22b3e2371541e11ea0284766a8a1eb6954fef4aba8ba55dd923ec0891bad19";
  
  const right20 = '0x' + RAW_CONTRACT_ADDRESS.slice(-40);
  const left20 = RAW_CONTRACT_ADDRESS.slice(0, 42);

  try {
      console.log("Right 20:", right20, 'code:', await provider.getCode(right20));
  } catch(e) { console.log(e.message) }

  try {
      console.log("Left 20:", left20, 'code:', await provider.getCode(left20));
  } catch(e) {}
}
test();
