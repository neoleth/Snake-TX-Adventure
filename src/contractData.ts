export const PYTHON_CONTRACT = `
# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
import json
from typing import List, Tuple
import random

@gl.contract
class SnakeGame:
    players: TreeMap[Address, str]
    high_scores: TreeMap[Address, u256]

    def __init__(self):
        self.players = TreeMap()
        self.high_scores = TreeMap()

    @gl.public.write
    def start_game(self) -> str:
        """Starts or resets a game for the caller."""
        sender = gl.message.sender
        initial_snake = [{"x": 10, "y": 10}, {"x": 10, "y": 11}, {"x": 10, "y": 12}]
        state = {
            "snake": initial_snake,
            "direction": "up",
            "food": self._spawn_food(initial_snake),
            "score": 0,
            "status": "playing"
        }
        self.players[sender] = json.dumps(state)
        return self.players[sender]

    @gl.public.write
    def make_move(self, direction: str) -> str:
        """
        Executes a move and charges implicit gas.
        Valid directions: 'up', 'down', 'left', 'right'.
        """
        sender = gl.message.sender
        if sender not in self.players:
            return json.dumps({"error": "Game not started"})

        game = json.loads(self.players[sender])
        if game["status"] != "playing":
            return self.players[sender]

        head_x, head_y = game["snake"][0]["x"], game["snake"][0]["y"]

        if direction == "up": head_y -= 1
        elif direction == "down": head_y += 1
        elif direction == "left": head_x -= 1
        elif direction == "right": head_x += 1

        new_head = {"x": head_x, "y": head_y}

        # Check wall collisions (20x20 grid)
        if head_x < 0 or head_x >= 20 or head_y < 0 or head_y >= 20:
            game["status"] = "game_over"
            self._update_score(sender, game["score"])
            self.players[sender] = json.dumps(game)
            return self.players[sender]

        # Check self collisions
        if new_head in game["snake"]:
            game["status"] = "game_over"
            self._update_score(sender, game["score"])
            self.players[sender] = json.dumps(game)
            return self.players[sender]

        # Move snake
        game["snake"].insert(0, new_head)

        # Check food interaction
        if new_head == game["food"]:
            game["score"] += 10
            game["food"] = self._spawn_food(game["snake"])
        else:
            game["snake"].pop() # Remove tail if no food eaten
            
        self.players[sender] = json.dumps(game)
        return self.players[sender]

    @gl.public.view
    def get_game_state(self, user_address: Address) -> str:
        """Returns the current state of a player's game as JSON."""
        if user_address in self.players:
            return self.players[user_address]
        return json.dumps({"error": "No state"})

    @gl.public.view
    def get_high_score(self, user_address: Address) -> u256:
        """Returns the high score for a given user."""
        if user_address in self.high_scores:
            return self.high_scores[user_address]
        return u256(0)

    def _spawn_food(self, snake: list) -> dict:
        """Helper to spawn food outside the snake body."""
        while True:
            food = {"x": random.randint(0, 19), "y": random.randint(0, 19)}
            if food not in snake:
                return food

    def _update_score(self, user_address: Address, score: int):
        """Updates the high score for the user."""
        current_score = int(self.high_scores.get(user_address, u256(0)))
        if score > current_score:
            self.high_scores[user_address] = u256(score)
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
