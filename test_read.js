const { chains, createClient } = require('genlayer-js');
async function test() {
  const client = createClient({ chain: chains.testnetBradbury });
  const RAW_CONTRACT_ADDRESS = "0xbc22b3e2371541e11ea0284766a8a1eb6954fef4aba8ba55dd923ec0891bad19";
  
  try {
     const res = await client.readContract({
         address: RAW_CONTRACT_ADDRESS,
         functionName: 'get_game_state',
         args: ["0x2b398b01efb95d2ecb8009bd0797ae8631775b26"]
     });
     console.log("Response:", res);
  } catch(e) { console.log(e); }
}
test();
