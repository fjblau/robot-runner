import { useEffect, useState, useRef } from 'react';

function useKeyPress() {
  const [currentLane, setCurrentLane] = useState(1);
  const [shouldShake, setShouldShake] = useState(false);
  const lastKeyRef = useRef(null);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key;
      
      const keyToLane = {
        '4': 0,
        '5': 1,
        '6': 2,
        '7': 3
      };

      if (key in keyToLane) {
        event.preventDefault();
        
        const now = Date.now();
        if (lastKeyRef.current === '6' && key === '7' && now - lastTimeRef.current < 300) {
          setShouldShake(true);
          setTimeout(() => setShouldShake(false), 500);
        }
        
        setCurrentLane(keyToLane[key]);
        lastKeyRef.current = key;
        lastTimeRef.current = now;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return { currentLane, shouldShake };
}

export default useKeyPress;
