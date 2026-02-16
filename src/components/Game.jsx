import { useState, useEffect, useCallback, useRef } from 'react';
import Robot from './Robot';
import Monster from './Monster';
import GameBackground from './GameBackground';
import useKeyPress from '../hooks/useKeyPress';
import useSounds from '../hooks/useSounds';
import './Game.css';

function Game() {
  const currentLane = useKeyPress();
  const [monsters, setMonsters] = useState([]);
  const [score, setScore] = useState(0);
  const gameTimeRef = useRef(0);
  const prevLaneRef = useRef(currentLane);
  const { playMove, playHit, playAvoid } = useSounds();

  useEffect(() => {
    if (prevLaneRef.current !== currentLane) {
      playMove();
      prevLaneRef.current = currentLane;
    }
  }, [currentLane, playMove]);

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
    let lastSpawn = Date.now();

    const gameLoop = setInterval(() => {
      gameTimeRef.current += 0.05;
      
      const baseSpawnRate = 1500;
      const spawnRate = Math.max(400, baseSpawnRate - gameTimeRef.current * 10);
      const now = Date.now();

      if (now - lastSpawn >= spawnRate) {
        spawnMonster();
        lastSpawn = now;
      }
    }, 50);

    return () => clearInterval(gameLoop);
  }, [spawnMonster]);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setMonsters(prev => {
        const baseSpeed = 2;
        const speed = baseSpeed + (gameTimeRef.current / 10);

        const updated = prev.map(monster => {
          const newPosition = monster.position + speed;
          let newScored = monster.scored;

          if (!monster.scored && newPosition >= 70 && newPosition <= 90) {
            if (monster.lane === currentLane) {
              setScore(s => s - 10);
              playHit();
              newScored = true;
            }
          }

          if (!monster.scored && newPosition > 90) {
            if (monster.lane !== currentLane || newPosition > 95) {
              setScore(s => s + 10);
              playAvoid();
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
  }, [currentLane, playHit, playAvoid]);

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
