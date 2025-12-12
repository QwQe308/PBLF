import { NumberRange } from "../../../support/numberRange.ts";
import { Rectangle } from "../../../support/rectangle.ts";

const ObstacleWidth = 78;
const ObstacleGap = 144;

export type ObstacleEvent = "Score" | "Gameover" | "Remove" | null;

export class Obstacle {
  public xPosition: number;
  public yPosition: number;
  private sizeRectangles: Rectangle[] = [
    Rectangle.fromRange(new NumberRange(0, 0), new NumberRange(0, 0)),
    Rectangle.fromRange(new NumberRange(0, 0), new NumberRange(0, 0)),
  ];
  public scored: boolean;

  public id: number;

  constructor(xPosition: number) {
    this.xPosition = xPosition;
    this.yPosition = Math.random() * 325 + 125;
    this.scored = false;
    this.id = Date.now() + Math.random(); // 简单的唯一ID

    this.updateSizeRectangles();
  }

  private updateSizeRectangles() {
    this.sizeRectangles = [
      // Upper pipe
      Rectangle.fromRange(
        new NumberRange(this.xPosition, this.xPosition + ObstacleWidth),
        new NumberRange(0, this.yPosition - ObstacleGap / 2)
      ),
      // Lower pipe
      Rectangle.fromRange(
        new NumberRange(this.xPosition, this.xPosition + ObstacleWidth),
        new NumberRange(this.yPosition + ObstacleGap / 2, 10000)
      ),
    ];
  }

  get transform(): string {
    return `translateY(-50%) translate(${this.xPosition}px, ${this.yPosition}px)`;
  }

  moveX(deltaX: number) {
    this.xPosition += deltaX;
    this.updateSizeRectangles();
  }

  /**
   * @function checkEvents Check the event occured to the obstacle.
   */
  checkEvents(playerPosition: Rectangle): ObstacleEvent {
    if (!this.sizeRectangles[0] || !this.sizeRectangles[1]) return null;

    let playerX = playerPosition.xRange.start;

    // score
    if (!this.scored && playerX > this.xPosition + ObstacleWidth) {
      this.scored = true;
      return "Score";
    }

    // remove
    if (playerX > this.xPosition + 200) {
      return "Remove";
    }

    // gameover
    if (
      playerPosition.isIntersected(this.sizeRectangles[0]) ||
      playerPosition.isIntersected(this.sizeRectangles[1])
    ) {
      return "Gameover";
    }

    return null;
  }
}
