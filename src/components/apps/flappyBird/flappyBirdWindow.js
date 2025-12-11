import { SwapImage } from "../../../support/swapImage.js";
import { App } from "../../constructors/app-constructor.js";
import { Window } from "../../constructors/window-constructor.js";
import { FlappyBirdGame } from "./flappyBirdGame.js";

export class FlappyBirdWindow extends Window {
  get contentElementTemplate() {
    return `
      <div class="window-content flappy-bird-bg column" v-click="handleClick" draggable="false" />
        <div class="flappy-bird-score"></div>
        <div class="flappy-bird-fly-area"></div>
        <div class="flappy-bird-ground"></div>
        <div class="flappy-bird-hint-filter">
          <img class="flappy-bird-hint" name="start" src="./resources/apps/flappy-bird/start.png" draggable="false" />
          <img class="flappy-bird-hint inactive" name="gameover" src="./resources/apps/flappy-bird/gameover.png" draggable="false" />
          <div class="flappy-bird-hint-score"></div>
        </div>
      </div>
    `;
  }

  get icon() {
    return "./resources/apps/flappy-bird/0.png";
  }

  get style() {
    return {
      height: "800px",
      width: "1200px",
    };
  }

  get title() {
    return `Flappy Bird`;
  }

  constructor() {
    super({noFullscreen: true});
    this.game = new FlappyBirdGame(this);
    this.createElement();

    this.playerElements = new SwapImage(...this.allPlayerImages);
    this.playerElements.assignClass("flappy-bird-player");
    this.playerElements.setSwapInterval(0.5);
    this.playerElements.assignStyle({
      transform: `translate(100px, 275px)`,
    });

    this.hintFilter = this.contentElement.querySelector(".flappy-bird-hint-filter")
    this.startHintElement = this.contentElement.querySelector("[name='start']")
    this.gameoverHintElement = this.contentElement.querySelector("[name='gameover']")

    this.flyAreaElement = this.contentElement.querySelector(".flappy-bird-fly-area")

    this.flyAreaElement.append(
      ...this.playerElements.elements
    );

    this.gameoverCounter = 0

    this.scoreElement = this.contentElement.querySelector(".flappy-bird-score")
    this.scoreHintElement = this.contentElement.querySelector(".flappy-bird-hint-score")
  }

  get allPlayerImages() {
    let images = [];
    for (let i = 0; i <= 7; i++) {
      images.push(`./resources/apps/flappy-bird/${i}.png`);
    }
    return images;
  }

  update(diff) {
    if(this.gameoverCounter > 0){
      this.gameoverCounter -= diff
    }

    this.element.style.setProperty(
      "--bg-offset",
      this.game.player.bgOffset * -1 + "px"
    );

    this.element.style.setProperty(
      "--ground-offset",
      this.game.player.groundOffset * -1 + "px"
    );

    let playerPosition = this.game.player.position.leftTopCorner;
    this.playerElements.assignStyle({
      transform: `translate(${playerPosition[0]}px, ${playerPosition[1]}px)`,
    });

    this.scoreElement.innerHTML = this.game.player.score
  }

  addObstacle(obstacle){
    this.flyAreaElement.append(obstacle.element)
  }

  handleClick() {
    if(this.gameoverCounter > 0) return

    if (!this.game.running) {
      this.game.player.obstacles.forEach(element => {
        element.remove()
      });
      this.game.start()
      this.hintFilter.classList.add("inactive")
      this.startHintElement.classList.add("inactive")
      this.playerElements.start()

    } else if(this.game.isGameover){
      this.hintFilter.classList.add("inactive")
      this.gameoverHintElement.classList.add("inactive")
      this.playerElements.start()
      this.game.start()

    } else {
      this.game.handleClick();
    }
  }

  handleGameover(){
    this.gameoverCounter = 1
    this.playerElements.stop()
    this.hintFilter.classList.remove("inactive")
    this.gameoverHintElement.classList.remove("inactive")
    this.scoreHintElement.innerHTML = "Score:" + this.game.player.score
  }
}

export const FlappyBird = new App({
  title: "Flappy Bird",
  icon: "./resources/apps/flappy-bird/0.png",
  windowComponent: FlappyBirdWindow,
  startNavigation: true,
  desktopIcon: true,
});
