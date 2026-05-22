export function startGameLoop(canvas, ctx, state, checkHit) {
  function loop() {
    // =========================
    // 🧊 HITSTOP (freeze frames)
    // =========================
    if (state.hitstop > 0) {
      state.hitstop--;

      draw(ctx, state);
      requestAnimationFrame(loop);
      return;
    }

    // =========================
    // 🧠 GAME UPDATE
    // =========================
    update(state, canvas, checkHit);

    // =========================
    // 💥 DRAW
    // =========================
    draw(ctx, state);

    requestAnimationFrame(loop);
  }

  loop();
}

// =========================
// UPDATE LOGIC
// =========================
function update(state, canvas, checkHit) {
  const p1 = state.player1;
  const p2 = state.player2;

  // stop updating if someone is KO (optional later: end screen)
  if (!p1.isKO) p1.update(canvas, p2);
  if (!p2.isKO) p2.update(canvas, p1);

  // hit detection only if both alive
  if (!p1.isKO && !p2.isKO) {
    checkHit(p1, p2);
    checkHit(p2, p1);
  }

  // optional: global win state (for later UI)
  if (p1.isKO || p2.isKO) {
    state.matchOver = true;
  }
}

// =========================
// DRAW LOGIC
// =========================
function draw(ctx, state) {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, 1000, 600);

  const p1 = state.player1;
  const p2 = state.player2;

  p1.draw(ctx);
  p2.draw(ctx);

  // =========================
  // 🏁 WIN TEXT (STEP 5 ADDITION)
  // =========================
  if (p1.isKO || p2.isKO) {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";

    const text =
      p1.isKO && p2.isKO
        ? "DOUBLE KO"
        : p1.isKO
        ? "BLUE WINS"
        : "RED WINS";

    ctx.fillText(text, 400, 200);
  }
}
