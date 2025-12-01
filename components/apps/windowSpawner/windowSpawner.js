import { App } from "../../constructors/app-constructor.js";
import { Window } from "../../constructors/window-constructor.js";
import { AlertWindow } from "./alertWindow.js";
import { SpawnedWindow } from "./spawnedWindow.js";

export class WindowSpawnerWindow extends Window {
  get contentElementTemplate() {
    return `
      <div>
        <div class="window-content column">
        <div class="row x-center margin-bottom-2">
          <span class="y-center">生成的窗口名叫什么?</span>
        </div>
        <div class="row x-center margin-bottom-10">
          <input class="basic-input" type="string" placeholder="取个名吧" v-change="updateInput" name="title" />
        </div>
        <div class="row x-center margin-bottom-2">
          <span class="y-center">生成的窗口大小是多少? (单位:像素, 参考该窗口为700*400)</span>
        </div>
        <div class="row x-center margin-bottom-10">
          <input class="basic-input" type="string" placeholder="宽" v-change="updateInput" name="width" />
          <input class="basic-input" type="string" placeholder="高" v-change="updateInput" name="height" />
        </div>
        <div class="row x-center margin-bottom-2">
          <span class="y-center">生成的窗口内容是什么?</span>
        </div>
        <div class="row x-center margin-bottom-10">
          <textarea class="basic-text-area" placeholder="Hello World!" draggable="false" v-change="updateInput" name="content"></textarea>
        </div>
        <div class="row x-center">
          <span class="margin-right-2">不可最小化</span>
          <div class="checkbox-container margin-right-10">
            <input class="checkbox" type="checkbox" v-change="updateCheckbox" name="noHide">
            <span></span>
          </div>
          <span class="margin-right-2">不可全屏</span>
          <div class="checkbox-container margin-right-10">
            <input class="checkbox" type="checkbox" v-change="updateCheckbox" name="noFullscreen">
            <span></span>
          </div>
          <span class="margin-right-2">不可关闭 (!慎重勾选)</span>
          <div class="checkbox-container margin-right-10">
            <input class="checkbox" type="checkbox" v-change="updateCheckbox" name="noClose">
            <span></span>
          </div>
        </div>
        <button class="basic-button normal-size center" v-click="spawnWindow"><span>生成窗口</span></button>
      </div>
    </div>
    `;
  }

  get icon() {
    return "./resources/desktop-icons/window-spawner.ico";
  }

  get style() {
    return {
      height: "400px",
      width: "700px",
    };
  }

  get title() {
    return `Window Spawner`;
  }

  updateInput(event) {
    let target = event.target;
    let value = target.value;
    let key = target.getAttribute("name");
    this.windowToSpawn[key] = value;
  }

  updateCheckbox(event) {
    let target = event.target;
    let value = target.checked;
    let key = target.getAttribute("name");
    this.windowToSpawn[key] = value;
  }

  spawnWindow() {
    let width = Number(this.windowToSpawn.width)
    let height = Number(this.windowToSpawn.height)
    if(!width || width < 100 || width > 1000) return new AlertWindow("宽度应为100~1000的合法数字!").show()
    if(!height || height < 100 || height > 1000) return new AlertWindow("宽度应为100~1000的合法数字!").show()
    new SpawnedWindow(this.windowToSpawn).show()
  }

  constructor() {
    super();
    this.windowToSpawn = {
      title: "",
      width: "",
      height: "",
      content: "",
      noHide: false,
      noFullscreen: false,
      noClose: false,
    };

    this.createElement()
  }
}

export const WindowSpawner = new App({
  title: "Window Spawner",
  icon: "./resources/desktop-icons/window-spawner.ico",
  windowComponent: WindowSpawnerWindow,
  startNavigation: true,
  desktopIcon: true,
});
