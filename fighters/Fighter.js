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

    // 🥊 ATTACK SYSTEM (NEW)
    this.attackState = "idle"; // idle | startup | active | recovery
    this.attackTimer = 0;
    this.hasHit = false;

    this.isAttacking = false;
    this.attackCooldown = 0;
    this.hitstun = 0;

    // ⚙️ FRAME DATA (you can tweak later)
    this.attackData = {
      startup: 10,
      active: 6,
      recovery: 14,
      damage: 10,
      range: 60
    };
  }

  attack() {
    if (this.attackCooldown > 0 || this.hitstun > 0) return;
    if (this.attackState !== "idle") return;

    this.attackState = "startup";
    this.attackTimer = this.attackData.startup;
    this.hasHit = false;
  }

  takeHit(damage, direction) {
    this.health -= damage;
    this.x += 25 * direction;
    this.hitstun = 12;
  }

  update(canvas) {
    // cooldowns
    if (this.attackCooldown > 0) this.attackCooldown--;
    if (this.hitstun > 0) {
      this.hitstun--;
      return;
    }

    // 🥊 ATTACK STATE MACHINE
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

    // movement disabled during attack/recovery (classic fighting game feel)
    const canMove = this.attackState === "idle";

    if (canMove) {
      if (keys[this.controls.left]) this.x -= this.speed;
      if (keys[this.controls.right]) this.x += this.speed;

      if (keys[this.controls.jump] && this.isGrounded) {
        this.velocityY = -12;
        this.isGrounded = false;
      }
    }

    // gravity always runs
    this.y += this.velocityY;
    this.velocityY += this.gravity;

    if (this.y + this.height >= canvas.height) {
      this.y = canvas.height - this.height;
      this.velocityY = 0;
      this.isGrounded = true;
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // 🧠 DEBUG: show attack state
    ctx.fillStyle = "white";
    ctx.font = "12px Arial";
    ctx.fillText(this.attackState, this.x, this.y - 10);
  }
}
