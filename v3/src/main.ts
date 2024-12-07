const { random, floor, abs } = Math;

const main = document.querySelector("main");
if (main === null) throw new Error("main is null");

const canvasSize = 800;

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
  x: number;
  y: number;
};

const createPositionValue = () => floor(random() * canvasSize);

const createPos = (): Position => {
  const result: Position = {
    x: createPositionValue(),
    y: createPositionValue(),
  };

  return result;
};

const agentSize = 2;
const agentCount = 1000;

const placeNames = ["home", "work"] as const;
type PlaceName = (typeof placeNames)[number];

type Destination = {
  place: PlaceName;
  pos: Position;
};

const createDest = (place: PlaceName): Destination => {
  const result: Destination = {
    place,
    pos: createPos(),
  };

  return result;
};

const createWorkplace = (): Destination => createDest("work");
const workplaceCount = 3;
const workplaces: Destination[] = [];
for (let i = 0; i < workplaceCount; i++) workplaces.push(createWorkplace());
const getWorkplace = (): Destination => {
  const index = floor(random() * workplaceCount);
  const workplace = workplaces[index];
  if (typeof workplace === "undefined")
    throw new Error("workplace is undefined");

  return workplace;
};

type PlaceMap = { [P in PlaceName]: Destination };

const createAgentPlace = (): PlaceMap => {
  const result: PlaceMap = {
    home: createDest("home"),
    work: getWorkplace(),
  };

  return result;
};

const startingDest = (placeMap: PlaceMap): Destination => {
  const index = floor(random() * (placeNames.length - 1));
  const placeName = placeNames[index];
  if (typeof placeName === "undefined") throw new Error("result is undefined");

  const place = placeMap[placeName];

  return place;
};

type Agent = {
  color: Color;
  pos: Position;
  dest: Destination;
  place: PlaceMap;
};

const createAgent = (): Agent => {
  const place: PlaceMap = createAgentPlace();

  const pixel: Agent = {
    color: createColor(),
    pos: createPos(),
    dest: startingDest(place),
    place,
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
  const { dest, pos } = agent;

  if (dest.pos.x === pos.x && dest.pos.y === pos.y) {
    if (dest.place === "home") {
      agent.dest = agent.place.work;
      return;
    }

    agent.dest = agent.place.home;
    return;
  }

  const up = pos.y + 1;
  const down = pos.y - 1;
  let y = pos.y;
  if (abs(dest.pos.y - up) < abs(dest.pos.y - y)) y = up;
  if (abs(dest.pos.y - down) < abs(dest.pos.y - y)) y = down;

  const left = pos.x - 1;
  const right = pos.x + 1;
  let x = pos.x;
  if (abs(dest.pos.x - left) < abs(dest.pos.x - x)) x = left;
  if (abs(dest.pos.x - right) < abs(dest.pos.x - x)) x = right;

  agent.pos.x = x;
  agent.pos.y = y;
};

const agents: Agent[] = [];
for (let i = 0; i < agentCount; i++) {
  agents.push(createAgent());
}

const drawAgentFactory = (ctx: CanvasRenderingContext2D) => (agent: Agent) => {
  const { color, pos: position } = agent;
  ctx.fillStyle = `rgb(${color.r} ${color.g} ${color.b})`;
  ctx.fillRect(position.x, position.y, agentSize, agentSize);
};

const ctx = canvas.getContext("2d");
if (ctx === null) throw new Error("ctx is null");

const drawAgent = drawAgentFactory(ctx);

let frame = 0;
const draw = () => {
  frame++;
  requestAnimationFrame(() => draw());

  if (frame % 2 !== 0) return;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  agents.forEach(drawAgent);
  agents.forEach(updateAgentPosition);
};

requestAnimationFrame(() => draw());
