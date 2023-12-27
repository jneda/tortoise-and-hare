import { Grid, Bot } from "./classes";
import { emojis } from "./emojis";

const canvas = document.querySelector("#canvas")! as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const fontSize = 64;

const offset = fontSize / 2;

export function resizeCanvas(grid: Grid) {
  const canvasWidth = grid.w * fontSize;
  const canvasHeight = grid.h * fontSize;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
}

export function drawGrid(grid: Grid) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  initFont();

  let x = 0;
  let y = 0;

  for (let i = 0; i < grid.h; i++) {
    y = fontSize * i + offset;
    const tiles = grid.rows[i].split("").map((char) => {
      return char === "#" ? emojis.wall : emojis.path;
    });

    for (let j = 0; j < tiles.length; j++) {
      x = fontSize * j + offset;
      ctx.fillText(tiles[j], x, y);
    }
  }
}

export function drawBot(bot: Bot, type: string) {
  initFont();

  const emoji = type === "turtle" ? emojis.turtle : emojis.hare;
  const x = bot.pos.c * fontSize + offset;
  const y = bot.pos.r * fontSize + offset;
  ctx.fillText(emoji, x, y);
}

function initFont() {
  ctx.font = `${fontSize * 0.9}px monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
}
