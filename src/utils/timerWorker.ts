let count = 0;

onmessage = (event: MessageEvent<number>) => {
  count = event.data;
  tick();
};

function tick() {
  if (count > 0) {
    count--;
    postMessage(count);
    setTimeout(tick, 1000); // Simula setInterval mesmo com o navegador bloqueado
  } else {
    postMessage('done');
  }
}