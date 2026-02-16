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
  const [gameState, setGameState] = useState('notStarted');
  const [timeLeft, setTimeLeft] = useState(120);
  const [playerName, setPlayerName] = useState('');
  const [highScores, setHighScores] = useState([]);
  const gameTimeRef = useRef(0);
  const prevLaneRef = useRef(currentLane);
  const { playMove, playHit, playAvoid } = useSounds();

  useEffect(() => {
    const saved = localStorage.getItem('robotRunnerHighScores');
    if (saved) {
      setHighScores(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && prevLaneRef.current !== currentLane) {
      playMove();
      prevLaneRef.current = currentLane;
    }
  }, [currentLane, playMove, gameState]);

  const startGame = () => {
    setGameState('playing');
    setMonsters([]);
    setScore(0);
    setTimeLeft(120);
    gameTimeRef.current = 0;
  };

  const pauseGame = () => {
    setGameState('paused');
  };

  const resumeGame = () => {
    setGameState('playing');
  };

  const stopGame = () => {
    setGameState('notStarted');
    setMonsters([]);
    setScore(0);
    setTimeLeft(120);
    gameTimeRef.current = 0;
  };

  const saveHighScore = () => {
    if (!playerName.trim()) return;
    
    const newScore = {
      name: playerName.trim(),
      score: score,
      date: new Date().toISOString()
    };
    
    const updated = [...highScores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    
    setHighScores(updated);
    localStorage.setItem('robotRunnerHighScores', JSON.stringify(updated));
    setGameState('viewHighScores');
  };

  const spawnMonster = useCallback((count = 1) => {
    const newMonsters = [];
    for (let i = 0; i < count; i++) {
      newMonsters.push({
        id: Date.now() + Math.random() + i,
        lane: Math.floor(Math.random() * 4),
        position: -10 - (i * 15),
        scored: false,
        type: Math.random() > 0.5 ? 'bad' : 'good'
      });
    }
    setMonsters(prev => [...prev, ...newMonsters]);
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('gameOver');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    let lastSpawn = Date.now();

    const gameLoop = setInterval(() => {
      gameTimeRef.current += 0.05;
      
      const baseSpawnRate = 1500;
      const spawnRate = Math.max(300, baseSpawnRate - gameTimeRef.current * 15);
      const now = Date.now();

      if (now - lastSpawn >= spawnRate) {
        const monstersToSpawn = Math.min(3, Math.floor(1 + gameTimeRef.current / 50));
        spawnMonster(monstersToSpawn);
        lastSpawn = now;
      }
    }, 50);

    return () => clearInterval(gameLoop);
  }, [spawnMonster, gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const moveInterval = setInterval(() => {
      setMonsters(prev => {
        const baseSpeed = 2;
        const speed = baseSpeed + (gameTimeRef.current / 10);

        const updated = prev.map(monster => {
          const newPosition = monster.position + speed;
          let newScored = monster.scored;

          if (!monster.scored && newPosition >= 70 && newPosition <= 90) {
            if (monster.lane === currentLane) {
              if (monster.type === 'bad') {
                setScore(s => Math.max(0, s - 10));
                playHit();
              } else {
                setScore(s => s + 10);
                playAvoid();
              }
              newScored = true;
            }
          }

          if (!monster.scored && newPosition > 90) {
            if (monster.lane !== currentLane || newPosition > 95) {
              if (monster.type === 'bad') {
                setScore(s => s + 10);
                playAvoid();
                newScored = true;
              } else {
                newScored = true;
              }
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
  }, [currentLane, playHit, playAvoid, gameState]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
        <Monster key={monster.id} lane={monster.lane} position={monster.position} type={monster.type} />
      ))}
      <div className="score">Score: {score}</div>
      {(gameState === 'playing' || gameState === 'paused') && (
        <div className="timer">Time: {formatTime(timeLeft)}</div>
      )}
      
      <div className="game-controls">
        {gameState === 'notStarted' && (
          <button className="control-button start-button" onClick={startGame}>Start Game</button>
        )}
        {gameState === 'playing' && (
          <>
            <button className="control-button pause-button" onClick={pauseGame}>Pause</button>
            <button className="control-button stop-button" onClick={stopGame}>Stop</button>
          </>
        )}
        {gameState === 'paused' && (
          <>
            <button className="control-button resume-button" onClick={resumeGame}>Resume</button>
            <button className="control-button stop-button" onClick={stopGame}>Stop</button>
          </>
        )}
        {gameState === 'viewHighScores' && (
          <button className="control-button start-button" onClick={stopGame}>New Game</button>
        )}
      </div>

      {gameState === 'paused' && (
        <div className="pause-overlay">
          <h2>PAUSED</h2>
        </div>
      )}

      {gameState === 'notStarted' && (
        <div className="start-overlay">
          <h2>Robot Runner</h2>
          <p>Use keys 4-5-6-7 to switch lanes</p>
          <p className="instruction-red">🔴 Avoid red monsters: +10 points</p>
          <p className="instruction-green">🟢 Hit green monsters: +10 points</p>
          <p className="game-duration">Game Duration: 2 minutes</p>
        </div>
      )}

      {gameState === 'gameOver' && (
        <div className="game-over">
          <h2>Time's Up!</h2>
          <p className="final-score">Final Score: {score}</p>
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={20}
            className="name-input"
            onKeyPress={(e) => e.key === 'Enter' && saveHighScore()}
          />
          <button onClick={saveHighScore} disabled={!playerName.trim()}>
            Save Score
          </button>
        </div>
      )}

      {gameState === 'viewHighScores' && (
        <div className="high-scores-overlay">
          <h2>High Scores</h2>
          <div className="scores-list">
            {highScores.length === 0 ? (
              <p className="no-scores">No high scores yet!</p>
            ) : (
              highScores.map((entry, index) => (
                <div key={index} className="score-entry">
                  <span className="rank">#{index + 1}</span>
                  <span className="name">{entry.name}</span>
                  <span className="points">{entry.score}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;
