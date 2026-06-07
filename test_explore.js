async function test() {
  const user = "0x2b398b01efb95d2ecb8009bd0797ae8631775b26";
  const urls = [
      `https://explorer-bradbury.genlayer.com/api/address/${user}/transactions`,
      `https://explorer-bradbury.genlayer.com/api/transactions?address=${user}`
  ];
  for (const url of urls) {
      try {
          const res = await fetch(url);
          console.log(url, res.status, (await res.text()).slice(0, 200));
      } catch(e) {}
  }
}
test();
