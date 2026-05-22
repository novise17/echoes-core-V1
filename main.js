import { Fighter } from "./fighters/Fighter.js";
import { initInput } from "./engine/input.js";
import { keys } from "./engine/input.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 600;

// create fighters (SEPARATE CONTROLS)
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

function gameLoop() {
  // update
  player1.update(canvas);
  player2.update(canvas);

  // draw background
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // draw fighters
  player1.draw(ctx);
  player2.draw(ctx);

  requestAnimationFrame(gameLoop);
}

gameLoop();
