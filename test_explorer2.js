async function test() {
  const hash = "bc22b3e2371541e11ea0284766a8a1eb6954fef4aba8ba55dd923ec0891bad19";
  const urls = [
    `https://studio.genlayer.com/api/contracts`,
    `https://api-bradbury.genlayer.com/api/contracts/${hash}`
  ];
  try {
     const res = await fetch(`https://explorer-bradbury.genlayer.com/api/transactions/0x${hash}`);
     console.log(res.status, await res.text());
  } catch(e) {}
}
test();
