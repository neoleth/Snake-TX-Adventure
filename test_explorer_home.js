async function test() {
  const res = await fetch(`https://explorer-bradbury.genlayer.com`);
  const body = await res.text();
  console.log(body.substring(0, 1000));
}
test();
