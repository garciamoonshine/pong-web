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

  // touch controls: left half = left paddle, right half = right paddle
  let touchYLeft = null, touchYRight = null;
  canvas.addEventListener('touchstart', e => {
    [...e.changedTouches].forEach(t => {
      const r = canvas.getBoundingClientRect();
      const x = t.clientX - r.left;
      if (x < W / 2) touchYLeft = t.clientY - r.top;
      else touchYRight = t.clientY - r.top;
    });
  }, {passive:true});
  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    [...e.changedTouches].forEach(t => {
      const r = canvas.getBoundingClientRect();
      const x = t.clientX - r.left;
      const y = t.clientY - r.top;
      if (x < W / 2) {
        if (touchYLeft !== null) {
          const dy = y - touchYLeft;
          if (Math.abs(dy) > 2) { dy < 0 ? game.padLeft.moveUp() : game.padLeft.moveDown(); }
        }
        touchYLeft = y;
      } else {
        if (game.mode === '2p' && touchYRight !== null) {
          const dy = y - touchYRight;
          if (Math.abs(dy) > 2) { dy < 0 ? game.padRight.moveUp() : game.padRight.moveDown(); }
        }
        touchYRight = y;
      }
    });
  }, {passive:false});

  game.draw();
});