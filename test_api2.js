async function test() {
  console.log(await (await fetch('https://studio.genlayer.com/api/contracts/bc22b3e2371541e11ea0284766a8a1eb6954fef4aba8ba55dd923ec0891bad19')).text());
}
test();
