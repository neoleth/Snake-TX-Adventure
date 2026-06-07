const { ethers } = require('ethers');
async function test() {
  const method = "get_game_state(address)";
  const selector = ethers.id(method).slice(0, 10);
  const user = "0x2b398B01efb95d2eCb8009bd0797Ae8631775B26";
  const userPadded = user.toLowerCase().replace("0x", "").padStart(64, '0');
  const data = selector + userPadded;

  const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

  const res = await fetch("https://rpc-bradbury.genlayer.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_call",
      params: [{
        to: "0x0656507AFF3D7f2Ff899D0c7c6240d6AAC9e235C",
        data: data
      }, "latest"]
    })
  });
  console.log(await res.text());
}
test();
