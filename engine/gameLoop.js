export function startGameLoop(canvas, ctx, state, checkHit) {
  function loop() {
    // =========================
    // HITSTOP (freeze frames)
    // =========================
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
  const p1 = state.player1;
  const p2 = state.player2;

  if (!p1.isKO) p1.update(canvas, p2);
  if (!p2.isKO) p2.update(canvas, p1);

  checkHit(p1, p2);
  checkHit(p2, p1);

  if (p1.isKO || p2.isKO) {
    state.matchOver = true;
  }
}

// =========================
// DRAW
// =========================
function draw(ctx, state) {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, 1000, 600);

  state.player1.draw(ctx);
  state.player2.draw(ctx);

  if (state.player1.isKO || state.player2.isKO) {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";

    const text =
      state.player1.isKO && state.player2.isKO
        ? "DOUBLE KO"
        : state.player1.isKO
        ? "BLUE WINS"
        : "RED WINS";

    ctx.fillText(text, 400, 200);
  }
}
