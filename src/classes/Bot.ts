import { Vector } from "./Vector";
import { Grid } from "./Grid";

/**
 * Represents a bot in the game.
 */
export class Bot {
  pos: Vector;
  dir: Vector;

  /**
   * Creates a new instance of the Bot class.
   * @param pos The initial position of the bot.
   * @param dir The initial direction of the bot.
   */
  constructor(pos = new Vector(0, 0), dir = new Vector(-1, 0)) {
    this.pos = pos;
    this.dir = dir;
  }

  /**
   * Turns the bot 90 degrees clockwise.
   * @returns The new direction of the bot.
   */
  turn() {
    if (this.dir.equals(new Vector(1, 0))) {
      return (this.dir = new Vector(0, -1));
    }
    if (this.dir.equals(new Vector(0, -1))) {
      return (this.dir = new Vector(-1, 0));
    }
    if (this.dir.equals(new Vector(-1, 0))) {
      return (this.dir = new Vector(0, 1));
    }
    if (this.dir.equals(new Vector(0, 1))) {
      return (this.dir = new Vector(1, 0));
    }
  }

  /**
   * Have the bot turn to the right until it can reach a passable tile,
   * then move it there.
   * @param grid The grid representing the game world.
   */
  move(grid: Grid) {
    let newPos = this.pos.add(this.dir);
    while (!grid.isTilePassable(newPos)) {
      this.turn();
      newPos = this.pos.add(this.dir);
    }
    this.pos = newPos;
  }
}
