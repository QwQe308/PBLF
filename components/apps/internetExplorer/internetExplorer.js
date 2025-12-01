import { App } from "../../constructors/app-constructor.js";
import { Window } from "../../constructors/window-constructor.js";

export class InternetExplorerWindow extends Window {
  get contentElementTemplate() {
    return `
      <div class="window-content column">
        <div class="IE-navigation">
          <span>Address:</span>
          <input id="IE-input" type="string" class="basic-input IE-address-input" value="https://www.lingrui.club" v-keydown="loadPage" />
        </div>
        <iframe id="IE-inner" src="https://www.lingrui.club" class="IE-inner" />
      </div>
    `;
  }

  get icon(){
    return "./resources/desktop-icons/internet-explorer.ico"
  }

  get style() {
    return {
      height: "800px",
      width: "1200px",
    }
  }

  get title(){
    return `Internet Explorer`
  }

  loadPage(event){
    if(event.key !== "Enter") return
    this.innerIframe.src = this.inputElement.value
  }

  constructor() {
    super();
    this.createElement()
    this.inputElement = this.element.querySelector("#IE-input")
    this.innerIframe = this.element.querySelector("#IE-inner")
  }
}

export const InternetExplorer = new App({
  title: "Internet Explorer",
  icon: "./resources/desktop-icons/internet-explorer.ico",
  windowComponent: InternetExplorerWindow,
  startNavigation: true,
  desktopIcon: true,
});
