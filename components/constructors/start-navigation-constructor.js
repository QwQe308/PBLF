import { TemplateParser } from "../../support/templateParser.js"

const StartNavigationContainer = document.getElementById("start-navigation")

/**
 * @class Creates a start navigation. This will be automatically done by app creator.
 */
export class StartNavigation{
  get template(){
    return `
    <div class="start-navigation-block" v-mousedown="openWindow">
      <div class="row y-center"><img src="${this.icon}"><span>${this.title}</span></div>
    </div>
    `
  }
  
  constructor(icon, title, windowComponent){
    this.icon = icon
    this.title = title
    this.windowComponent = windowComponent

    this.element = new TemplateParser(this).element
    StartNavigationContainer.append(this.element)
  }

  openWindow(){
    new this.windowComponent().show()
  }
}