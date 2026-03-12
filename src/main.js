window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game');
  const game = new PongGame(canvas);

  document.addEventListener('keydown', e => { game.keys[e.code] = true; });
  document.addEventListener('keyup', e => { game.keys[e.code] = false; });

  document.querySelectorAll('[data-mode]').forEach(btn => {
    btn.addEventListener('click', () => game.setMode(btn.dataset.mode));
  });

  document.getElementById('overlay').addEventListener('click', e => {
    if (game.state === 'over') game.start();
  });

  game.draw();
});