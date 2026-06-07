const {ethers}=require('ethers'); 
async function test() {
  const addr={getAddress:async ()=>'0xbc22b3e2371541e11ea0284766a8a1eb6954fef4aba8ba55dd923ec0891bad19'}; 
  try {
    const c=new ethers.Contract(addr, ['function foo()'], ethers.getDefaultProvider()); 
    await c.foo();
    console.log('success');
  } catch(e) { console.log(e.message); }
}
test();
