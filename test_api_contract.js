async function test() {
  const hash = "0x0656507AFF3D7f2Ff899D0c7c6240d6AAC9e235C";
  const url = `https://explorer-bradbury.genlayer.com/api/address/${hash}/transactions`;
  const res = await fetch(url);
  console.log("Status:", res.status);
  console.log(await res.text());
}
test();
