let count = 0;
function tick() {
  count++;
  postMessage(count);
  setTimeout(tick, 1000); // Simula setInterval mesmo com o navegador bloqueado
}
tick();
