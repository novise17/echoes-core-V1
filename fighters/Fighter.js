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

    // ❤️ HEALTH + KO
    this.maxHealth = 100;
    this.health = 100;
    this.isKO = false;

    // physics
    this.velocityY = 0;
    this.gravity = 0.7;
    this.isGrounded = false;

    // attack system
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

  attack() {
    if (this.isKO) return;
    if (this.attackCooldown > 0 || this.hitstun > 0) return;
    if (this.attackState !== "idle") return;

    this.attackState = "startup";
    this.attackTimer = this.attackData.startup;
    this.hasHit = false;
  }

  isBlocking(opponent) {
    if (this.isKO) return false;

    if (opponent.x > this.x) return keys[this.controls.left];
    if (opponent.x < this.x) return keys[this.controls.right];

    return false;
  }

  takeHit(damage, direction, attacker) {
    if (this.isKO) return;

    // 🛡 BLOCK
    if (this.isBlocking(attacker)) {
      this.health -= damage * 0.2;
      this.x += direction * 2;
      this.hitstun = 5;
      return;
    }

    // 💥 HIT
    this.health -= damage;
    this.x += direction * 25;
    this.hitstun = 12;

    // KO CHECK
    if (this.health <= 0) {
      this.health = 0;
      this.isKO = true;
      this.attackState = "idle";
      this.isAttacking = false;
    }
  }

  update(canvas) {
    if (this.isKO) return;

    if (this.attackCooldown > 0) this.attackCooldown--;

    if (this.hitstun > 0) {
      this.hitstun--;
      return;
    }

    // attack state machine
    if (this.attackState !== "idle") {
      this.attackTimer--;

      if (this.attackState === "startup" && this.attackTimer <= 0) {
        this.attackState = "active";
        this.attackTimer = this.attackData.active;
        this.isAttacking = true;
      } 
      else if (this.attackState === "active" && this.attackTimer <= 0) {
        this.attackState = "recovery";
        this.attackTimer = this.attackData.recovery;
        this.isAttacking = false;
      } 
      else if (this.attackState === "recovery" && this.attackTimer <= 0) {
        this.attackState = "idle";
        this.attackCooldown = 10;
      }
    }

    // movement
    const canMove = this.attackState === "idle";

    if (canMove) {
      if (keys[this.controls.left]) this.x -= this.speed;
      if (keys[this.controls.right]) this.x += this.speed;

      if (keys[this.controls.jump] && this.isGrounded) {
        this.velocityY = -12;
        this.isGrounded = false;
      }
    }

    // gravity
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

    // health bar
    ctx.fillStyle = "red";
    ctx.fillRect(
      this.x,
      this.y - 10,
      this.width * (this.health / this.maxHealth),
      5
    );

    ctx.fillStyle = "white";
    ctx.font = "12px Arial";
    ctx.fillText(this.attackState, this.x, this.y - 20);

    if (this.isKO) {
      ctx.fillText("KO", this.x, this.y - 35);
    }
  }
}
