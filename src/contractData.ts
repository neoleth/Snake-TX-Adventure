export const PYTHON_CONTRACT = `
# v0.1.0 Snake Game GenLayer Contract
from genlayer import *
import json

class SnakeGame(gl.Contract):
    def __init__(self):
        self.games = {}
        self.high_scores = {}

    @gl.public.write
    def start_game(self) -> str:
        addr = str(gl.message.sender)
        self.games[addr] = {
            "snake": [{"x": 10, "y": 10}, {"x": 10, "y": 11}],
            "food": {"x": 5, "y": 5},
            "status": "playing",
            "score": 0
        }
        return json.dumps(self.games[addr])
    
    @gl.public.write
    def make_move(self, direction: str) -> str:
        addr = str(gl.message.sender)
        if addr not in self.games or self.games[addr]["status"] == "game_over":
            return json.dumps({"error": "Game not started or game over"})
            
        game = self.games[addr]
        head = game["snake"][0]
        
        nx = head["x"]
        ny = head["y"]
        if direction == "up": ny -= 1
        elif direction == "down": ny += 1
        elif direction == "left": nx -= 1
        elif direction == "right": nx += 1
        
        # Grid is 20x20
        if nx < 0 or ny < 0 or nx >= 20 or ny >= 20:
            game["status"] = "game_over"
            return json.dumps(game)
            
        # Check self collision
        for seg in game["snake"]:
            if seg["x"] == nx and seg["y"] == ny:
                game["status"] = "game_over"
                return json.dumps(game)
                
        new_head = {"x": nx, "y": ny}
        game["snake"].insert(0, new_head)
        
        # Check food
        if nx == game["food"]["x"] and ny == game["food"]["y"]:
            game["score"] += 1
            # deterministic pseudo-random food spawn
            game["food"]["x"] = (nx * 7 + 13) % 20
            game["food"]["y"] = (ny * 11 + 17) % 20
            
            if addr not in self.high_scores or int(game["score"]) > int(self.high_scores[addr]):
                self.high_scores[addr] = game["score"]
        else:
            game["snake"].pop()
            
        self.games[addr] = game
        return json.dumps(game)
        
    @gl.public.view
    def get_game_state(self, user_address: str) -> str:
        if user_address in self.games:
            return json.dumps(self.games[user_address])
        return json.dumps({"error": "No game found"})
        
    @gl.public.view
    def get_high_score(self, wallet: str) -> u256:
        if wallet in self.high_scores:
            return u256(self.high_scores[wallet])
        return u256(0)
`.trim();

export const GUIDE_CONTENT = [
  {
    title: "1. Constructor Parameters",
    content: "The constructor currently requires no parameters (\`__init__(self)\`). It internally initializes the \`players\` dictionary for isolated state tracking and an empty \`leaderboard\` list. For a more extensible real-world version, you could pass in configurable parameters like \`grid_size\` or \`base_fee_amount\` during deployment."
  },
  {
    title: "2. Deployment on Bradbury Testnet",
    content: "1. Open GenLayer Studio and create a new Intelligent Contract project.\\n2. Copy the Python code provided into your main contract file (e.g., \`contract.py\`).\\n3. Click 'Compile & Test' to ensure there are no syntax errors within the simulated environment.\\n4. Use the built-in deployer, select the \`Bradbury Testnet\`, and confirm the deployment transaction using your GenLayer wallet."
  },
  {
    title: "3. Frontend Interaction Ideas (Session Keys)",
    content: "Because every move in this design requires an on-chain transaction, presenting the user with a traditional Web3 wallet popup 5 times a second is an impossible UX. \\n\\n**Solution:** Implement **Session Keys**. The frontend should generate a temporary local keypair for the gaming session. The user signs exactly once using their main wallet to 'authorize' this temporary key for up to a designated amount of Gas/GL. The dApp then auto-signs the \`make_move\` transactions in the background as the user presses their arrow keys, creating a seamless Arcade experience."
  },
  {
    title: "4. AI Validator Tips",
    content: "GenLayer's unique AI validators provide consensus based on LLM outputs rather than strict deterministic logic. For this game, you could introduce:\\n\\n- **Bot Detection**: Have an AI method \`@gl.public.read\` evaluate the array of input timestamps and pathfinding patterns to flag accounts that use perfect bot-like logic.\\n- **Dynamic Events**: Implement a \`generate_powerup()\` prompt. Instead of RNG, ask the network's AI validators to determine the optimal next 'Food' position or provide a temporary map obstacle, basing the decision structurally on the player's recent movement history to counter their playstyle."
  }
];
