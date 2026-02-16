import { useState, useEffect, useCallback } from 'react';
import Robot from './Robot';
import Monster from './Monster';
import GameBackground from './GameBackground';
import useKeyPress from '../hooks/useKeyPress';
import './Game.css';

function Game() {
  const currentLane = useKeyPress();
  const [monsters, setMonsters] = useState([]);
  const [score, setScore] = useState(0);
  const [gameTime, setGameTime] = useState(0);

  const spawnMonster = useCallback(() => {
    const newMonster = {
      id: Date.now() + Math.random(),
      lane: Math.floor(Math.random() * 4),
      position: -10,
      scored: false
    };
    setMonsters(prev => [...prev, newMonster]);
  }, []);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setGameTime(prev => prev + 0.1);
    }, 100);

    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    const baseSpawnRate = 1500;
    const spawnRate = Math.max(400, baseSpawnRate - gameTime * 10);

    const spawnInterval = setInterval(() => {
      spawnMonster();
    }, spawnRate);

    return () => clearInterval(spawnInterval);
  }, [spawnMonster, gameTime]);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setMonsters(prev => {
        const baseSpeed = 2;
        const speed = baseSpeed + (gameTime / 10);

        const updated = prev.map(monster => {
          const newPosition = monster.position + speed;
          let newScored = monster.scored;

          if (!monster.scored && newPosition >= 70 && newPosition <= 90) {
            if (monster.lane === currentLane) {
              setScore(s => s - 10);
              newScored = true;
            }
          }

          if (!monster.scored && newPosition > 90) {
            if (monster.lane !== currentLane || newPosition > 95) {
              setScore(s => s + 10);
              newScored = true;
            }
          }

          return {
            ...monster,
            position: newPosition,
            scored: newScored
          };
        });

        return updated.filter(monster => monster.position < 110);
      });
    }, 50);

    return () => clearInterval(moveInterval);
  }, [currentLane, gameTime]);

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
    </div>
  );
}

export default Game;
