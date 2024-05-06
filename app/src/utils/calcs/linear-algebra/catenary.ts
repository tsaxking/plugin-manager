import { Point } from "./point";

export const getCatenaryPathFn = (start: Point, end: Point, sag: number, segments: number): (x: number) => number => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    const length = Math.sqrt(dx * dx + dy * dy);
    const half = length / 2;
    const a = sag / half;
    const b = Math.sqrt(1 + a * a);
    const c = Math.log(a + b);
    const d = Math.log(a + b * (length / sag));
    const e = (d - c) / segments;

    return (x: number) => {
        const y = sag * (Math.cosh((x - start.x) / sag - d) - a);
        return y + start.y;
    };
}

export const getCatenaryPathSVG = (start: Point, end: Point, sag: number): string => {
    const distance = start.distance(end);

    let length = 100;

    switch (true) {
      case distance < 400:
        length = 420;
        break;
      case distance < 900:
        length = 940;
        break;
      case distance < 1400:
        length = 1440;
        break;
      default:
        length = distance * 1.05;
    }
  
    const controlX = Math.round((start.x + end.x) / 2);
    const controlY = Math.round(Math.max(start.y, end.y) + length - distance * 0.5) * sag;
  
    return `M ${start.x} ${start.y} Q ${controlX} ${controlY} ${end.x} ${end.y}`;
}