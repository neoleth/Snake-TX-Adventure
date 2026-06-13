const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
fetch('https://rpc-bradbury.genlayer.com', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_getCode',
    params: ['0xdc043eae0d32573b9ad98c4e4e151d04ea8a57dcada202dcd50aa53cc3121d7b', 'latest']
  })
}).then(res => res.json()).then(data => console.log('32-byte:', JSON.stringify(data, null, 2))).catch(console.error);

fetch('https://rpc-bradbury.genlayer.com', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 2,
    method: 'eth_getCode',
    params: ['0xdc043eae0d32573b9ad98c4e4e151d04ea8a57dc', 'latest']
  })
}).then(res => res.json()).then(data => console.log('20-byte:', JSON.stringify(data, null, 2))).catch(console.error);
