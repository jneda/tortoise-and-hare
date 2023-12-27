"use strict";
(() => {
  // src/classes/Vector.ts
  var Vector = class _Vector {
    /**
     * Creates a new Vector instance.
     * @param r The row coordinate. Default is 0.
     * @param c The column coordinate. Default is 0.
     */
    constructor(r = 0, c = 0) {
      this.r = r;
      this.c = c;
    }
    /**
     * Adds the given vector to this vector and returns a new Vector instance.
     * @param v The vector to add.
     * @returns A new Vector instance representing the sum of the two vectors.
     */
    add(v) {
      return new _Vector(this.r + v.r, this.c + v.c);
    }
    /**
     * Checks if this vector is equal to the given vector.
     * @param v The vector to compare.
     * @returns True if the vectors are equal, false otherwise.
     */
    equals(v) {
      return this.r === v.r && this.c === v.c;
    }
  };

  // src/classes/Grid.ts
  var Grid = class {
    /**
     * Creates a new Grid instance.
     * @param w The width of the grid.
     * @param h The height of the grid.
     * @param rows The rows of the grid.
     */
    constructor(w, h, rows) {
      this.w = w;
      this.h = h;
      this.rows = rows.slice();
    }
    /**
     * Checks if a tile at the specified position is passable.
     * @param position The position of the tile.
     * @returns True if the tile is passable, false otherwise.
     */
    isTilePassable(position) {
      return this.rows[position.r][position.c] !== "#";
    }
  };

  // src/classes/Bot.ts
  var Bot = class {
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
        return this.dir = new Vector(0, -1);
      }
      if (this.dir.equals(new Vector(0, -1))) {
        return this.dir = new Vector(-1, 0);
      }
      if (this.dir.equals(new Vector(-1, 0))) {
        return this.dir = new Vector(0, 1);
      }
      if (this.dir.equals(new Vector(0, 1))) {
        return this.dir = new Vector(1, 0);
      }
    }
    /**
     * Have the bot turn to the right until it can reach a passable tile,
     * then move it there.
     * @param grid The grid representing the game world.
     */
    move(grid2) {
      let newPos = this.pos.add(this.dir);
      while (!grid2.isTilePassable(newPos)) {
        this.turn();
        newPos = this.pos.add(this.dir);
      }
      this.pos = newPos;
    }
  };

  // src/init.ts
  function init() {
    const level = `..##..#.....
...........#
......O.....
............
.#..........
..........#.`.split("\n");
    const rows = [];
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
    const grid2 = new Grid(level[0].length, level.length, rows);
    const turtle2 = new Bot(startPos);
    const hare2 = new Bot(startPos);
    return { grid: grid2, turtle: turtle2, hare: hare2 };
  }

  // src/emojis.ts
  var emojis = {
    turtle: "\u{1F422}",
    hare: "\u{1F407}",
    wall: "\u{1F532}",
    path: "\u25AB\uFE0F"
  };

  // src/draw.ts
  var canvas = document.querySelector("#canvas");
  var ctx = canvas.getContext("2d");
  var fontSize = 64;
  var offset = fontSize / 2;
  function resizeCanvas(grid2) {
    const canvasWidth = grid2.w * fontSize;
    const canvasHeight = grid2.h * fontSize;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
  }
  function drawGrid(grid2) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initFont();
    let x = 0;
    let y = 0;
    for (let i = 0; i < grid2.h; i++) {
      y = fontSize * i + offset;
      const tiles = grid2.rows[i].split("").map((char) => {
        return char === "#" ? emojis.wall : emojis.path;
      });
      for (let j = 0; j < tiles.length; j++) {
        x = fontSize * j + offset;
        ctx.fillText(tiles[j], x, y);
      }
    }
  }
  function drawBot(bot, type) {
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

  // src/index.ts
  var runButton = document.querySelector("#run");
  runButton.addEventListener("click", toggleRun);
  var nextStepButton = document.querySelector(
    "#next-step"
  );
  nextStepButton.addEventListener("click", goNextStep);
  var previousStepButton = document.querySelector(
    "#previous-step"
  );
  previousStepButton.addEventListener("click", goPreviousStep);
  var { grid, turtle, hare } = init();
  var history = [
    [
      [turtle.pos, turtle.dir],
      [hare.pos, hare.dir]
    ]
  ];
  var pushingOnHistory = false;
  var cycleDetected = false;
  var running = false;
  var timer = null;
  resizeCanvas(grid);
  drawGrid(grid);
  drawBot(turtle, "turtle");
  drawBot(hare, "hare");
  function goNextStep() {
    if (cycleDetected)
      return;
    turtle.move(grid);
    hare.move(grid);
    hare.move(grid);
    if (!pushingOnHistory)
      pushingOnHistory = true;
    history.push([
      [
        new Vector(turtle.pos.r, turtle.pos.c),
        new Vector(turtle.dir.r, turtle.dir.c)
      ],
      [new Vector(hare.pos.r, hare.pos.c), new Vector(hare.dir.r, hare.dir.c)]
    ]);
    console.log(history.length, history);
    drawGrid(grid);
    drawBot(turtle, "turtle");
    drawBot(hare, "hare");
    if (turtle.pos.equals(hare.pos)) {
      if (running)
        toggleRun();
      cycleDetected = true;
      runButton.disabled = true;
      nextStepButton.disabled = true;
    }
  }
  function goPreviousStep() {
    if (pushingOnHistory) {
      history.pop();
      pushingOnHistory = false;
      cycleDetected = false;
      runButton.disabled = false;
      nextStepButton.disabled = false;
    }
    const previousStep = history.pop();
    if (previousStep === void 0) {
      return console.warn("History stack is empty.");
    }
    const [[turtlePos, turtleDir], [harePos, hareDir]] = previousStep;
    turtle.pos = turtlePos;
    turtle.dir = turtleDir;
    hare.pos = harePos;
    hare.dir = hareDir;
    console.log(turtle);
    console.log(hare);
    drawGrid(grid);
    drawBot(turtle, "turtle");
    drawBot(hare, "hare");
  }
  function toggleRun() {
    running = !running;
    runButton.innerText = running ? "Pause" : "Run";
    nextStepButton.disabled = running;
    previousStepButton.disabled = running;
    const delay = 500;
    switch (running) {
      case true: {
        timer = setInterval(() => {
          goNextStep();
        }, delay);
        break;
      }
      case false: {
        if (timer)
          clearInterval(timer);
        timer = null;
      }
    }
  }
})();
