import { keys } from "../engine/input.js";

export class Fighter {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;

    this.width = 50;
    this.height = 100;

    this.speed = 5;
    this.health = 100;

    this.velocityY = 0;
    this.gravity = 0.7;
    this.isGrounded = false;
  }

  update(canvas, enemy) {
    // movement
    if (keys["a"]) this.x -= this.speed;
    if (keys["d"]) this.x += this.speed;

    if (keys["w"] && this.isGrounded) {
      this.velocityY = -12;
      this.isGrounded = false;
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
  }
}
