async function test() {
  const addr = "0xbc22b3e2371541e11ea0284766a8a1eb6954fef4aba8ba55dd923ec0891bad19";
  const addr2 = "0xbc22b3e2371541e11ea0284766a8a1eb6954fef4";

  console.log("Full address");
  const res = await fetch('https://rpc-bradbury.genlayer.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({"jsonrpc":"2.0","method":"eth_getCode","params":[addr, "latest"],"id":1})
  });
  console.log(await res.text());

  console.log("Sliced address");
  const res2 = await fetch('https://rpc-bradbury.genlayer.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({"jsonrpc":"2.0","method":"eth_getCode","params":[addr2, "latest"],"id":2})
  });
  console.log(await res2.text());
}
test();
