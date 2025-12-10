export class NumberRange{
  constructor(public start:number, public end:number){}

  /**
   * @returns A copy of the range to avoid shallow copying.
   */
  static copy(range: NumberRange) {
    return new NumberRange(range.start, range.end);
  }

  /**
   * @returns The length of the range.
   */
  get length(){
    return this.end - this.start
  }

  get isNone(){
    return this.length <= 0
  }

  get copy(){
    return new NumberRange(this.start, this.end)
  }

  sort(){
    return this.start > this.end ? new NumberRange(this.end, this.start) : this.copy
  }

  // Math functions

  equal(range: NumberRange) {
    return range.start === this.start && range.end === this.end
  }

  add(range: NumberRange) {
    return new NumberRange(this.start + range.start, this.end + range.end);
  }

  sub(range: NumberRange) {
    return new NumberRange(this.start - range.start, this.end - range.end);
  }

  addNum(number: number) {
    return new NumberRange(this.start + number, this.end + number);
  }

  subNum(number: number) {
    return new NumberRange(this.start - number, this.end - number);
  }

  mul(number: number) {
    return new NumberRange(this.start * number, this.end * number);
  }

  div(number: number) {
    return new NumberRange(this.start / number, this.end / number);
  }

  // others

  inRange(number: number) {
    return this.start <= number && number <= this.end;
  }

  isIntersected(range: NumberRange) {
    return (
      this.inRange(range.start) ||
      this.inRange(range.end) ||
      range.inRange(this.start) ||
      range.inRange(this.end)
    );
  }

  moveInRange(move: number, range: NumberRange) {
    const RealMove =
      move > 0
        ? Math.min(range.end - this.end, move)
        : Math.max(range.start - this.start, move);
    return this.addNum(RealMove);
  }
}