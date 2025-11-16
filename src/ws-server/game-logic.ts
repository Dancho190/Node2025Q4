export class GameLogic {
  
  static getCellKey(x: number, y: number) {
    return `${x},${y}`;
  }

  static getShipCells(ship: any) {
    const cells = [];
    for (let i = 0; i < ship.length; i++) {
      const x = ship.direction ? ship.position.x + i : ship.position.x;
      const y = ship.direction ? ship.position.y : ship.position.y + i;
      cells.push(this.getCellKey(x, y));
    }
    return cells;
  }

  static isShipKilled(ship: any, hits: Set<string>) {
    return this.getShipCells(ship).every(cell => hits.has(cell));
  }

  static getAdjacentCells(ship: any) {
    const adjacent = [];
    const startX = ship.position.x;
    const startY = ship.position.y;
    const endX = ship.direction ? startX + ship.length - 1 : startX;
    const endY = ship.direction ? startY : startY + ship.length - 1;

    for (let x = startX - 1; x <= endX + 1; x++) {
      for (let y = startY - 1; y <= endY + 1; y++) {
        if (x >= 0 && x < 10 && y >= 0 && y < 10) {
          const cell = this.getCellKey(x, y);
          if (!this.getShipCells(ship).includes(cell)) {
            adjacent.push(cell);
          }
        }
      }
    }
    return adjacent;
  }

  static checkHit(ships: any[], hits: Set<string>, x: number, y: number) {
    const cellKey = this.getCellKey(x, y);
    
    for (const ship of ships) {
      if (this.getShipCells(ship).includes(cellKey)) {
        hits.add(cellKey);
        return this.isShipKilled(ship, hits) ? 'killed' : 'shot';
      }
    }
    return 'miss';
  }

  static isGameOver(ships: any[], hits: Set<string>) {
    return ships.every(ship => this.isShipKilled(ship, hits));
  }

  static getKilledShip(ships: any[], hits: Set<string>) {
    for (const ship of ships) {
      if (this.isShipKilled(ship, hits)) {
        const adjacent = this.getAdjacentCells(ship);
        if (!adjacent.every(cell => hits.has(cell))) {
          return ship;
        }
      }
    }
    return null;
  }
}