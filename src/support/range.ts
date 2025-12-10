export class Range{
  constructor(public start:number, public end:number){}

  /**
   * @returns A copy of the range to avoid shallow copying.
   */
  static copy(range: Range) {
    return new Range(range.start, range.end);
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
    return new Range(this.start, this.end)
  }

  sort(){
    return this.start > this.end ? new Range(this.end, this.start) : this.copy
  }

  // Math functions

  equal(range: Range) {
    return range.start === this.start && range.end === this.end
  }

  add(range: Range) {
    return new Range(this.start + range.start, this.end + range.end);
  }

  sub(range: Range) {
    return new Range(this.start - range.start, this.end - range.end);
  }

  addNum(number: number) {
    return new Range(this.start + number, this.end + number);
  }

  subNum(number: number) {
    return new Range(this.start - number, this.end - number);
  }

  mul(number: number) {
    return new Range(this.start * number, this.end * number);
  }

  div(number: number) {
    return new Range(this.start / number, this.end / number);
  }

  // others

  inRange(number: number) {
    return this.start <= number && number <= this.end;
  }

  isIntersected(range: Range) {
    return (
      this.inRange(range.start) ||
      this.inRange(range.end) ||
      range.inRange(this.start) ||
      range.inRange(this.end)
    );
  }
}