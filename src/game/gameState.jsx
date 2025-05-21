export const GameState = {
    currentPlayer: 'red',

    switchTurn() {
        this.currentPlayer = this.currentPlayer === 'red' ? 'blue' : 'red';
        console.log('Switch to ', this.currentPlayer, ' turn')
    }
}