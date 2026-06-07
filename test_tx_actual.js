const { chains, createClient } = require('genlayer-js');
async function test() {
  const client = createClient({ chain: chains.testnetBradbury });
  const hash = "0xbc22b3e2371541e11ea0284766a8a1eb6954fef4aba8ba55dd923ec0891bad19";
  
  try {
     const res = await client.getTransactionReceipt({ hash });
     console.log("Transaction Receipt:", res);
  } catch(e) { console.log("getTransactionReceipt error:", e.message); }

  try {
     const res2 = await client.getTransaction({ hash });
     console.log("Transaction:", res2);
  } catch(e) { console.log("getTransaction error:", e.message); }
}
test();
