async function test() {
  const hash = "0xbc22b3e2371541e11ea0284766a8a1eb6954fef4aba8ba55dd923ec0891bad19";
  const res = await fetch('https://rpc-bradbury.genlayer.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({"jsonrpc":"2.0","method":"eth_getTransactionByHash","params":[hash],"id":1})
  });
  console.log(await res.text());
}
test();