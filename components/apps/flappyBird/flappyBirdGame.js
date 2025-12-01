import { Interval } from "../../../support/interval.js";
import { Rectangle } from "../../../support/rectangle.js";
import { Vector } from "../../../support/vector.js";
import { Obstacle } from "./obstacle.js";

const FlyAreaHeight = 588.23;

export class FlappyBirdGame {
  constructor(windowComponent) {
    this.windowComponent = windowComponent;

    this.player = {};
    Object.assign(this.player, this.defaultPlayerData);
    this.running = false;
    this.isGameover = false;
  }

  get defaultPlayerData() {
    return {
      // 0.png Invisible pixels: top 12 left 3 right 2
      // so we make it smaller
      position: Rectangle.fromSize([100, 275], [35, 14]),
      score: 0,
      speed: new Vector([300, 0]),
      obstacles: new Set(),
      obstacleSpawnTimer: 0,
      bgOffset: 0,
      groundOffset: 0,
      startSlowdown: 1,
    };
  }

  get Yacceleration() {
    return 1200;
  }

  get jumpSpeed() {
    return 500;
  }

  start() {
    Object.assign(this.player, this.defaultPlayerData);
    this.interval = new Interval(this.gameInterval.bind(this));
    if (!this.isGameover) this.interval.set();
    this.running = true;
    this.isGameover = false;
  }

  gameInterval(diff) {
    if (this.player.startSlowdown > 0 && this.running) {
      this.player.startSlowdown -= diff;
      diff /= 1 + this.player.startSlowdown * 2;
    }

    if (this.running) {
      // Handle bird
      diff = Math.min(diff, 0.2);
      this.player.speed[1] =
        (this.player.speed[1] + this.Yacceleration * diff) * 0.7 ** diff;
      this.player.position = this.player.position.moveY(
        this.player.speed[1] * diff
      );

      // Handle obstacles
      this.player.obstacleSpawnTimer -= diff;
      if (this.player.obstacleSpawnTimer < 0) {
        let newObstacle = new Obstacle(1400);
        this.player.obstacles.add(newObstacle);
        this.windowComponent.addObstacle(newObstacle);
        this.player.obstacleSpawnTimer = 2;
      }
      this.player.obstacles.forEach((obstacle) => {
        obstacle.moveX(this.player.speed[0] * -diff);

        switch(obstacle.checkEvents(this.player.position)){
          case "Score":
            this.player.score ++
            break
          case "Gameover":
            this.gameover()
            break
        }
      });

      // Handle background
      this.player.bgOffset += this.player.speed[0] * diff * 1.6;
      this.player.groundOffset += this.player.speed[0] * diff;

      // Handle game events
      if (
        this.player.position.yRange[0] < 0 ||
        this.player.position.yRange[1] > FlyAreaHeight
      ) {
        this.gameover();
      }
    }

    this.windowComponent.update(diff);
  }

  handleClick() {
    this.player.speed[1] = Math.min(
      -this.jumpSpeed,
      (this.player.speed[1] - this.jumpSpeed) / 1.6
    );
  }

  gameover() {
    this.running = false;
    this.isGameover = true;
    this.windowComponent.handleGameover();
  }

  close() {
    this.interval.remove();
  }
}
