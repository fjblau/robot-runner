import { useState } from 'react';
import Robot from './Robot';
import GameBackground from './GameBackground';
import './Game.css';

function Game() {
  const [currentLane, setCurrentLane] = useState(1);

  return (
    <div className="game-container">
      <GameBackground />
      <div className="game-lanes">
        <div className="lane"></div>
        <div className="lane"></div>
        <div className="lane"></div>
        <div className="lane"></div>
      </div>
      <Robot lane={currentLane} />
    </div>
  );
}

export default Game;
