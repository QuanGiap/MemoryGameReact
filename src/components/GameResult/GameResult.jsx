import React from 'react';
import './GameResult.css';
import toTimeString from '../../tool/timeToString.js';

const GameResult = ({ moves, time,onClickRestart }) => {
    return (
        <div id="game_win_background">
            <div id="game_win_container">
            <h2>Congratulations! You won!</h2>
            <p>Total Moves: {moves}</p>
            <p>Total Time: {toTimeString(time)}</p>
            <button onClick={onClickRestart}>Play Again</button>
            </div>
      </div>
    );
};

export default GameResult;