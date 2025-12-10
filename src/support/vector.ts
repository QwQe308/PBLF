import type { Range } from "./range";

export class Vector {
  constructor(public x: number, public y: number) {}

  /**
   * @returns A copy of the vector to avoid shallow copying.
   */
  static copy(vector: Vector) {
    return new Vector(vector.x, vector.y);
  }

  /**
   * @returns The length of the vector.
   */
  get length() {
    return (this.x ** 2 + this.y ** 2) ** 0.5;
  }

  equal(vector: Vector) {
    return this.x === vector.x && this.y === vector.y;
  }

  add(vector: Vector) {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  sub(vector: Vector) {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  addNum(number: number) {
    return new Vector(this.x + number, this.y + number);
  }

  subNum(number: number) {
    return new Vector(this.x - number, this.y - number);
  }

  absValues() {
    return new Vector(Math.abs(this.x), Math.abs(this.y));
  }

  mul(number: number) {
    return new Vector(this.x * number, this.y * number);
  }

  div(number: number) {
    return new Vector(this.x / number, this.y / number);
  }

  // Following requires sorted vectors

  inRange(number: number) {
    return this.x <= number && number <= this.y;
  }

  isIntersected(vector: Vector) {
    return (
      this.inRange(vector.x) ||
      this.inRange(vector.y) ||
      vector.inRange(this.x) ||
      vector.inRange(this.y)
    );
  }

  moveInRange(move: number, range: Range) {
    const RealMove =
      move > 0
        ? Math.min(range.end - this.y, move)
        : Math.max(range.start - this.x, move);
    return this.addNum(RealMove);
  }
}
