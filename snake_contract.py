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
