import { Interval } from "../../../support/interval.ts";
import { Rectangle } from "../../../support/rectangle.ts";
import { Vector } from "../../../support/vector.ts";
import { Obstacle } from "./obstacle.ts";

const FlyAreaHeight = 588.23;

export interface PlayerState {
  position: Rectangle;
  score: number;
  speed: Vector;
  obstacleSpawnTimer: number,
  bgOffset: number;
  groundOffset: number;
  startSlowdown: number;
}

export interface GameState {
  running: boolean;
  isGameover: boolean;
  player: PlayerState;
  obstacles: Set<Obstacle>;
  gameoverCounter: number;
}

interface GameCallbacks {
  onGameover: (score: number) => void;
  onStateUpdate: (state: GameState) => void;
}

export class FlappyBirdGame {
  private interval: Interval;
  public state: GameState;
  private callbacks: GameCallbacks;

  private defaultPlayerData: PlayerState = {
    position: Rectangle.fromSize(new Vector(100, 275), 35, 14),
    score: 0,
    speed: new Vector(300, 0),
    obstacleSpawnTimer: 0,
    bgOffset: 0,
    groundOffset: 0,
    startSlowdown: 1,
  };

  constructor(callbacks: GameCallbacks) {
    this.callbacks = callbacks;
    this.state = {
      running: false,
      isGameover: false,
      player: { ...this.defaultPlayerData },
      obstacles: new Set(),
      gameoverCounter: 0,
    };
    this.interval = new Interval(this.gameInterval.bind(this));
  }

  get Yacceleration(): number {
    return 1200;
  }

  get jumpSpeed(): number {
    return 500;
  }

  start() {
    Object.assign(this.state.player, this.defaultPlayerData);
    this.state.obstacles.clear();

    if (!this.state.isGameover) this.interval.set();

    this.state.running = true;
    this.state.isGameover = false;
    this.callbacks.onStateUpdate(this.state);

    this.interval.set()
  }

  private gameInterval(diff: number) {
    if (this.state.running) {
      // Slowdown the game on start, to avoid instant death before actions
      if (this.state.player.startSlowdown > 0) {
        this.state.player.startSlowdown -= diff;
        diff /= 1 + this.state.player.startSlowdown * 2;
      }

      // Avoid background running
      diff = Math.min(diff, 0.2);

      // position
      this.state.player.speed.y =
        (this.state.player.speed.y + this.Yacceleration * diff) * 0.7 ** diff;
      this.state.player.position = this.state.player.position.moveY(
        this.state.player.speed.y * diff
      );

      // Spawn Obstacles
      this.state.player.obstacleSpawnTimer -= diff;
      if (this.state.player.obstacleSpawnTimer < 0) {
        let newObstacle = new Obstacle(1400);
        this.state.obstacles.add(newObstacle);
        this.state.player.obstacleSpawnTimer = 2;
      }

      // Check Obstacles Events
      this.state.obstacles.forEach((obstacle) => {
        obstacle.moveX(this.state.player.speed.x * -diff);

        switch (obstacle.checkEvents(this.state.player.position)) {
          case "Score":
            this.state.player.score++;
            break;
          case "Gameover":
            this.gameover();
            break;
          case "Remove":
            this.state.obstacles.delete(obstacle)
            break;
        }
      });

      // Background moves
      this.state.player.bgOffset += this.state.player.speed.x * diff * 1.6;
      this.state.player.groundOffset += this.state.player.speed.x * diff;

      // Check collisions with sky / ground
      if (
        this.state.player.position.yRange.start < 0 ||
        this.state.player.position.yRange.end > FlyAreaHeight
      ) {
        this.gameover();
      }
    }

    if (this.state.gameoverCounter > 0) {
      this.state.gameoverCounter -= diff;
    }

    this.callbacks.onStateUpdate(this.state);
  }

  handleClick() {
    if (!this.state.running) return;
    this.state.player.speed.y = Math.min(
      -this.jumpSpeed,
      (this.state.player.speed.y - this.jumpSpeed) / 1.6
    );
  }

  gameover() {
    if (this.state.isGameover) return;
    this.state.running = false;
    this.state.isGameover = true;
    this.state.gameoverCounter = 1; // Avoid fast click caused instant restart
    if (this.interval) this.interval.remove();
    this.callbacks.onGameover(this.state.player.score);
  }

  close() {
    if (this.interval) this.interval.remove();
  }
}
