import { NumberRange } from "./numberRange.ts";
import { Vector } from "./vector.ts";

export class Rectangle {
  corner1: Vector;
  corner2: Vector;
  xRange: NumberRange;
  yRange: NumberRange;

  constructor(corner1: Vector, corner2: Vector) {
    this.corner1 = Vector.copy(corner1);
    this.corner2 = Vector.copy(corner2);

    this.xRange = new NumberRange(corner1.x, corner2.x).sort();
    this.yRange = new NumberRange(corner1.y, corner2.y).sort();
  }

  static fromRange(xRange: NumberRange, yRange: NumberRange): Rectangle {
    return new Rectangle(
      new Vector(xRange.start, yRange.start),
      new Vector(xRange.end, yRange.end)
    );
  }

  static fromSize(leftTopCorner: Vector, width: number, height: number): Rectangle {
    return new Rectangle(leftTopCorner, leftTopCorner.add(new Vector(width, height)));
  }

  static copy(rect: Rectangle): Rectangle {
    return new Rectangle(rect.corner1, rect.corner2);
  }

  get center(): Vector {
    return this.corner1.add(this.corner2).div(2);
  }

  get isNone(): boolean {
    return this.xRange.isNone || this.yRange.isNone;
  }

  get height(): number {
    return this.corner2.y - this.corner2.x;
  }

  get width(): number {
    return this.corner1.y - this.corner1.x;
  }

  get leftTopCorner(): Vector {
    return new Vector(this.corner1.x, this.corner2.x);
  }

  get rightTopCorner(): Vector {
    return new Vector(this.corner1.y, this.corner2.x);
  }

  get leftBottomCorner(): Vector {
    return new Vector(this.corner1.x, this.corner2.y);
  }

  get rightBottomCorner(): Vector {
    return new Vector(this.corner1.y, this.corner2.y);
  }

  inRange(vector: Vector): boolean {
    return this.xRange.inRange(vector.x) && this.yRange.inRange(vector.y);
  }

  isIntersected(rectangle: Rectangle): boolean {
    return (
      this.xRange.isIntersected(rectangle.xRange) &&
      this.yRange.isIntersected(rectangle.yRange)
    );
  }

  moveX(deltaX: number): Rectangle {
    return Rectangle.fromRange(this.xRange.addNum(deltaX), this.yRange);
  }

  moveY(deltaY: number): Rectangle {
    return Rectangle.fromRange(this.xRange, this.yRange.addNum(deltaY));
  }

  move(vector: Vector): Rectangle {
    return Rectangle.fromRange(this.xRange.addNum(vector.x), this.yRange.addNum(vector.y));
  }

  // Assumes the rectangle is inside the container already.
  moveInContainer(deltaVector: Vector, containerRectangle: Rectangle): Rectangle {
    const newXRange = this.xRange.moveInRange(deltaVector.x, containerRectangle.xRange);
    const newYRange = this.yRange.moveInRange(deltaVector.y, containerRectangle.yRange);
    return Rectangle.fromRange(newXRange, newYRange);
  }
}