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


// =============================== //
// 🔥 ATTACK INPUT LOCK (STEP 3.5)
// =============================== //
let p1AttackPressed = false;
let p2AttackPressed = false;

// Player 1 attack (J)
window.addEventListener("keydown", (e) => {
  if (e.key === "j" && !p1AttackPressed) {
    player1.attack();
    p1AttackPressed = true;
  }

  if (e.key === "Enter" && !p2AttackPressed) {
    player2.attack();
    p2AttackPressed = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "j") p1AttackPressed = false;
  if (e.key === "Enter") p2AttackPressed = false;
});


// =============================== //
// 🧠 HIT DETECTION (unchanged logic)
// =============================== //
function checkHit(attacker, defender) {
  if (!attacker.isAttacking) return;

  const attackBox = {
    x: attacker.x + (attacker.x < defender.x ? attacker.width : -60),
    y: attacker.y + 20,
    width: 60,
    height: 40
  };

  const hurtBox = {
    x: defender.x,
    y: defender.y,
    width: defender.width,
    height: defender.height
  };

  const hit =
    attackBox.x < hurtBox.x + hurtBox.width &&
    attackBox.x + attackBox.width > hurtBox.x &&
    attackBox.y < hurtBox.y + hurtBox.height &&
    attackBox.y + attackBox.height > hurtBox.y;

  if (hit) {
    const direction = attacker.x < defender.x ? 1 : -1;
    defender.takeHit(10, direction);

    // prevent multi-hit spam
    attacker.isAttacking = false;
  }
}


// =============================== //
// 🎮 GAME LOOP
// =============================== //
function gameLoop() {
  // update fighters (now includes attack states)
  player1.update(canvas);
  player2.update(canvas);

  // hit detection
  checkHit(player1, player2);
  checkHit(player2, player1);

  // background
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // draw fighters
  player1.draw(ctx);
  player2.draw(ctx);

  requestAnimationFrame(gameLoop);
}

gameLoop();
