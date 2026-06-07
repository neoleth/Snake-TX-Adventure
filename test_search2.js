async function test() {
  const hash = "bc22b3e2371541e11ea0284766a8a1eb6954fef4aba8ba55dd923ec0891bad19";
  const res = await fetch(`https://explorer-bradbury.genlayer.com/api/search?q=${hash}`);
  console.log(await res.text());
}
test();
