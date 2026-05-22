import { keys } from "../engine/input.js";

export class Fighter {
  constructor(x, y, color, controls) {
    this.x = x;
    this.y = y;
    this.color = color;

    this.controls = controls;

    this.width = 50;
    this.height = 100;

    this.speed = 5;
    this.health = 100;

    this.velocityY = 0;
    this.gravity = 0.7;
    this.isGrounded = false;

    // ATTACK SYSTEM
    this.attackState = "idle";
    this.attackTimer = 0;
    this.isAttacking = false;
    this.attackCooldown = 0;
    this.hitstun = 0;

    this.hasHit = false;

    this.attackData = {
      startup: 10,
      active: 6,
      recovery: 14,
      damage: 10,
      range: 60
    };
  }

  // =========================
  // ATTACK
  // =========================
  attack() {
    if (this.attackCooldown > 0 || this.hitstun > 0) return;
    if (this.attackState !== "idle") return;

    this.attackState = "startup";
    this.attackTimer = this.attackData.startup;
    this.hasHit = false;
  }

  // =========================
  // 🛡️ BLOCK SYSTEM (NEW)
  // =========================
  isBlocking(opponent) {
    // opponent is to the right → holding LEFT = block
    if (opponent.x > this.x) {
      return keys[this.controls.left];
    }

    // opponent is to the left → holding RIGHT = block
    if (opponent.x < this.x) {
      return keys[this.controls.right];
    }

    return false;
  }

  // =========================
  // TAKE HIT (UPDATED)
  // =========================
  takeHit(damage, direction, attacker) {
    // 🛡️ BLOCK CHECK
    if (this.isBlocking(attacker)) {
      this.health -= damage * 0.2; // chip damage

      this.x += direction * 2; // tiny pushback

      this.hitstun = 5; // small reaction, not full combo stop

      this.isAttacking = false;
      return;
    }

    // 💥 NORMAL HIT
    this.health -= damage;

    this.x += direction * 25;

    this.hitstun = 12;
    this.isAttacking = false;
  }

  // =========================
  // UPDATE
  // =========================
  update(canvas) {
    // cooldowns
    if (this.attackCooldown > 0) this.attackCooldown--;

    if (this.hitstun > 0) {
      this.hitstun--;
      return;
    }

    // ATTACK STATE MACHINE
    if (this.attackState !== "idle") {
      this.attackTimer--;

      // STARTUP → ACTIVE
      if (this.attackState === "startup" && this.attackTimer <= 0) {
        this.attackState = "active";
        this.attackTimer = this.attackData.active;
        this.isAttacking = true;
      }

      // ACTIVE → RECOVERY
      else if (this.attackState === "active" && this.attackTimer <= 0) {
        this.attackState = "recovery";
        this.attackTimer = this.attackData.recovery;
        this.isAttacking = false;
      }

      // RECOVERY → IDLE
      else if (this.attackState === "recovery" && this.attackTimer <= 0) {
        this.attackState = "idle";
        this.attackCooldown = 10;
      }
    }

    // MOVEMENT ONLY WHEN NOT ATTACKING
    const canMove = this.attackState === "idle";

    if (canMove) {
      if (keys[this.controls.left]) this.x -= this.speed;
      if (keys[this.controls.right]) this.x += this.speed;

      if (keys[this.controls.jump] && this.isGrounded) {
        this.velocityY = -12;
        this.isGrounded = false;
      }
    }

    // GRAVITY
    this.y += this.velocityY;
    this.velocityY += this.gravity;

    if (this.y + this.height >= canvas.height) {
      this.y = canvas.height - this.height;
      this.velocityY = 0;
      this.isGrounded = true;
    }
  }

  // =========================
  // DRAW
  // =========================
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.fillStyle = "white";
    ctx.font = "12px Arial";
    ctx.fillText(this.attackState, this.x, this.y - 10);
  }
}
