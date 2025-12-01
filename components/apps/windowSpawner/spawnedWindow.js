import { Window } from "../../constructors/window-constructor.js";

export class SpawnedWindow extends Window {
  get contentElementTemplate() {
    return `
            <div class="window-content">
              ${this.data.content}
            </div>
        `;
  }

  get icon() {
    return "./resources/desktop-icons/window-spawner.ico";
  }

  get style() {
    return {
      height: this.data.height + "px",
      width: this.data.width + "px",
    };
  }

  get title() {
    return this.data.title;
  }

  constructor(data) {
    super({
      noHide: data.noHide,
      noFullscreen: data.noFullscreen,
      noClose: data.noClose,
    });

    this.data = data

    this.createElement()
  }
}
