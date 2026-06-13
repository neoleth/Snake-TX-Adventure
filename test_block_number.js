async function test() {
  const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
  const res = await fetch("https://rpc-bradbury.genlayer.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_blockNumber", params: [] })
  });
  console.log("eth_blockNumber:", await res.text());
}
test();
