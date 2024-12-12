'use client';

import { useState, useEffect } from "react";

function Counter() {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const worker = new Worker(new URL("@/utils/timerWorker.ts", import.meta.url));
    worker.onmessage = (event: MessageEvent<number>) => {
      setCount(event.data);
    };
    return () => worker.terminate();
  }, []);

  return (
    <div>
      <h1>Contador: {count}</h1>
    </div>
  );
}

export default Counter;
