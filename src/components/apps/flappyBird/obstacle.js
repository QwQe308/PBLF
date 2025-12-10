import { Rectangle } from "../../../support/rectangle.js";
import { TemplateParser } from "../../../support/templateParser.js";

const ObstacleWidth = 78;
const ObstacleGap = 144;

export class Obstacle {
  get template() {
    return `
      <img class="flappy-bird-obstacle" src="./resources/apps/flappy-bird/pipe.png">
    `;
  }

  constructor(xPosition) {
    this.xPosition = xPosition;
    this.yPosition = Math.random() * 325 + 125;
    this.sizeRectangles = [
      Rectangle.fromRange([xPosition, xPosition + ObstacleWidth], [0, this.yPosition - ObstacleGap / 2]),
      Rectangle.fromRange([xPosition, xPosition + ObstacleWidth], [this.yPosition + ObstacleGap / 2, 10000]),
    ];

    this.element = new TemplateParser(this).element;
    this.element.style.transform = this.transform;
    this.scored = false
  }

  get transform() {
    return `translateY(-50%) translate(${this.xPosition}px, ${this.yPosition}px)`;
  }

  moveX(deltaX) {
    this.xPosition += deltaX;
    this.sizeRectangles = this.sizeRectangles.map(x => x.moveX(deltaX))
    this.element.style.transform = this.transform;
  }

  checkEvents(playerPosition){
    let playerX = playerPosition.xRange[0]
    console.log(this.sizeRectangles)
    if(!this.scored && playerX > this.xPosition + 78){
      this.scored = true
      return "Score"
    }else if(playerX > this.xPosition + 200){
      this.remove()
      return "Remove"
    }else if(playerPosition.isIntersected(this.sizeRectangles[0]) || playerPosition.isIntersected(this.sizeRectangles[1])){
      return "Gameover"
    }else{
      return null
    }
  }

  remove() {
    this.element.remove();
  }
}
