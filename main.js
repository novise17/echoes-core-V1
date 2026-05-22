import { startGameLoop } from "./engine/gameLoop.js";
import { Fighter } from "./fighters/Fighter.js";
import { initInput } from "./engine/input.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 600;

export const gameState = {
  player1: new Fighter(100, 300, "red"),
  player2: new Fighter(700, 300, "blue")
};

initInput();

startGameLoop(canvas, ctx, gameState);
