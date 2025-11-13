export interface Player {
    name:string,
    password:string,
    index:number,
    wins:number
}

export interface Ship {
    position:{ x:number, y:number },
    direction:boolean,
    length:number,
    type: 'small' | 'medium' | 'large' | 'huge'
}

export interface Room {
    roomId:number,
    players:number[]
}

export interface GamePlayer {
    playerId: number;
    playerIndex:number;
    ships:Ship[]
}

export interface Game {
    gameId:number,
    roomId:number,
    players:Map<number,GamePlayer>,
    currentTurn:number
}