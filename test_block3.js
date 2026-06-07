async function test() {
  const res = await fetch('https://rpc-bradbury.genlayer.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["latest", true],"id":1})
  });
  console.log(await res.text());
}
test();
