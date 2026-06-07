async function test() {
  const res = await fetch("https://docs.genlayer.com");
  console.log((await res.text()).substring(0, 500));
}
test();
