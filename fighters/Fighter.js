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

    // 🥊 combat
    this.isAttacking = false;
    this.attackCooldown = 0;
    this.hitstun = 0;
  }

  attack() {
    if (this.attackCooldown > 0 || this.hitstun > 0) return;

    this.isAttacking = true;
    this.attackCooldown = 20;

    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }

  takeHit(damage, direction) {
    this.health -= damage;

    // knockback
    this.x += 25 * direction;

    // hitstun
    this.hitstun = 12;
  }

  update(canvas) {
    // cooldown ticking
    if (this.attackCooldown > 0) this.attackCooldown--;
    if (this.hitstun > 0) this.hitstun--;

    // ❌ freeze movement during hitstun
    if (this.hitstun > 0) return;

    // LEFT / RIGHT
    if (keys[this.controls.left]) this.x -= this.speed;
    if (keys[this.controls.right]) this.x += this.speed;

    // JUMP
    if (keys[this.controls.jump] && this.isGrounded) {
      this.velocityY = -12;
      this.isGrounded = false;
    }

    // gravity
    this.y += this.velocityY;
    this.velocityY += this.gravity;

    // floor collision
    if (this.y + this.height >= canvas.height) {
      this.y = canvas.height - this.height;
      this.velocityY = 0;
      this.isGrounded = true;
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
