async function test() {
  const res = await fetch('https://rpc-bradbury.genlayer.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["latest", true],"id":1})
  });
  const data = JSON.parse(await res.text());
  if (data.result.transactions.length > 0) {
      console.log(data.result.transactions[0]);
  }
}
test();
