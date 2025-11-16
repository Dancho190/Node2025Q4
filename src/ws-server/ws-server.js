import { WebSocketServer, WebSocket } from "ws";
import Database from "./db.ts";
import GameLogic from "./game-logic.ts";
import Auth from "./auth.js";

const startWebSocketServer = () => {
  const wss = new WebSocketServer({ port: 3000 });
  const db = new Database();

  const send = (ws, type, data) => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type, data, id: 0 }));
    }
  };

  const broadcast = (type, data) => {
    wss.clients.forEach(c => c.readyState === WebSocket.OPEN && send(c, type, data));
  };

  const updateWinners = () => {
    broadcast("update_winners", Array.from(db.players.values())
      .map(p => ({ name: p.name, wins: p.wins }))
      .sort((a, b) => b.wins - a.wins));
  };

  const updateRooms = () => {
    broadcast("update_room", db.getAvailableRooms().map(r => ({
      roomId: r.roomId,
      roomUsers: r.players.map(pid => {
        const p = db.getPlayer(pid);
        return { name: p.name, index: p.index };
      })
    })));
  };

  wss.on("connection", (ws) => {
    ws.on("message", (message) => {
      try {
        const { type, data } = JSON.parse(message.toString());
        const d = typeof data === 'string' ? JSON.parse(data) : data;

        if (type === "reg") {
          const result = Auth.registerOrLogin(db, d.name, d.password);
          if (!result.success) {
            send(ws, "reg", { name: "", index: 0, error: true, errorText: result.error });
            return;
          }
          db.linkWs(ws, result.player.index);
          send(ws, "reg", { name: result.player.name, index: result.player.index, error: false, errorText: "" });
          updateRooms();
          updateWinners();
        }

        if (type === "create_room") {
          db.createRoom(db.getPlayerId(ws));
          updateRooms();
        }

        if (type === "add_user_to_room") {
          const room = db.getRoom(Number(d.indexRoom));
          if (room?.players.length === 1) {
            room.players.push(db.getPlayerId(ws));
            const game = db.createGame(room.roomId);
            room.players.forEach((pid, idx) => {
              const playerWs = db.getPlayerWs(pid);
              playerWs && send(playerWs, "create_game", { idGame: game.gameId, idPlayer: idx });
            });
            updateRooms();
          }
        }

        if (type === "add_ships") {
          const game = db.getGame(Number(d.gameId));
          if (game) {
            game.players.push({
              playerId: db.getPlayerId(ws),
              playerIndex: Number(d.indexPlayer),
              ships: d.ships,
              hits: new Set(),
              ws
            });
            send(ws, "start_game", { ships: d.ships, currentPlayerIndex: d.indexPlayer });
            if (game.players.length === 2) {
              game.started = true;
              game.players.forEach(gp => send(gp.ws, "turn", { currentPlayer: 0 }));
            }
          }
        }

        if (type === "attack" || type === "randomAttack") {
          const game = db.getGame(Number(d.gameId));
          if (game?.started) {
            const current = game.players.find(p => p.playerIndex === Number(d.indexPlayer));
            const opponent = game.players.find(p => p.playerIndex !== Number(d.indexPlayer));

            if (current && opponent && game.currentTurn === Number(d.indexPlayer)) {
              const x = type === "randomAttack" ? Math.floor(Math.random() * 10) : d.x;
              const y = type === "randomAttack" ? Math.floor(Math.random() * 10) : d.y;
              const status = GameLogic.checkHit(opponent.ships, opponent.hits, x, y);

              game.players.forEach(gp => send(gp.ws, "attack", {
                position: { x, y },
                currentPlayer: d.indexPlayer,
                status
              }));

              if (status === "killed") {
                const killed = GameLogic.getKilledShip(opponent.ships, opponent.hits);
                if (killed) {
                  GameLogic.getAdjacentCells(killed).forEach(cell => {
                    opponent.hits.add(cell);
                    const [ax, ay] = cell.split(",").map(Number);
                    game.players.forEach(gp => send(gp.ws, "attack", {
                      position: { x: ax, y: ay },
                      currentPlayer: d.indexPlayer,
                      status: "miss"
                    }));
                  });
                }
              }

              if (GameLogic.isGameOver(opponent.ships, opponent.hits)) {
                game.players.forEach(gp => send(gp.ws, "finish", { winPlayer: d.indexPlayer }));
                const winner = db.getPlayer(current.playerId);
                if (winner) {
                  winner.wins++;
                  updateWinners();
                }
                db.games.delete(game.gameId);
                db.rooms.delete(game.roomId);
                updateRooms();
              } else {
                if (status === "miss") game.currentTurn = game.currentTurn === 0 ? 1 : 0;
                game.players.forEach(gp => send(gp.ws, "turn", { currentPlayer: game.currentTurn }));
              }
            }
          }
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    });

    ws.on("close", () => db.wsToPlayer.delete(ws));
  });

  console.log("WebSocket server running on ws://localhost:3000");
};

export default startWebSocketServer;