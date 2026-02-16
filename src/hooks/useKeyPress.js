import { useEffect, useState } from 'react';

function useKeyPress() {
  const [currentLane, setCurrentLane] = useState(1);

  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key.toLowerCase();
      
      const keyToLane = {
        'a': 0,
        's': 1,
        'd': 2,
        'f': 3
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
