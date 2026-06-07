const { chains, createClient } = require('genlayer-js');
async function test() {
  const client = createClient({ chain: chains.testnetBradbury });
  const hash = "0xbc22b3e2371541e11ea0284766a8a1eb6954fef4aba8ba55dd923ec0891bad19";
  
  try {
     const res = await client.getTransaction({ hash });
     console.log("From:", res.from);
     
     // let's fetch all deployment txs from this user? Or maybe check the last few txs for contracts
  } catch(e) { console.log(e.message); }
}
test();
