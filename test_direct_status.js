const { ethers } = require('ethers');
async function test() {
  const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
  for (const method of ["get_status()", "score()", "get_resolution_data()"]) {
    const selector = ethers.id(method).slice(0, 10);
    const res = await fetch("https://rpc-bradbury.genlayer.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0", id: 1, method: "eth_call",
        params: [{ to: "0x0656507AFF3D7f2Ff899D0c7c6240d6AAC9e235C", data: selector }, "latest"]
      })
    });
    console.log(method, await res.text());
  }
}
test();
