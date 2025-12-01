import { TemplateParser } from "../../support/templateParser.js";

const IconContainerDOM = document.getElementById("icons");

/**
 * @class Creates a desktop icon. This will be automatically done by app creator.
 */
export class DesktopIcon{
  get template(){
    return `
      <div class="desktop-icon-container" v-click="clickIcon">
        <img src="${this.icon}"/>
        <span>${this.name}</span>
      </div>
    `
  }
  
  constructor(icon, name, windowComponent){
    this.icon = icon
    this.name = name
    this.windowComponent = windowComponent

    this.element = new TemplateParser(this).element

    IconContainerDOM.append(this.element)
  }

  clickIcon(){
    new this.windowComponent().show()
  }
}