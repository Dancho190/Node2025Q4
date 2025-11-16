export class Database {
  players = new Map();
  rooms = new Map();
  games = new Map();
  wsToPlayer = new Map();
  
  playerIdCounter = 1;
  roomIdCounter = 1;
  gameIdCounter = 1;

  createPlayer(name: string, password: string) {
    const player = {
      name,
      password,
      index: this.playerIdCounter++,
      wins: 0
    };
    this.players.set(player.index, player);
    return player;
  }

  findPlayer(name: string, password: string) {
    return Array.from(this.players.values()).find(
      p => p.name === name && p.password === password
    );
  }

  getPlayer(id: number) {
    return this.players.get(id);
  }

  createRoom(playerId: number) {
    const room = {
      roomId: this.roomIdCounter++,
      players: [playerId]
    };
    this.rooms.set(room.roomId, room);
    return room;
  }

  getRoom(roomId: number) {
    return this.rooms.get(roomId);
  }

  getAvailableRooms() {
    return Array.from(this.rooms.values()).filter(r => r.players.length === 1);
  }

  createGame(roomId: number) {
    const game = {
      gameId: this.gameIdCounter++,
      roomId,
      players: [],
      currentTurn: 0,
      started: false
    };
    this.games.set(game.gameId, game);
    return game;
  }

  getGame(gameId: number) {
    return this.games.get(gameId);
  }

  linkWs(ws: WebSocket, playerId: number) {
    this.wsToPlayer.set(ws, playerId);
  }

  getPlayerId(ws: WebSocket) {
    return this.wsToPlayer.get(ws);
  }

  getPlayerWs(playerId: number) {
    for (const [ws, pid] of this.wsToPlayer.entries()) {
      if (pid === playerId) return ws;
    }
    return null;
  }
}