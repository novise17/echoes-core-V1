export function startGameLoop(canvas, ctx, state) {
  function loop() {
    update(state, canvas);
    draw(ctx, state);
    requestAnimationFrame(loop);
  }

  loop();
}

function update(state, canvas) {
  state.player1.update(canvas, state.player2);
  state.player2.update(canvas, state.player1);
}

function draw(ctx, state) {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, 1000, 600);

  state.player1.draw(ctx);
  state.player2.draw(ctx);
}
