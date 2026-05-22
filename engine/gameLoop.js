export function startGameLoop(canvas, ctx, state, checkHit) {

  function loop() {

    // 🧊 HITSTOP
    if (state.hitstop > 0) {
      state.hitstop--;

      draw(ctx, state);
      requestAnimationFrame(loop);
      return;
    }

    update(state, canvas, checkHit);
    draw(ctx, state);

    requestAnimationFrame(loop);
  }

  loop();
}

// =========================
// UPDATE
// =========================
function update(state, canvas, checkHit) {
  state.player1.update(canvas, state.player2);
  state.player2.update(canvas, state.player1);

  checkHit(state.player1, state.player2);
  checkHit(state.player2, state.player1);
}

// =========================
// DRAW
// =========================
function draw(ctx, state) {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, 1000, 600);

  state.player1.draw(ctx);
  state.player2.draw(ctx);
}
