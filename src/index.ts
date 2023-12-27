import { init } from "./init";
import { resizeCanvas, drawGrid, drawBot } from "./draw";
import { Vector } from "./classes";

// controls

const runButton = document.querySelector("#run")! as HTMLButtonElement;
runButton.addEventListener("click", toggleRun);

const nextStepButton = document.querySelector(
  "#next-step"
)! as HTMLButtonElement;
nextStepButton.addEventListener("click", goNextStep);

const previousStepButton = document.querySelector(
  "#previous-step"
)! as HTMLButtonElement;
previousStepButton.addEventListener("click", goPreviousStep);

// simulation objects

const { grid, turtle, hare } = init();
const history: [[Vector, Vector], [Vector, Vector]][] = [
  [
    [turtle.pos, turtle.dir],
    [hare.pos, hare.dir],
  ],
];
let pushingOnHistory = false;
let cycleDetected = false;

// animation variables

let running = false;
let timer: NodeJS.Timeout | null = null;

// initial draw

resizeCanvas(grid);

drawGrid(grid);
drawBot(turtle, "turtle");
drawBot(hare, "hare");

// logic

function goNextStep() {
  if (cycleDetected) return;

  turtle.move(grid);
  hare.move(grid);
  hare.move(grid);

  if (!pushingOnHistory) pushingOnHistory = true;
  history.push([
    [
      new Vector(turtle.pos.r, turtle.pos.c),
      new Vector(turtle.dir.r, turtle.dir.c),
    ],
    [new Vector(hare.pos.r, hare.pos.c), new Vector(hare.dir.r, hare.dir.c)],
  ]);

  console.log(history.length, history);

  drawGrid(grid);
  drawBot(turtle, "turtle");
  drawBot(hare, "hare");

  if (turtle.pos.equals(hare.pos)) {
    if (running) toggleRun();
    cycleDetected = true;
    runButton.disabled = true;
    nextStepButton.disabled = true;
  }
}

function goPreviousStep() {
  // TODO: there's a bug if we remove the starting position
  // it is then gone for good
  if (pushingOnHistory) {
    history.pop();
    pushingOnHistory = false;
    cycleDetected = false;
    runButton.disabled = false;
    nextStepButton.disabled = false;
  }
  const previousStep = history.pop();
  if (previousStep === undefined) {
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
      if (timer) clearInterval(timer);
      timer = null;
    }
  }
}
