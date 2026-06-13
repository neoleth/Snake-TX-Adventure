const { createClient, chains } = require('genlayer-js');
async function test() {
  const c = createClient({chain: chains.testnetBradbury});
  try {
    const tx = await c.getTransaction({hash: '0xdc043eae0d32573b9ad98c4e4e151d04ea8a57dcada202dcd50aa53cc3121d7b'});
    console.log(tx);
  } catch(e) { console.error(e); }
}
test();
