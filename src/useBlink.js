import { useState, useEffect } from 'react';

export default function useBlink(shouldBlink, duration = 500) {
  const [isBlinking, setIsBlinking] = useState(shouldBlink);

  useEffect(() => {
    if (shouldBlink) {
      setIsBlinking(true);
      const timer = setTimeout(() => {
        setIsBlinking(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [shouldBlink, duration]);

  return isBlinking;
}
