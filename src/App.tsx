import React, { useState, useEffect } from 'react';
import { Terminal, Gamepad2, BookOpen, Code, Wallet } from 'lucide-react';
import { PYTHON_CONTRACT, GUIDE_CONTENT } from './contractData';
import SnakeGame from './components/SnakeGame';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'guide'>('simulator');
  const [wallet, setWallet] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to play on GenLayer!");
      return;
    }
    try {
      // Switch to GenLayer Bradbury Testnet (Chain ID 4221 -> 0x107D)
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x107D' }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x107D',
              chainName: 'GenLayer Bradbury Testnet',
              nativeCurrency: { name: 'GEN', symbol: 'GEN', decimals: 18 },
              rpcUrls: ['https://rpc-bradbury.genlayer.com'],
              blockExplorerUrls: ['https://explorer-bradbury.genlayer.com']
            }]
          });
        } else {
          throw switchError;
        }
      }

      await new Promise(r => setTimeout(r, 500));

      const _provider = new ethers.BrowserProvider(window.ethereum, "any");
      await _provider.send("eth_requestAccounts", []);
      const _signer = await _provider.getSigner();
      setProvider(_provider);
      setSigner(_signer);
      setWallet(await _signer.getAddress());
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#e0e0e0] font-sans selection:bg-emerald-500/30">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between py-6 border-b border-[#2a2a2c]">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-emerald-400" />
              Snake TX Adventure
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              GenLayer Intelligent Contract Demo & Web3 Arcade
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center mt-4 sm:mt-0">
            {wallet ? (
              <div className="flex gap-6 items-center">
                <div className="text-right">
                  <p className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Network</p>
                  <p className="text-xs font-mono text-emerald-400">Bradbury Testnet</p>
                </div>
                <div className="h-8 w-px bg-zinc-800"></div>
                <div className="flex flex-col items-end">
                  <p className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Wallet</p>
                  <p className="text-xs font-mono">{wallet.substring(0, 6)}...{wallet.substring(wallet.length - 4)}</p>
                </div>
              </div>
            ) : (
              <button 
                onClick={connectWallet}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black rounded-md text-sm font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </button>
            )}

            <div className="flex bg-[#161618] rounded-lg p-1 border border-[#2a2a2c] items-center">
              <button 
                onClick={() => setActiveTab('simulator')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'simulator' 
                    ? 'bg-[#2a2a2c] text-emerald-400 shadow-sm' 
                    : 'text-zinc-400 hover:text-[#e0e0e0] hover:bg-[#2a2a2c]/50'
                }`}
              >
                <Terminal className="w-4 h-4" />
                Play Demo
              </button>
              <button 
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'code' 
                    ? 'bg-[#2a2a2c] text-emerald-400 shadow-sm' 
                    : 'text-zinc-400 hover:text-[#e0e0e0] hover:bg-[#2a2a2c]/50'
                }`}
              >
                <Code className="w-4 h-4" />
                Contract
              </button>
              <button 
                onClick={() => setActiveTab('guide')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'guide' 
                    ? 'bg-[#2a2a2c] text-emerald-400 shadow-sm' 
                    : 'text-zinc-400 hover:text-[#e0e0e0] hover:bg-[#2a2a2c]/50'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Guide
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-grow py-8">
          {activeTab === 'simulator' && (
            <div className="animate-in fade-in duration-500">
              <SnakeGame wallet={wallet} provider={provider} signer={signer} />
            </div>
          )}

          {activeTab === 'code' && (
            <div className="animate-in fade-in duration-500 flex flex-col h-[calc(100vh-16rem)] min-h-[500px]">
              <div className="flex items-center justify-between bg-[#111113] border border-[#2a2a2c] border-b-0 rounded-t-lg px-4 py-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-xs font-mono text-zinc-500">snake_contract.py</div>
              </div>
              <div className="flex-grow bg-[#161618] border border-[#2a2a2c] rounded-b-lg overflow-hidden relative">
                <pre className="absolute inset-0 p-6 overflow-auto font-mono text-sm leading-relaxed text-emerald-300">
                  <code>{PYTHON_CONTRACT}</code>
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="animate-in fade-in duration-500 max-w-3xl mx-auto space-y-8">
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-6 mb-8 text-emerald-200">
                <h2 className="text-lg font-semibold mb-2 text-emerald-400 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Documentation & Resources
                </h2>
                <p className="text-sm opacity-90 leading-relaxed text-zinc-400">
                  This documentation directly addresses your prompt requirements. It contains constructor explanations, GenLayer Bradbury Testnet deployment steps, Web3 frontend interaction models, and creative applications of GenLayer's AI Validator technology.
                </p>
              </div>

              {GUIDE_CONTENT.map((section, idx) => (
                <div key={idx} className="bg-[#161618] border border-[#2a2a2c] rounded-lg p-8">
                  <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-emerald-400 mb-4">{section.title}</h3>
                  <div className="text-zinc-300 space-y-4 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
