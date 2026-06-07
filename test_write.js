const { chains, createClient } = require('genlayer-js');
async function test() {
  const client = createClient({ chain: chains.testnetBradbury });
  const RAW_CONTRACT_ADDRESS = "0xbc22b3e2371541e11ea0284766a8a1eb6954fef4aba8ba55dd923ec0891bad19";
  
  try {
     const res = await client.writeContract({
         address: RAW_CONTRACT_ADDRESS,
         functionName: 'make_move',
         args: ["up"]
     });
     console.log("Response:", res);
  } catch(e) { console.log(Object.keys(e), e.name, e.message); }
}
test();
