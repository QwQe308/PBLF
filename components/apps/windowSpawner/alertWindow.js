import { Window } from "../../constructors/window-constructor.js";

export class AlertWindow extends Window {
  get contentElementTemplate() {
    return `
            <div class="window-content">
              <div class="row">
                <img class="alert-error-img" src="${this.icon}">
                <span>${this.text}</span>
              </div>
              <button class="basic-button bottom-center normal-size" v-click="close"><span>OK</span></button>
            </div>
        `;
  }

  get icon() {
    return "./resources/window-icons/error.ico";
  }

  get style() {
    return {
      height: "200px",
      width: "500px",
    };
  }

  get title() {
    return "ERROR";
  }

  constructor(text) {
    super({noFullscreen: true, noHide: true})

    this.text = text
    this.createElement()
  }
}