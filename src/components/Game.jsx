import { useState, useEffect, useCallback } from 'react';
import Robot from './Robot';
import Monster from './Monster';
import GameBackground from './GameBackground';
import useKeyPress from '../hooks/useKeyPress';
import './Game.css';

function Game() {
  const currentLane = useKeyPress();
  const [monsters, setMonsters] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const spawnMonster = useCallback(() => {
    if (gameOver) return;
    
    const newMonster = {
      id: Date.now(),
      lane: Math.floor(Math.random() * 4),
      position: -10
    };
    setMonsters(prev => [...prev, newMonster]);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;

    const spawnInterval = setInterval(() => {
      spawnMonster();
    }, 1500);

    return () => clearInterval(spawnInterval);
  }, [spawnMonster, gameOver]);

  useEffect(() => {
    if (gameOver) return;

    const moveInterval = setInterval(() => {
      setMonsters(prev => {
        const updated = prev.map(monster => ({
          ...monster,
          position: monster.position + 2
        }));

        const inBounds = updated.filter(monster => monster.position < 110);

        inBounds.forEach(monster => {
          if (monster.position >= 70 && monster.position <= 90 && monster.lane === currentLane) {
            setGameOver(true);
          }
        });

        return inBounds;
      });

      setScore(prev => prev + 1);
    }, 50);

    return () => clearInterval(moveInterval);
  }, [currentLane, gameOver]);

  const restartGame = () => {
    setMonsters([]);
    setGameOver(false);
    setScore(0);
  };

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
      {monsters.map(monster => (
        <Monster key={monster.id} lane={monster.lane} position={monster.position} />
      ))}
      <div className="score">Score: {score}</div>
      {gameOver && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Final Score: {score}</p>
          <button onClick={restartGame}>Restart</button>
        </div>
      )}
    </div>
  );
}

export default Game;
