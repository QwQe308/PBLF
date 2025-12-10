import { Vector } from "./vector.js";

export class Rectangle {
  constructor(corner1, corner2) {
    this.corner1 = Vector.copy(corner1);
    this.corner2 = Vector.copy(corner2);

    this.xRange = new Vector([corner1[0], corner2[0]]).sort();
    this.yRange = new Vector([corner1[1], corner2[1]]).sort();
  }

  static fromRange(xRange, yRange){
    return new Rectangle([xRange[0], yRange[0]],[xRange[1], yRange[1]])
  }

  static fromSize(leftTopCorner, sizeVector){
    leftTopCorner = Vector.copy(leftTopCorner)
    return new Rectangle(leftTopCorner, leftTopCorner.add(sizeVector))
  }

  static copy(rect) {
    return new Rectangle(rect.corner1, rect.corner2);
  }

  get center() {
    return this.corner1.add(this.corner2).divNum(2);
  }

  get isNone() {
    return this.xRange.isNone || this.yRange.isNone
  }

  get height(){
    return this.yRange[1] - this.yRange[0]
  }

  get width(){
    return this.xRange[1] - this.xRange[0]
  }

  get leftTopCorner(){
    return new Vector([this.xRange[0], this.yRange[0]])
  }

  get rightTopCorner(){
    return new Vector([this.xRange[1], this.yRange[0]])
  }

  get leftBottomCorner(){
    return new Vector([this.xRange[0], this.yRange[1]])
  }

  get rightBottomCorner(){
    return new Vector([this.xRange[1], this.yRange[1]])
  }

  inRange(vector) {
    return this.xRange.inRange(vector[0]) && this.yRange.inRange(vector[1]);
  }

  isIntersected(rectangle) {
    return (
      this.xRange.isIntersected(rectangle.xRange) &&
      this.yRange.isIntersected(rectangle.yRange)
    );
  }

  moveX(deltaX){
    return Rectangle.fromRange(this.xRange.addNum(deltaX), this.yRange)
  }

  moveY(deltaY){
    return Rectangle.fromRange(this.xRange, this.yRange.addNum(deltaY))
  }

  move(vector){
    return Rectangle.fromRange(this.xRange.addNum(vector[0]), this.yRange.addNum(vector[1]))
  }

  // Assumes the rectangle is inside the container already.
  moveInContainer(deltaVector, containerRectangle){
    const newXRange = this.xRange.moveInRange(deltaVector[0], containerRectangle.xRange)
    const newYRange = this.yRange.moveInRange(deltaVector[1], containerRectangle.yRange)
    return Rectangle.fromRange(newXRange, newYRange)
  }
}
