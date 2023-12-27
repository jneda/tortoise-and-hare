import { Vector } from "./Vector";

/**
 * Represents a grid with tiles.
 */
export class Grid {
  w: number;
  h: number;
  rows: string[];

  /**
   * Creates a new Grid instance.
   * @param w The width of the grid.
   * @param h The height of the grid.
   * @param rows The rows of the grid.
   */
  constructor(w: number, h: number, rows: string[]) {
    this.w = w;
    this.h = h;
    this.rows = rows.slice();
  }

  /**
   * Checks if a tile at the specified position is passable.
   * @param position The position of the tile.
   * @returns True if the tile is passable, false otherwise.
   */
  isTilePassable(position: Vector) {
    return this.rows[position.r][position.c] !== "#";
  }
}
