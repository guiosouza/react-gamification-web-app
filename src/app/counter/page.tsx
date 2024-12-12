'use client';

import { useState, useEffect, useRef } from "react";

function Counter() {
  const [count, setCount] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>('');
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL('@/utils/timerWorker.ts', import.meta.url));
    workerRef.current.onmessage = (event: MessageEvent<number | string>) => {
      if (event.data === 'done') {
        playSound();
      } else {
        setCount(event.data as number);
      }
    };
    return () => workerRef.current?.terminate();
  }, []);

  const startCountdown = () => {
    const time = parseInt(inputValue, 10);
    if (!isNaN(time) && time > 0) {
      workerRef.current?.postMessage(time);
    }
  };

  const playSound = () => {
    const audio = new Audio('/assets/sounds/timer-end.mp3');
    audio.play().catch(error => console.error('Error playing audio:', error));
  };

  return (
    <div className="App">
      <h1>Contador: {count}</h1>
      <input
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Insira segundos"
      />
      <button onClick={startCountdown}>Iniciar Contagem</button>
    </div>
  );
}

export default Counter;
