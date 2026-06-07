async function test() {
  const res = await fetch('https://rpc-bradbury.genlayer.com', {
    method: 'OPTIONS'
  });
  console.log(res.status, res.headers.get('access-control-allow-origin'));
}
test();
