const { random, floor } = Math;

const main = document.querySelector("main");
if (main === null) throw new Error("main is null");

const width = 500;
const height = 500;

const canvas = document.createElement("canvas");
canvas.width = width;
canvas.height = height;

const size = 5;

main.appendChild(canvas);

type Pixel = {
  r: number;
  g: number;
  b: number;
};

const createValue = () => floor(random() * 255);

const createPixel = (): Pixel => {
  const pixel: Pixel = {
    r: createValue(),
    g: createValue(),
    b: createValue(),
  };

  return pixel;
};

const ctx = canvas.getContext("2d");
if (ctx === null) throw new Error("ctx is null");

let frame = 0;
const draw = () => {
  frame++;
  requestAnimationFrame(() => draw());

  if (frame % 6 !== 0) return;

  const pixels: Pixel[][] = [];
  for (let y = 0; y < height / size; y++) {
    const row: Pixel[] = [];
    for (let x = 0; x < width / size; x++) {
      row.push(createPixel());
    }
    pixels.push(row);
  }

  for (let y = 0; y < height / size; y++) {
    const row = pixels[y];
    if (typeof row === "undefined") throw new Error("row is undefined");

    for (let x = 0; x < width / size; x++) {
      const pixel = row[x];
      if (typeof pixel === "undefined") throw new Error("pixel is undefined");

      ctx.fillStyle = `rgb(${pixel.r} ${pixel.g} ${pixel.b})`;

      ctx.fillRect(x * size, y * size, size, size);
    }
  }
};

requestAnimationFrame(() => draw());
