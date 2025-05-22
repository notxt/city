const { random, floor } = Math;

const main = document.querySelector("main");
if (main === null) throw new Error("main is null");

const canvasSize = 500;

const canvas = document.createElement("canvas");
canvas.width = canvasSize;
canvas.height = canvasSize;

main.appendChild(canvas);

type Color = {
  r: number;
  g: number;
  b: number;
};

const createColorValue = () => floor(random() * 255);

const createColor = () => {
  const result: Color = {
    r: createColorValue(),
    g: createColorValue(),
    b: createColorValue(),
  };

  return result;
};

type Position = {
  previous: Direction;
  x: number;
  y: number;
};

const createPositionValue = () => floor(random() * canvasSize);

const createPosition = (): Position => {
  const result: Position = {
    previous: getDirection(),
    x: createPositionValue(),
    y: createPositionValue(),
  };

  return result;
};

const agentSize = 3;
const agentCount = 500;

type Agent = {
  color: Color;
  position: Position;
};

const createAgent = (): Agent => {
  const pixel: Agent = {
    color: createColor(),
    position: createPosition(),
  };

  return pixel;
};

const directions = ["up", "down", "left", "right"] as const;
type Direction = (typeof directions)[number];

const getDirection = (): Direction => {
  const index = floor(random() * 4);
  const direction = directions[index];
  if (typeof direction === "undefined")
    throw new Error("direction is undefined");

  return direction;
};

const updateAgentPosition = (agent: Agent) => {
  const { position } = agent;
  switch (getDirection()) {
    case "down":
      if (position.previous === "up") break;
      position.y++;
      agent.position.previous = "down";
      break;
    case "left":
      if (position.previous === "right") break;
      position.x--;
      agent.position.previous = "left";
      break;
    case "right":
      if (position.previous === "left") break;
      position.x++;
      agent.position.previous = "right";
      break;
    case "up":
      if (position.previous === "down") break;
      position.y--;
      agent.position.previous = "up";
      break;
  }
};

const agents: Agent[] = [];
for (let i = 0; i < agentCount; i++) {
  agents.push(createAgent());
}

const ctx = canvas.getContext("2d");
if (ctx === null) throw new Error("ctx is null");

let frame = 0;
const draw = () => {
  frame++;
  requestAnimationFrame(() => draw());

  if (frame % 8 !== 0) return;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  agents.forEach((agent) => {
    const { color, position } = agent;
    ctx.fillStyle = `rgb(${color.r} ${color.g} ${color.b})`;
    ctx.fillRect(position.x, position.y, agentSize, agentSize);
  });

  agents.forEach(updateAgentPosition);
};

requestAnimationFrame(() => draw());
