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

    // health
    this.maxHealth = 100;
    this.health = 100;
    this.isKO = false;

    // physics
    this.velocityY = 0;
    this.gravity = 0.7;
    this.isGrounded = false;

    // combat
    this.attackState = "idle";
    this.attackTimer = 0;
    this.isAttacking = false;
    this.attackCooldown = 0;
    this.hitstun = 0;

    this.facing = 1;

    // ======================
    // SPRITES (FIXED PATHS)
    // ======================
    const prefix = color; // "red" or "blue"

    this.sprites = {
      idle: new Image(),
      attack: new Image()
    };

    this.sprites.idle.src = `assets/${prefix}_idle.png`;
    this.sprites.attack.src = `assets/${prefix}_attack.png`;

    // animation helper (future expansion)
    this.frameTick = 0;
  }

  // ======================
  // ATTACK
  // ======================
  attack() {
    if (this.isKO) return;
    if (this.attackCooldown > 0 || this.hitstun > 0) return;
    if (this.attackState !== "idle") return;

    this.attackState = "startup";
    this.attackTimer = 10;
  }

  // ======================
  // BLOCK
  // ======================
  isBlocking(opponent) {
    if (this.isKO) return false;

    if (opponent.x > this.x) return keys[this.controls.left];
    if (opponent.x < this.x) return keys[this.controls.right];

    return false;
  }

  // ======================
  // TAKE HIT
  // ======================
  takeHit(damage, direction, attacker) {
    if (this.isKO) return;

    if (this.isBlocking(attacker)) {
      this.health -= damage * 0.2;
      this.x += direction * 2;
      this.hitstun = 5;
      return;
    }

    this.health -= damage;
    this.x += direction * 25;
    this.hitstun = 12;

    if (this.health <= 0) {
      this.health = 0;
      this.isKO = true;
      this.attackState = "idle";
      this.isAttacking = false;
    }
  }

  // ======================
  // UPDATE
  // ======================
  update(canvas) {
    if (this.isKO) return;

    if (this.attackCooldown > 0) this.attackCooldown--;

    if (this.hitstun > 0) {
      this.hitstun--;
      return;
    }

    // facing direction
    if (keys[this.controls.left]) this.facing = -1;
    if (keys[this.controls.right]) this.facing = 1;

    // attack state machine
    if (this.attackState !== "idle") {
      this.attackTimer--;

      if (this.attackState === "startup" && this.attackTimer <= 0) {
        this.attackState = "active";
        this.attackTimer = 6;
        this.isAttacking = true;
      } 
      else if (this.attackState === "active" && this.attackTimer <= 0) {
        this.attackState = "recovery";
        this.attackTimer = 14;
        this.isAttacking = false;
      } 
      else if (this.attackState === "recovery" && this.attackTimer <= 0) {
        this.attackState = "idle";
        this.attackCooldown = 10;
      }
    }

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

    // simple animation tick (ready for sprite sheets later)
    this.frameTick++;
  }

  // ======================
  // DRAW (SPRITES)
  // ======================
  draw(ctx) {
    const sprite =
      this.attackState === "active"
        ? this.sprites.attack
        : this.sprites.idle;

    ctx.save();

    // flip character
    if (this.facing === -1) {
      ctx.translate(this.x + this.width, this.y);
      ctx.scale(-1, 1);
    } else {
      ctx.translate(this.x, this.y);
    }

    // draw sprite OR fallback rectangle
    if (sprite.complete && sprite.naturalWidth > 0) {
      ctx.drawImage(sprite, 0, 0, this.width, this.height);
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(0, 0, this.width, this.height);
    }

    ctx.restore();

    // health bar
    ctx.fillStyle = "red";
    ctx.fillRect(
      this.x,
      this.y - 10,
      this.width * (this.health / this.maxHealth),
      5
    );

    // debug text
    ctx.fillStyle = "white";
    ctx.font = "12px Arial";
    ctx.fillText(this.attackState, this.x, this.y - 20);

    if (this.isKO) {
      ctx.fillText("KO", this.x, this.y - 35);
    }
  }
}
