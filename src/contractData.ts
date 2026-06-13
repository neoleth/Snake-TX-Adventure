export const PYTHON_CONTRACT = `
# v0.2.16
# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
import typing


class SnakeGame(gl.Contract):

    game_state: str
    high_score: u256

    def __init__(self):
        self.game_state = ""
        self.high_score = u256(0)

    @gl.public.write
    def start_game(self) -> str:

        self.game_state = """
        {
            "snake":[
                {"x":10,"y":10},
                {"x":10,"y":11},
                {"x":10,"y":12}
            ],
            "food":{"x":5,"y":5},
            "status":"playing",
            "score":0,
            "moves":0
        }
        """

        return self.game_state

    @gl.public.view
    def get_game_state(self) -> str:
        return self.game_state

    @gl.public.view
    def get_high_score(self) -> u256:
        return self.high_score
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
