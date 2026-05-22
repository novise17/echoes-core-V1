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

  // 🥊 ATTACK HITBOX (in front of attacker)
  const attackBox = {
    x: attacker.x + (attacker.x < defender.x ? attacker.width : -60),
    y: attacker.y + 20,
    width: 60,
    height: 40
  };

  // 🧍 DEFENDER HITBOX
  const hurtBox = {
    x: defender.x,
    y: defender.y,
    width: defender.width,
    height: defender.height
  };

  // 🔥 collision check (AABB)
  const hit =
    attackBox.x < hurtBox.x + hurtBox.width &&
    attackBox.x + attackBox.width > hurtBox.x &&
    attackBox.y < hurtBox.y + hurtBox.height &&
    attackBox.y + attackBox.height > hurtBox.y;

  if (hit) {
    const direction = attacker.x < defender.x ? 1 : -1;
    defender.takeHit(10, direction);

    // stop infinite multi-hit spam
    attacker.isAttacking = false;
  }
}

function gameLoop() {
  // 🥊 attacks
  if (keys["j"]) player1.attack();
  if (keys["Enter"]) player2.attack();

  // 🧠 hit detection (REAL HITBOX SYSTEM)
  checkHit(player1, player2);
  checkHit(player2, player1);

  // update
  player1.update(canvas);
  player2.update(canvas);

  // background
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // draw fighters
  player1.draw(ctx);
  player2.draw(ctx);

  requestAnimationFrame(gameLoop);
}

gameLoop();
