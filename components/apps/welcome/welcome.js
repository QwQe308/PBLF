import { App } from "../../constructors/app-constructor.js";
import { Window } from "../../constructors/window-constructor.js";
import { InternetExplorerWindow } from "../internetExplorer/internetExplorer.js";
import { WindowSpawnerWindow } from "../windowSpawner/windowSpawner.js";
import { FlappyBirdWindow } from "../flappyBird/flappyBirdWindow.js";

export class WelcomeWindow extends Window {
  get contentElementTemplate() {
    return `
      <div class="welcome-window window-content">
        <div class="column full-width">
          <h1 class="font-Times-New-Roman">Welcome to <span class="bolder">Windows</span><span class="white thin margin-left-3">95</span></h1>
          <div class="row full-width">
            <div class="welcome-window-yellow-inner">
              <p class="bold font-17"><img class="tour" src="./resources/window-icons/tour.png" />您知道...</p>
              <p>要再次打开这个窗口，只需单击 “开始” 按钮，然后单击 “欢迎” 图标。
            </div>
            <div class="column x-center">
              <button class="basic-button normal-size margin-bottom-10" v-click="openIE"><span>体验IE</span></button>
              <button class="basic-button normal-size margin-bottom-10" v-click="openWindowSpawner"><span>创建自定义窗口</span></button>
              <button class="basic-button normal-size margin-bottom-10" v-click="openFlappyBird"><span>游玩Flappy Bird</span></button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  get style() {
    return {
      height: "400px",
      width: "700px",
      top: "300px",
      left: "500px"
    };
  }

  get title() {
    return `欢迎`;
  }

  get icon() {
    return "./resources/window-icons/welcome.ico";
  }

  openIE(){
    new InternetExplorerWindow().show()
  }

  openWindowSpawner(){
    new WindowSpawnerWindow().show()
  }

  openFlappyBird(){
    new FlappyBirdWindow().show()
  }

  constructor() {
    super({ noHide: true, noFullscreen: true });
    this.createElement()
  }
}

export const Welcome = new App({
  title: "Welcome",
  icon: "./resources/window-icons/welcome.ico",
  windowComponent: WelcomeWindow,
  startNavigation: true,
  desktopIcon: false,
});
