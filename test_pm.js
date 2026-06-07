const { createClient, chains } = require('genlayer-js'); 
async function run() {
  const c = createClient({chain: chains.testnetBradbury}); 
  try {
    const res = await c.readContract({
      address: '0x0656507AFF3D7f2Ff899D0c7c6240d6AAC9e235C', 
      functionName: 'get_resolution_data', 
      abi: [{inputs:[],name:'get_resolution_data',outputs:[{type:'string'}],stateMutability:'view',type:'function'}]
    });
    console.log(res);
  } catch(e) { console.error(e.message); }
}
run();
