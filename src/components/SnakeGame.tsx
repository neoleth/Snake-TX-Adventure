import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Activity } from 'lucide-react';
import { ethers } from 'ethers';

const GRID_SIZE = 20;

const CONTRACT_ADDRESS = ethers.getAddress("0x0656507AFF3D7f2Ff899D0c7c6240d6AAC9e235C");
const ABI = [
  "function start_game() returns (string)",
  "function make_move(string direction) returns (string)",
  "function get_game_state(string user_address) view returns (string)",
  "function get_high_score(string wallet) view returns (uint256)"
];

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

type TxLog = {
  id: string;
  msg: string;
  type: 'info' | 'success' | 'warn' | 'error';
  timestamp: string;
};

interface SnakeGameProps {
  wallet: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
}

export default function SnakeGame({ wallet, provider, signer }: SnakeGameProps) {
  const [snake, setSnake] = useState<Point[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [status, setStatus] = useState<'idle' | 'playing' | 'game_over'>('idle');
  const [score, setScore] = useState(0);
  const [logs, setLogs] = useState<TxLog[]>([]);
  const [isPendingTx, setIsPendingTx] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((msg: string, type: TxLog['type'] = 'info') => {
    setLogs((prev) => {
      const newLogs = [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          msg,
          type,
          timestamp: new Date().toISOString().split('T')[1].slice(0, 12),
        },
      ];
      return newLogs.slice(-50);
    });
  }, []);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Fetch initial state if connected
  useEffect(() => {
    async function fetchState() {
      if (wallet && provider) {
        try {
          const iface = new ethers.Interface(ABI);
          const data = iface.encodeFunctionData("get_game_state", [wallet]);
          const result = await window.ethereum.request({
            method: 'eth_call',
            params: [{ to: CONTRACT_ADDRESS, data }, "latest"]
          });
          if (!result || result === "0x") return;
          const stateJsonStr = iface.decodeFunctionResult("get_game_state", result)[0];
          
          const state = JSON.parse(stateJsonStr);
          if (!state.error) {
            setSnake(state.snake);
            setFood(state.food);
            setScore(state.score || 0);
            setStatus(state.status === 'playing' ? 'playing' : 'game_over');
          }
        } catch (e) {
          console.error("No active state found", e);
        }
      }
    }
    fetchState();
  }, [wallet, provider]);

  const startGame = async () => {
    if (!signer || !wallet) {
      alert("Please connect your wallet first.");
      return;
    }
    try {
      setIsPendingTx(true);
      addLog('Initiating start_game() TX...', 'info');
      const iface = new ethers.Interface(ABI);
      
      const data = iface.encodeFunctionData("start_game", []);
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{ from: wallet, to: CONTRACT_ADDRESS, data }]
      });
      addLog(`TX Submitted: ${txHash.slice(0, 10)}...`, 'warn');
      
      // Manual poll for receipt to bypass ethers formatting errors
      addLog(`Waiting for TX Confirmation...`, 'info');
      let receipt = null;
      const MAX_ATTEMPTS = 45;
      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        receipt = await window.ethereum.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash]
        });
        if (receipt !== null) break;
        await new Promise(res => setTimeout(res, 2000));
      }
      
      if (receipt === null) {
        addLog(`TX timed out (dropped from mempool): ${txHash.slice(0, 10)}...`, 'error');
        return;
      }
      
      if (receipt.status === "0x0" || receipt.status === 0) {
        addLog(`TX Reverted in Block ${receipt.blockNumber}. Check contract state.`, 'error');
        return;
      }
      
      addLog(`TX Confirmed in Block: ${receipt.blockNumber}`, 'success');
      
      // Fetch new state immediately
      const callData = iface.encodeFunctionData("get_game_state", [wallet]);
      const callResult = await window.ethereum.request({
        method: 'eth_call',
        params: [{ to: CONTRACT_ADDRESS, data: callData }, "latest"]
      });
      if (callResult && callResult !== "0x") {
        const stateJsonStr = iface.decodeFunctionResult("get_game_state", callResult)[0];
        const state = JSON.parse(stateJsonStr);
        setSnake(state.snake);
        setFood(state.food);
        setScore(0);
        setStatus('playing');
      }
    } catch (error: any) {
      let errMsg = error.error?.message || error.message || 'Unknown error';
      if ((typeof errMsg === 'string' && errMsg.includes("RPC endpoint not found")) || error.code === "UNKNOWN_ERROR" || error.code === -32002) {
         errMsg += " (⚠️ Your MetaMask appears to have a dead RPC URL configured. Please open MetaMask -> Settings -> Networks, find 'GenLayer Bradbury Testnet', and update the RPC URL to 'https://rpc-bradbury.genlayer.com' or delete the network and let the app re-add it.)";
      }
      addLog(`TX Failed: ${errMsg}`, 'error');
    } finally {
      setIsPendingTx(false);
    }
  };

  const handleMakeMove = useCallback(async (dirString: string) => {
    if (!signer || !wallet || isPendingTx || status !== 'playing') return;
    
    try {
      setIsPendingTx(true);
      addLog(`TX make_move('${dirString}') pending signature...`, 'info');
      const iface = new ethers.Interface(ABI);
      
      const data = iface.encodeFunctionData("make_move", [dirString]);
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{ from: wallet, to: CONTRACT_ADDRESS, data }]
      });
      addLog(`TX Submitted: ${txHash.slice(0, 10)}...`, 'warn');
      
      // Manual poll for receipt
      let receipt = null;
      const MAX_ATTEMPTS = 45;
      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        receipt = await window.ethereum.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash]
        });
        if (receipt !== null) break;
        await new Promise(res => setTimeout(res, 2000));
      }

      if (receipt === null) {
        addLog(`TX timed out (dropped from mempool): ${txHash.slice(0, 10)}...`, 'error');
        return;
      }

      if (receipt.status === "0x0" || receipt.status === 0) {
        addLog(`TX Reverted in Block ${receipt.blockNumber}. Check contract state.`, 'error');
        return;
      }

      addLog(`TX Confirmed [${dirString}]`, 'success');
      
      // Fetch the updated state
      const callData = iface.encodeFunctionData("get_game_state", [wallet]);
      const callResult = await window.ethereum.request({
        method: 'eth_call',
        params: [{ to: CONTRACT_ADDRESS, data: callData }, "latest"]
      });
      if (callResult && callResult !== "0x") {
        const stateJsonStr = iface.decodeFunctionResult("get_game_state", callResult)[0];
        const state = JSON.parse(stateJsonStr);
        
        setSnake(state.snake);
        setFood(state.food);
        setScore(state.score || 0);
        if (state.status === 'game_over') {
          setStatus('game_over');
          addLog(`Game Over! Final Score: ${state.score || 0}`, 'error');
        }
      }
      
    } catch (error: any) {
      let errMsg = error.error?.message || error.message || 'Unknown error';
      if ((typeof errMsg === 'string' && errMsg.includes("RPC endpoint not found")) || error.code === "UNKNOWN_ERROR" || error.code === -32002) {
         errMsg += " (⚠️ Your MetaMask appears to have a dead RPC URL configured. Please open MetaMask -> Settings -> Networks, find 'GenLayer Bradbury Testnet', and update the RPC URL to 'https://rpc-bradbury.genlayer.com' or delete the network and let the app re-add it.)";
      }
      addLog(`TX Failed: ${errMsg}`, 'error');
    } finally {
      setIsPendingTx(false);
    }
  }, [signer, wallet, isPendingTx, status, addLog]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
      }

      if (status !== 'playing' || isPendingTx) return;

      const keyMap: Record<string, string> = {
        ArrowUp: 'up', w: 'up', W: 'up',
        ArrowDown: 'down', s: 'down', S: 'down',
        ArrowLeft: 'left', a: 'left', A: 'left',
        ArrowRight: 'right', d: 'right', D: 'right',
      };

      const newDir = keyMap[e.key];
      if (newDir) {
        handleMakeMove(newDir);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, isPendingTx, handleMakeMove]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Game Board UI */}
      <div className="lg:col-span-2 flex flex-col items-center">
        <div className="w-full max-w-[500px] mb-4 flex justify-between items-center bg-[#161618] border border-[#2a2a2c] p-4 rounded-xl shadow-lg">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-zinc-400 mb-1 font-bold tracking-widest">
              On-Chain Score
            </span>
            <span className="text-3xl font-mono text-emerald-500">{score}</span>
          </div>
          <div className="flex items-center gap-4">
            {status === 'idle' || status === 'game_over' ? (
              <button
                onClick={startGame}
                disabled={isPendingTx || !wallet}
                className={`flex items-center gap-2 font-bold px-6 py-2.5 rounded-lg transition-colors ${
                  isPendingTx || !wallet ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950'
                }`}
              >
                {status === 'game_over' ? <RotateCcw className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                {status === 'game_over' ? 'Play Again (TX)' : 'Start Game (TX)'}
              </button>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-[#111113] rounded-lg text-emerald-400 border border-emerald-500/20">
                <div className={`w-2 h-2 rounded-full ${isPendingTx ? 'bg-yellow-500' : 'bg-emerald-500'} animate-pulse`} />
                <span className="text-sm font-medium tracking-wide">
                  {isPendingTx ? 'TX Pending...' : 'Session Active'}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="relative bg-[#161618] p-2 sm:p-4 rounded-2xl border border-[#2a2a2c] shadow-2xl">
          <div
            className={`grid bg-black border border-[#2a2a2c] relative overflow-hidden transition-opacity duration-300 ${isPendingTx ? 'opacity-50' : 'opacity-100'}`}
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
              width: 'min(90vw, 500px)',
              height: 'min(90vw, 500px)',
              backgroundImage: 'radial-gradient(#1a1a1c 1px, transparent 1px)',
              backgroundSize: '25px 25px',
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
              const x = i % GRID_SIZE;
              const y = Math.floor(i / GRID_SIZE);

              const isHead = snake[0].x === x && snake[0].y === y;
              const isBody = snake.some((s, idx) => idx !== 0 && s.x === x && s.y === y);
              const isFood = food.x === x && food.y === y;

              let cellClasses = 'w-full h-full border border-[#1a1a1c]/50 transition-all ';

              if (isHead) {
                cellClasses += 'bg-emerald-500/80 rounded-sm shadow-[0_0_20px_rgba(16,185,129,0.5)] border border-white z-10 relative ';
              } else if (isBody) {
                cellClasses += 'bg-emerald-500/40 rounded-sm';
              } else if (isFood) {
                cellClasses += 'bg-red-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.8)]';
              }

              return <div key={i} className={cellClasses} />;
            })}
          </div>

          {status === 'game_over' && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0a0b]/80 rounded-2xl backdrop-blur-sm">
              <h2 className="text-4xl font-bold text-red-500 mb-2 drop-shadow-lg">GAME OVER</h2>
              <p className="text-emerald-300 font-medium font-mono text-lg mb-6">Final Score: {score}</p>
              <button
                onClick={startGame}
                disabled={isPendingTx}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold px-8 py-3 rounded-lg transition-colors text-lg disabled:opacity-50"
              >
                <RotateCcw className="w-5 h-5" />
                Play Again (TX)
              </button>
            </div>
          )}
          
          {isPendingTx && status === 'playing' && (
             <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0a0b]/40 rounded-2xl backdrop-blur-sm pointer-events-none">
               <div className="flex flex-col items-center gap-3">
                 <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                 <p className="text-emerald-400 font-mono text-sm tracking-widest uppercase">Waiting for TX...</p>
               </div>
             </div>
          )}
        </div>

        {/* Mobile controls hints */}
        <p className="mt-6 text-sm text-zinc-500 flex items-center justify-center gap-2">
           Use <kbd className="px-2 py-1 bg-[#161618] border border-[#2a2a2c] rounded text-emerald-400 font-mono">WASD</kbd> or 
           <kbd className="px-2 py-1 bg-[#161618] border border-[#2a2a2c] rounded text-emerald-400 font-mono">Arrows</kbd> to move.
        </p>
      </div>

      {/* Simulator Terminal Sidebar */}
      <div className="flex flex-col h-[600px] bg-[#161618] rounded-xl border border-[#2a2a2c] shadow-xl overflow-hidden">
        <div className="bg-[#111113] px-4 py-3 border-b border-[#2a2a2c] flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-500" />
          <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-zinc-500">Live TX Explorer</h3>
        </div>
        <div className="flex-grow p-4 overflow-y-auto font-mono text-xs space-y-3 relative">
          {logs.length === 0 ? (
            <div className="text-zinc-600 italic h-full flex items-center justify-center">
              Waiting for wallet connection & session start...
            </div>
          ) : (
            logs.map((log) => {
              const colorMap = {
                info: 'text-cyan-400',
                success: 'text-emerald-400',
                warn: 'text-yellow-400',
                error: 'text-red-400',
              };
              // Parse out transaction hash to make it a link if possible
              const match = log.msg.match(/(0x[a-fA-F0-9]{10,})/);
              return (
                <div key={log.id} className="flex gap-3 bg-black/40 p-2 rounded border border-white/5 animate-in slide-in-from-left-2 fade-in">
                  <span className="text-zinc-500 shrink-0">[{log.timestamp}]</span>
                  <span className={`break-words ${colorMap[log.type]}`}>
                     {log.msg}
                  </span>
                </div>
              );
            })
          )}
          <div ref={logsEndRef} />
        </div>
        <div className="bg-[#111113] border-t border-[#2a2a2c] p-3 text-xs text-zinc-500 flex justify-between">
          <span>Network: Bradbury Validation</span>
          <span>GenLayer</span>
        </div>
      </div>
    </div>
  );
}
