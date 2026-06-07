async function search() {
  const q = "metamask";
  const res = await fetch(`https://docs.genlayer.com/api/search?q=${encodeURIComponent(q)}`);
  console.log(await res.text());
}
search();
