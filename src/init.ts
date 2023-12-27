import { Vector, Grid, Bot } from "./classes";

export function init() {
  //   const level = `#####
  // #...#
  // #.#.#
  // #...#
  // #O###`.split("\n");
  const level = `..##..#.....
...........#
......O.....
............
.#..........
..........#.`.split("\n");

  const rows: string[] = [];
  let startPos = new Vector();

  for (let r = 0; r < level.length; r++) {
    let row = level[r];
    for (let c = 0; c < row.length; c++) {
      if (row[c] === "O") {
        startPos = new Vector(r, c);
        row = row.replace("O", ".");
      }
    }
    rows.push(row);
  }

  const grid = new Grid(level[0].length, level.length, rows);
  const turtle = new Bot(startPos);
  const hare = new Bot(startPos);

  return { grid, turtle, hare };
}
