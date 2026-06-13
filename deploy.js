import { chains, createClient, createAccount } from 'genlayer-js';
import * as fs from 'fs';

async function deploy() {
  const code = fs.readFileSync('src/contractData.ts', 'utf8').split('export const PYTHON_CONTRACT = `')[1].split('`.trim();')[0];
  console.log("Contract code length:", code.length);

  try {
    const account = createAccount();
    console.log("Generated account:", account.address);
    const client = createClient({ chain: chains.testnetBradbury, account });
    const hash = await client.deployContract({
      code: code,
      args: []
    });
    console.log("Deployed contract:", hash);
  } catch (e) {
    console.error("Deploy error:", e);
  }
}
deploy();
