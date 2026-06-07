const { chains, createClient, createAccount } = require('genlayer-js');
async function test() {
  const account = createAccount('0x2b398b01efb95d2ecb8009bd0797ae8631775b262b398b01efb95d2ecb800911');
  const client = createClient({ chain: chains.testnetBradbury, account });
  const RAW_CONTRACT_ADDRESS = "0xbc22b3e2371541e11ea0284766a8a1eb6954fef4aba8ba55dd923ec0891bad19";
  
  try {
     const res = await client.writeContract({
         address: RAW_CONTRACT_ADDRESS,
         functionName: 'make_move',
         args: ["up"]
     });
     console.log("Response:", res);
  } catch(e) { console.log(e.message); }
}
test();
