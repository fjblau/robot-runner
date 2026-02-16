import { useEffect, useState } from 'react';

function useKeyPress() {
  const [currentLane, setCurrentLane] = useState(1);

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
        setCurrentLane(keyToLane[key]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return currentLane;
}

export default useKeyPress;
