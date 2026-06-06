const { ethers } = require('ethers');
try {
  console.log(ethers.getAddress('0xbc22b3e2371541e11ea0284766a8a1eb6954fef4'));
} catch (e) {
  console.log(e.message);
}
