export class Vector {
  /**
   * @param {Array} valueArray Inputs an array with length 2.
   */
  constructor(valueArray) {
    this[0] = valueArray[0];
    this[1] = valueArray[1];
  }

  static copy(vector){
    return new Vector([vector[0], vector[1]])
  }

  get length() {
    return (this[0] ** 2 + this[1] ** 2) ** 0.5;
  }

  get isVaild() {
    return this[0] !== NaN && this[1] !== NaN;
  }

  get isNone() {
    return this[0] === this[1]
  }

  equal(vector){
    return this[0] === vector[0] && this[1] === vector[1]
  }

  add(vector) {
    return new Vector([this[0] + vector[0], this[1] + vector[1]]);
  }

  sub(vector) {
    return new Vector([this[0] - vector[0], this[1] - vector[1]]);
  }

  addNum(number){
    return new Vector([this[0] + number, this[1] + number])
  }

  subNum(number){
    return new Vector([this[0] - number, this[1] - number])
  }

  absValues(){
    return new Vector([Math.abs(this[0]), Math.abs(this[1])])
  }

  mulNum(number) {
    return new Vector([this[0] * number, this[1] * number]);
  }

  divNum(number) {
    return new Vector([this[0] / number, this[1] / number]);
  }

  sort(){
    return this[0] > this[1] ? (new Vector([this[1], this[0]])) : this 
  }

  // Following requires sorted vectors

  get linearLength(){
    return this[1] - this[0]
  }

  inRange(number) {
    return this[0] <= number && number <= this[1]
  }

  isIntersected(vector){
    return this.inRange(vector[0]) || this.inRange(vector[1]) || vector.inRange(this[0]) || vector.inRange(this[1])
  }

  moveInRange(move, rangeVector){
    const RealMove = move > 0 ? Math.min(rangeVector[1] - this[1], move) : Math.max(rangeVector[0] - this[0], move)
    return this.add([RealMove, RealMove])
  }
}