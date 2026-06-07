const { chains, createClient } = require('genlayer-js');
async function test() {
  const client = createClient({ chain: chains.testnetBradbury });
  const hash = "0x0656507AFF3D7f2Ff899D0c7c6240d6AAC9e235C".toLowerCase();
  
  try {
     const res2 = await client.readContract({ 
         address: hash,
         functionName: 'get_game_state',
         args: ["0x2b398B01efb95d2eCb8009bd0797Ae8631775B26"]
     });
     console.log("get_game_state:", res2);
  } catch(e) { console.log("get_game_state error:", e.message, e); }
}
test();
