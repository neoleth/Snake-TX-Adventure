const { chains, createClient, createAccount } = require('genlayer-js');
async function test() {
  const account = createAccount('0x2b398b01efb95d2ecb8009bd0797ae8631775b262b398b01efb95d2ecb800911');
  const client = createClient({ chain: chains.testnetBradbury, account });
  const hash = "0x0656507AFF3D7f2Ff899D0c7c6240d6AAC9e235C";
  
  try {
     const res2 = await client.simulateContract({ 
         address: hash,
         abi: [{ "name": "start_game", "outputs": [{"type": "string"}], "stateMutability": "nonpayable", "type": "function", "inputs": [] }],
         functionName: 'start_game'
     });
     console.log("start_game success:", res2);
  } catch(e) { console.log("start_game error:", e.message); }
}
test();
