import Robot from './Robot';
import GameBackground from './GameBackground';
import useKeyPress from '../hooks/useKeyPress';
import './Game.css';

function Game() {
  const currentLane = useKeyPress();

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
