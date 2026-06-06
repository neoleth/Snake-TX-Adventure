const { ethers } = require('ethers');
const addr = '0xbc22b3e2371541e11ea0284766a8a1eb6954fef4aba8ba55dd923ec0891bad19';

console.log("length in bytes:", (addr.length - 2) / 2);
console.log("slice right 20 bytes:", ethers.dataSlice(addr, 12));
console.log("slice left 20 bytes:", ethers.dataSlice(addr, 0, 20));
