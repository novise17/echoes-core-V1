import { Fighter } from "./fighters/Fighter.js";
import { initInput } from "./engine/input.js";
import { keys } from "./engine/input.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 600;

// fighters
const player1 = new Fighter(100, 300, "red", {
  left: "a",
  right: "d",
  jump: "w"
});

const player2 = new Fighter(700, 300, "blue", {
  left: "ArrowLeft",
  right: "ArrowRight",
  jump: "ArrowUp"
});

initInput();

function checkHit(attacker, defender) {
  if (!attacker.isAttacking) return;

  const range = 60;

  const inXRange = Math.abs(attacker.x - defender.x) < range;
  const inYRange = Math.abs(attacker.y - defender.y) < 50;

  if (inXRange && inYRange) {
    const direction = attacker.x < defender.x ? 1 : -1;
    defender.takeHit(10, direction);
  }
}

function gameLoop() {
  // 🥊 attacks
  if (keys["j"]) player1.attack();
  if (keys["Enter"]) player2.attack();

  // 🧠 hit detection
  checkHit(player1, player2);
  checkHit(player2, player1);

  // update
  player1.update(canvas);
  player2.update(canvas);

  // background
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // draw
  player1.draw(ctx);
  player2.draw(ctx);

  requestAnimationFrame(gameLoop);
}

gameLoop();
